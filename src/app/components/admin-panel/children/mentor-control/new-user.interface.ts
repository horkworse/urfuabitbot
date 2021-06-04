import {Institute} from '../../../../../../server/models/Institute';

export interface IGroupIndex{
  groupIndex: string
}

export interface INewMentor{
  firstName: string,
  secondName: string,
  vkLink: string,
  institute: Institute
}
