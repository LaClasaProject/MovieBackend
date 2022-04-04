import { IDecodedJwtTokenDiscordData } from '../../Types'

class OauthBase {
  public static async GetMe(jwtToken: IDecodedJwtTokenDiscordData): Promise<any> {}
}

export default OauthBase