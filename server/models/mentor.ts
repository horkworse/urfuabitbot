import {Institute} from './Institute';
import {Group} from './group';

export class Mentor{
  admin: boolean
  username?: string
  password?: string
  group: Group
  vkLink: string
  institute: Institute
  inviteKey: string
  firstName: string
  secondName: string
}
