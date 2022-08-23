import HttpServer from './base/HttpServer'
import { IUser, IUserTiers } from './types/Database'

import { IEncryptedToken, INewVideoProps, IPaypalAccessTokenResult, IPaypalOrder } from './types/Http'
import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'crypto'

import jsonwebtoken from 'jsonwebtoken'
import axios from 'axios'

// V2 Utils
class Utils {
  constructor(public server: HttpServer) {}

  public async getVideoById(_id: string) {
    return await this.server.models.Videos.findById(_id)
  }

  public async getVideos(
    options?: {
      skip: number,
      limit: number,
      pinned?: boolean,
      upcoming?: boolean,
      recentlyAdded?: boolean
    }
  ) {
    const filter: { [key: string]: any } = {}
    
    if (options?.pinned && options?.upcoming)
      filter.$or = [
        { 'misc.pinned': true },
        { 'misc.upcoming': true }
      ]
    else if (options?.pinned)
      filter['misc.pinned'] = true
    else if (options?.upcoming)
      filter['misc.upcoming'] = true

    if (options?.recentlyAdded) { // set filters explicitly
      filter.available = true

      if (isNaN(options.limit))
        options.limit = 5
      options.skip = 0
    }
      
    const videos = await this.server.models.Videos.find(
        filter,
        undefined
      )
      .skip(options?.skip)
      .limit(options?.limit)
      .sort(
        { addedAt: -1 }
      )

    return videos
  }

  public async addVideo(data: INewVideoProps) {
    const video = new this.server.models.Videos(
      {
        ...data,
        addedAt: Date.now()
      }
    )

    await video.save()
    return video
  }

  public async updateVideo(_id: string, data: INewVideoProps) {    
    return await this.server.models.Videos.findByIdAndUpdate(
      _id,
      data,
      { new: true }
    )
  }
  
  public async replaceVideo(_id: string, data: INewVideoProps) {    
    return await this.server.models.Videos.findOneAndReplace(
      { _id },
      data,
      { new: true }
    )
  }

  public async deleteVideo(_id: string) {
    return await this.server.models.Videos.findByIdAndDelete(_id)
  }

  public async searchByTitle(title: string = '') {
    return await this.server.models.Videos.find(
      { 'meta.title': new RegExp(title, 'gi') }
    )
  }

  public hash(str: string): Promise<string> {
    return new Promise(
      (resolve) => resolve(
        createHash('sha256')
          .update(str)
          .digest('hex') ?? ''
      )
    )
  }

  public async addUser(data: IUser, returnToken?: boolean) {  
    if (
      !data.username ||
      data.username.length < 3 ||
      data.username.length > 16
    )
      throw new Error('Keep the username between 3 to 16 characters.')

    if (!data.email?.match(/.+@.+\..+/g))
      throw new Error('Invalid email provided.')

    if (
      !data.password ||
      data.password?.length < 3
    )
      throw new Error('Invalid password length.')

    data.password   = await this.hash(data.password ?? '')
    data.username_l = data.username
    data.state      = Date.now()
    data.library    = []
    data.payments   = []

    const user = new this.server.models.Users(data)
    await user.save()
    
    if (returnToken)
      return await this.createTokenFromUser(user)
    else return user
  }

  public encryptJWT(data: any, expiresIn: number): Promise<string> {
    return new Promise(
      (resolve) => {
        const iv = randomBytes(16),
          token = jsonwebtoken.sign(
              data,
              this.server.config.jwt_secret,
              { expiresIn: expiresIn * 1000 }
            ),
            cipher = createCipheriv(
              'aes-256-ctr',
              this.server.config.cypher_iv_key,
              iv
            ),
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
            this.server.config.jwt_secret
          )
        )
      }
    )
  }

  public decryptJWT<T>(token: string): Promise<T | null> {
    return new Promise(
      (resolve) => {
        try {
          jsonwebtoken.verify(token, this.server.config.jwt_secret)
        } catch { return resolve(null) }

        const data: IEncryptedToken = jsonwebtoken.decode(token),
          decipher = createDecipheriv(
            'aes-256-ctr',
            this.server.config.cypher_iv_key,
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
          jsonwebtoken.verify(jwt, this.server.config.jwt_secret)
        } catch { return resolve(null) }

        const jsonData = jsonwebtoken.decode(jwt) as T
        return resolve(jsonData)
      }
    )
  }

  public async getUserByAuth(
    data: {
      username?: string
      email?: string

      password: string
    }
  ) {
    data.password = await this.hash(data.password ?? '')
    return await this.server.models.Users.findOne(data)
  }

  public async getUserLibrary(token: string) {
    const data = await this.decryptJWT<{ _id: string }>(token),
      user = await this.server.models.Users.findOne(
        { _id: data._id }
      )

    return user?.library ?? []
  }

  public async comparePermissions(user: IUser, tier: IUserTiers) {
    return new Promise(
      (resolve) => resolve(user.tier >= tier)
    )
  }

  public async getUserByToken(token: string) {
    const data = await this.decryptJWT<{ _id: string, state: number }>(token) // use user.state to determine if token is valid or not
    
    return data ?
      await this.server.models.Users.findOne(data) :
      null
  }

  public async verifyToken(token: string) {
    return !!(
      await this.getUserByToken(token)
    )
  }

  public async createTokenFromUser(user: IUser) {
    return await this.encryptJWT(
      {
        _id: user._id,
        state: user.state
      },
      60 * 60 * 24
    )
  }

  public async paypalAccessToken() {
    const auth = Buffer.from(this.server.config.paypal.clientID + ':' + this.server.config.paypal.appSecret)
        .toString('base64'),
      url = '/v1/oauth2/token',
      res = await axios.post(
        this.server.config.paypal.base + url,
        'grant_type=client_credentials',
        {
          headers: {
            Authorization: `Basic ${auth}`
          }
        }
      )
    
    return res.data as IPaypalAccessTokenResult
  }

  public async paypalCaptureOrder(orderID: string = '') {
    const url = `/v2/checkout/orders/${orderID}/capture`,
      data = await this.paypalAccessToken(),
      res = await axios.post(
        this.server.config.paypal.base + url,
        {},
        {
          headers: { Authorization: `Bearer ${data.access_token}` }
        }
      )

    const order = this.server.orders.get(orderID),
      dateNow = Date.now()

    if (order) { // add plan to user
      const user = await this.server.models.Users.findById(order._id),
        payments = [...user.payments]

      payments.push(
        {
          id: res.data.id as string,
          name: res.data.payer.name.given_name + ' ' + res.data.payer.name.surname,
          
          email: res.data.payer.email_address,
          tier: order.tier,

          purchasedAt: dateNow
        }
      )

      this.server.orders.delete(orderID) // remove from cache
      await this.server.models.Users.findByIdAndUpdate(
        user._id,
        {
          tier: order.tier,
          tierExpir: dateNow + 30 * 24 * 60 * (60 * 1000), // 1 month

          payments,
        }
      )
    }

    return res.data
  }

  public async paypalCreateOrder(userToken: string, tier: IUserTiers) {
    const url = '/v2/checkout/orders',
      plan = this.server.config.plans.find((p) => p.tier === tier),
      user = await this.decryptJWT<{ _id: string }>(userToken)

    if (!plan) return false

    const data = await this.paypalAccessToken(),
      res = (
        await axios.post(
          this.server.config.paypal.base + url,
          {
            intent: 'CAPTURE',
            purchase_units: [
              {
                amount: {
                  currency_code: this.server.config.paypal.currencyCode,
                  value: plan.price.toString()
                }
              }
            ]
          },
          {
            headers: { Authorization: `Bearer ${data.access_token}` }
          }
        )
      ).data as IPaypalOrder
    
    // cache order
    if (res.id)
      this.server.orders.set(
        res.id,
        {
          tier,
          _id: user._id
        }
      )
  
    return res
  }
}

export default Utils