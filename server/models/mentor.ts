import {Institute} from './Institute';
import {Group} from './group';
import {Types} from 'mongoose';
import {getModelForClass, modelOptions, prop, Ref, ReturnModelType} from '@typegoose/typegoose';
import hash from 'hash-it';
import mongoose from 'mongoose';


export interface IMentor{
  group: Group | Ref<Group>
  vkLink: string
  institute: Institute
  firstName: string
  secondName: string
}


@modelOptions({schemaOptions: {collection: 'mentors'}})
export class Mentor implements IMentor{
  public static getModel(){
   return getModelForClass(Mentor);
  }

  @prop()
  _id: mongoose.Types.ObjectId
  @prop({required: true})
  firstName: string;
  @prop({ref: ()=>Group})
  group: Ref<Group>;
  @prop({required: true})
  institute: Institute;
  @prop({required: true})
  secondName: string;
  @prop()
  vkLink: string;

  constructor(options: IMentor) {
    this.vkLink = options.vkLink;
    this.secondName = options.secondName;
    this.firstName = options.firstName;
    this.group = options.group;
    this.institute = options.institute;
    this._id = mongoose.Types.ObjectId(Mentor.generateObjectId())
  }

  private static generateObjectId(){
    let timestamp = (new Date().getTime() / 1000 | 0).toString(16);
    return timestamp + 'xxxxxxxxxxxxxxxx'.replace(/[x]/g, function() {
      return (Math.random() * 16 | 0).toString(16);
    }).toLowerCase();
  }


  public static async getMentorByGroup(this: ReturnModelType<typeof Mentor>,groupIndex: string){
    Group.getGroupByIndex(groupIndex).then(response => {
      return response[0].mentors;
    }).catch(console.error);
  }

  public saySmth(){
    console.log(this.firstName)
  }

  public getFullname(): string{
    return this.secondName + this.firstName;
  }

  public async saveMentor(){
    let model = Mentor.getModel();
    let response = await model.find({vkLink: this.vkLink}).exec();
    if(response.length == 1){
      let data = response[0];
      data.group = this.group;
      data.vkLink = this.vkLink;
      data.institute = this.institute;
      data.firstName = this.firstName;
      data.secondName = this.secondName;
      return await data.save().then(x => {
        return data;
      });
    }
     let q = await model.create({
       _id: this._id,
      group: this.group,
      vkLink: this.vkLink,
      institute: this.institute,
      firstName: this.firstName,
      secondName: this.secondName
    }).then((mentor) => {
      return this;
     })
  }

  public getHashCode(){
    return hash(this);
  }

  //todo: CreateNewMentor()
}
