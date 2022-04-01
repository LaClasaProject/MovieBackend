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

export {
  PartialUserKeys,
  IPartialUser
}