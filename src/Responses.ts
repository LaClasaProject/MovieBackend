// extension from types
// this would contain templates for possible responses

const PartialUserKeys = [
  'UserId',
  'Role',
  'Username',
  'Gems',
  'Discord',
  'Xp',
  'Level',
  'LastLogin'
]

interface IPartialUser {
  UserId: number
  Role: number
  Username: string
  Gems: number
  Discord: string
  Xp: number
  Level: number
  LastLogin: number
}

const UserKeys = [
  ...PartialUserKeys,
  'Password'
]

interface IUser extends IPartialUser {
  Password?: Buffer
}

const WebAccountKeys = [
  'AccountId',
  'DiscordId',
  'GoogleID',
  'GithubId',
  'Accounts',
  'Username'
]

interface IWebAccount {
  AccountId: string
  DiscordId: string
  GoogleId: string
  GithubId: string
  Accounts: Buffer
  Username: string
}

export {
  PartialUserKeys,
  IPartialUser,

  WebAccountKeys,
  IWebAccount,
  
  UserKeys,
  IUser
}