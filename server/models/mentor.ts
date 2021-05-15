import {Institute} from './Institute';
import {Group} from './group';
import {getModelForClass, modelOptions, prop, ReturnModelType} from '@typegoose/typegoose';

export interface IMentor{
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


@modelOptions({schemaOptions: {collection: 'mentors'}})
export class Mentor implements IMentor{
  public static model = getModelForClass(Mentor);

  @prop()
  admin: boolean;
  @prop()
  firstName: string;
  @prop()
  group: Group;
  @prop()
  institute: Institute;
  @prop()
  inviteKey: string;
  @prop()
  password: string;
  @prop()
  secondName: string;
  @prop()
  username: string;
  @prop()
  vkLink: string;

  constructor(options: IMentor) {
    this.username = options.username;
    this.password = options.password;
    this.vkLink = options.vkLink;
    this.secondName = options.secondName;
    this.admin = options.admin
    this.firstName = options.firstName;
    this.group = options.group;
    this.inviteKey = options.inviteKey;
    this.institute = options.institute;
    Mentor.model = getModelForClass(Mentor);
  }

  public async Save(){
    await Mentor.model.create({
      username: this.username,
      password: this.password,
      vkLink: this.vkLink,
      secondName: this.secondName,
      admin: this.admin,
      firstName: this.firstName,
      group: this.group,
      inviteKey: this.inviteKey,
      institute: this.institute
    })
  }

  public static async getMentorByUsername(this: ReturnModelType<typeof Mentor>,username: string){
    return this.find({username}).exec();
  }
}
