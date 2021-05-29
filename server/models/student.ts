import {Institute} from './Institute';
import {getModelForClass, prop, mongoose} from '@typegoose/typegoose';
import {Schema, Types} from 'mongoose';

export interface IStudent{

  _id: mongoose.Types.ObjectId;
  firstName: string;
  secondName: string;
  vkLink?: string;
  institute: Institute;
  fullname: string;
}

export class Student implements IStudent{
  public static getModel(){
    return getModelForClass(Student)
  }

  @prop()
  _id: mongoose.Types.ObjectId
  @prop({required: true})
  firstName: string
  @prop({required: true})
  secondName: string
  @prop()
  vkLink?: string
  @prop({required: true})
  institute: Institute
  @prop()
  fullname: string


  constructor(options: IStudent) {
    this.firstName = options.firstName;
    this.secondName = options.secondName;
    this.vkLink = options.vkLink;
    this.institute = options.institute;
    this.fullname = `${options.secondName} ${options.firstName}`;
    this._id = mongoose.Types.ObjectId(Student.generateObjectId())
  }

  private static generateObjectId(){
    let timestamp = (new Date().getTime() / 1000 | 0).toString(16);
    return timestamp + 'xxxxxxxxxxxxxxxx'.replace(/[x]/g, function() {
      return (Math.random() * 16 | 0).toString(16);
    }).toLowerCase();
  }

  public async saveStudent(){
    let model = Student.getModel();
    let response = await model.find({vkLink: this.vkLink}).exec();
    if(response.length == 1){
      let data = response[0];
      data.firstName = this.firstName;
      data.secondName = this.secondName;
      data.vkLink = this.vkLink;
    }
    await model.create({
      _id: this._id,
      firstName: this.firstName,
      institute: this.institute,
      secondName: this.secondName,
      vkLink: this.vkLink,
      fullname: this.fullname
    }).then(()=>{
      return this;
    })
  }

  //todo: setNewVkLink(), delete(), setNew
}
