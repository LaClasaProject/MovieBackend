import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  randomUUID,
  createHash
} from 'crypto'

import jsonwebtoken from 'jsonwebtoken'
import { Knex } from 'knex'

import config from '../../config.json'
import { IUser, UserKeys, PartialUserKeys } from '../Responses'

import {
  IEncryptedToken,
  INewOauthAccountResponse,
  IOauthAccountEntry,
  IOauthAccountUpdate,
  ISetUsernameOptions,
  ISetUsernameResponse
} from '../Types'

class Utils {
  /**
   * Generate a random 32 byte string.
   */
  public static generate32ByteId(): Promise<string> {
    return new Promise(
      (resolve) => {
        const bytes = randomBytes(32)
        resolve(
          bytes.toString('hex')
        )
      }
    )
  }

  /**
   * Generate a random UUID.
   */
  public static generateUUID(): Promise<string> {
    return new Promise(
      (resolve) => {
        return resolve(
          randomUUID()
        )
      }
    )
  }

  /**
   * Encrypts any data into an enrypted jwt token.
   * @param data The data to encrypt. Must be an **object**.
   * @param expiresIn Time before the token expires.
   */
  public static encryptJWT(data: any, expiresIn: number): Promise<string> {
    return new Promise(
      (resolve) => {
        const iv = randomBytes(16),
          token  = jsonwebtoken.sign(
            data,
            config.jwt_secret,
            {
              expiresIn: expiresIn * 1000
            }
          )

        const cipher  = createCipheriv('aes-256-ctr', config.cypher_iv_key, iv),
            encrypted = Buffer.concat(
              [
                cipher.update(token),
                cipher.final()
              ]
            )
          
        // create one more jwt token, this time containing the encrypted version and iv
        return resolve(
          jsonwebtoken.sign(
            {
              iv: iv.toString('hex'),
              token: encrypted.toString('hex')
            },
            config.jwt_secret
          )
        )
      }
    )
  }

  /**
   * Decrypts an encrypted jwt token.
   * @param token The token to decrypt.
   */
  public static decryptJWT<T>(token: string): Promise<T | null> {
    return new Promise(
      (resolve) => {
        try {
          jsonwebtoken.verify(token, config.jwt_secret)
        } catch { return resolve(null) }

        const data: IEncryptedToken = jsonwebtoken.decode(token),
          decipher = createDecipheriv(
            'aes-256-ctr',
            config.cypher_iv_key,
            Buffer.from(data.iv, 'hex')
          ),
          decrypted = Buffer.concat(
            [
              decipher.update(
                Buffer.from(data.token, 'hex')
              ),
              decipher.final()
            ]
          )

        const jwt = decrypted.toString()
        try {
          jsonwebtoken.verify(jwt, config.jwt_secret)
        } catch { return resolve(null) }

        const jsonData = jsonwebtoken.decode(jwt) as T
        return resolve(jsonData)
      }
    )
  }

  /**
   * Creates a new account from an oauth login, or just return the existing one.
   * @param db The knex database object.
   * @param oauth The oauth data for updating the database.
   */
  public static async oAuthNewAccountEntry(
    db: Knex,
    oauth: IOauthAccountEntry
  ): Promise<INewOauthAccountResponse> {
    const user = await db.select(
        [
          oauth.idColumn,
          'AccountId',
          'Username'
        ]
      )
      .from(config.db.table)
      .where(
        oauth.idColumn,
        oauth.userId
      )
      .first()

    let accountId: string,
      isNew: boolean = false

    if (!user) {
      await db.insert(
          {
            AccountId: accountId = await Utils.generateUUID(),
            [oauth.idColumn]: oauth.userId
          }
        )
        .into(config.db.table)

      isNew = true
    } else {
      accountId = user.AccountId

      if (!user.Username)
        isNew = true
    }

    return {
      accountId,
      isNew
    }
  }

  /**
   * Updates a user's oauth account in the database.
   * @param db The knex database object.
   * @param oauth The oauth data for updating the database.
   */
  public static async linkOauthAccount(
    db: Knex,
    oauth: IOauthAccountUpdate
  ) {
    // update the oauth account
    const amount = await db.update(
        {
          [oauth.idColumn]: oauth.userId
        }
      )
      .from(config.db.table)
      .where(
        'AccountId',
        oauth.accountId
      )

    return {
      success: amount > 0 // "amount" is the amount of rows updated
    }
  }

  /**
   * Sets the account's username.
   * @param db The knex database object.
   * @param options Options for the new username.
   */
  public static async setAccountUsername(
    db: Knex,
    options: ISetUsernameOptions
  ): Promise<ISetUsernameResponse> {
    const { username, accountId } = options
    if (!username ||
        username.length < 3 ||
        username.length > 24 ||
        !/^[a-zA-Z0-9_]+$/.test(username))
      return {
        success: false,
        message: 'invalid username provided.'
      }

    // check if there's a username found
    const matchUser = await db.select(
        [
          'Username'
        ]
      )
      .from(config.db.table)
      .whereRaw(
        'LOWER(Username) = ?',
        [
          username.toLowerCase()
        ]
      )
      .first()

    if (!matchUser) // no user exists with that username, we can use it
      await db.update(
        {
          Username: username
        }
      )
      .into(config.db.table)
      .where(
        'AccountId',
        accountId
      )
    else // someone is using that username, abort mission kowalski
      return {
        success: false,
        message: `username: "${username}" is already in use.`
      }

    return { success: true }
  }

  /**
   * Gets a player from the database/
   * @param db The database object
   * @param userId The id of the user to fetch
   */
  public static async getPlayerById(
    db: Knex,
    userId: number,
    withPassword?: boolean
  ): Promise<IUser | null> {
    const player =
      await db.select<IUser | null>(
          withPassword ? UserKeys : PartialUserKeys
        )
        .from('Players')
        .where(
          'UserId',
          userId
        )
        .first()

    return player
  }

  public static hashString(str: string) {
    return new Promise(
      (resolve) => {
        const hashedStr = createHash('sha512')
          .update(str)
          .digest('hex')

        return resolve(hashedStr)
      }
    )
  }

  /**
   * Links a userId from the players database to a website account.
   * @param db The database object.
   * @param accountId The account id of the web user.
   * @param userId The user id of the beef account.
   */
  public static async linkAccount(
    db: Knex,
    accountId: string,
    userId: number,
    password: string
  ) {
    // validate the userid
    if (isNaN(userId) ||
        userId > Number.MAX_SAFE_INTEGER ||
        userId < 1)
      return {
        success: false,
        message: 'invalid userId provided.'
      }

    // validate password
    if (!password)
      return {
        success: false,
        message: 'please provide a password for user verification purposes.'
      }

    // once the userId is validated
    // check if this userId is a valid user
    const player = await Utils.getPlayerById(db, userId, true)
    if (!player)
      return {
        success: false,
        message: 'user does not exist.'
      }

    // compare the password for linking
    const hashedPassword = await Utils.hashString(password),
      passwordInDatabase = player.Password.toString('hex')

    if (hashedPassword !== passwordInDatabase)
      return {
        success: false,
        message: 'password doesn\'t match for user.'
      }

    // check if the userId is linked to any accounts
    // by first, fetching all users
    const users = await db.select<{
        AccountId: string
        Accounts: Buffer
      }[]>(
        [
          'AccountId',
          'Accounts'
        ]
      )
      .from(config.db.table)

    let hasFailed = false

    // loop through each user and check if
    // the userid is linked
    for (const user of users) {
      // convert the Accounts buffer to a Uint32Array
      const buff = new Uint32Array(user.Accounts?.buffer)
      if (buff.includes(userId)) {
        hasFailed = true

        break
      }
    }

    // if the userid is not linked, we can link it
    if (!hasFailed) { 
      const user = users.find(
        (u) => u.AccountId === accountId
      )

      // add new account to user
      const idBuffer = Buffer.alloc(4)
      idBuffer.writeUInt32LE(userId)

      user.Accounts = Buffer.concat(
        [
          user.Accounts,
          idBuffer
        ]
      )

      await db.update(
          {
            Accounts: user.Accounts
          }
        )
        .from(config.db.table)
        .where(
          'AccountId',
          accountId
        )
    }

    return {
      success: !hasFailed
    }
  }
}

export default Utils