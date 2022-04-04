import { IDecodedJwtTokenDiscordData } from '../../Types'

class OauthBase {
  public static async GetMe(jwtToken: any): Promise<any> {}
}

export default OauthBase