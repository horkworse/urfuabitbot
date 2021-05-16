import {Institute} from './Institute';
import {Group} from './group';
import {getModelForClass, modelOptions, prop, Ref, ReturnModelType} from '@typegoose/typegoose';
import {Types} from 'mongoose';

export interface IMentor{
  admin: boolean
  username?: string
  password?: string
  group: Ref<Group>
  vkLink: string
  institute: Institute
  inviteKey: string
  firstName: string
  secondName: string
}


@modelOptions({schemaOptions: {collection: 'mentors'}})
export class Mentor implements IMentor{
  public static getModel(){
   return getModelForClass(Mentor);
  }

  @prop({required:true})
  _id: Types.ObjectId
  @prop()
  admin: boolean;
  @prop({required: true})
  firstName: string;
  @prop({ref: ()=>Group})
  group: Ref<Group>;
  @prop({required: true})
  institute: Institute;
  @prop({required: true})
  inviteKey: string;
  @prop()
  password: string;
  @prop({required: true})
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
  }

  public async Save(){
    await Mentor.getModel().create({
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

  public saySmth(){
    console.log(this.username)
  }

  //todo: CreateNewMentor()
}
