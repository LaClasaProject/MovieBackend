import HttpServer from './base/HttpServer'
import { IUser } from './types/Database'

import { IEncryptedToken, INewVideoProps } from './types/Http'
import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'crypto'

import jsonwebtoken from 'jsonwebtoken'

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

  public async getContent() {
    const otherVideos = await this.getVideos(
      {
        pinned: true,
        upcoming: true,
        skip: 0,
        limit: 20
      }
    ),
      mainVideos = await this.getVideos()

    return {
      otherVideos,
      mainVideos
    }
  }

  public async searchByTitle(title: string = '') {
    return await this.server.models.Videos.find(
      {
        'meta.title': new RegExp(title, 'gi')
      }
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
    if (!Array.isArray(data.library) || data.library.length >= 1)
      data.library = []
  
    if (data.email.length < 5 || data.password.length < 3)
      throw new Error('Invalid email or password length.')

    data.email = data.email?.toLowerCase()
    data.password = await this.hash(data.password ?? '')

    const user = new this.server.models.Users(data)
    await user.save()
    
    if (returnToken)
      return this.encryptJWT(
        { _id: user.id },
        60 * 60 * 24
      )
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

  public async getUserByAuth(email: string, password: string) {
    email = email?.toLowerCase()

    return await this.server.models.Users.findOne(
      {
        email,
        password: await this.hash(password ?? '')
      }
    )
  }

  public async getUserLibrary(token: string) {
    const data = await this.decryptJWT<{ _id: string }>(token),
      user = await this.server.models.Users.findOne(
        { _id: data._id }
      )

    return user?.library ?? []
  }
}

export default Utils