import {Institute} from './Institute';
import {getModelForClass, prop} from '@typegoose/typegoose';
import {Schema, Types} from 'mongoose';



export class Student {
  public static getModel(){
    return getModelForClass(Student)
  }
  @prop({required: true})
  _id?: Types.ObjectId
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


  constructor(firstName: string, secondName: string, institute: Institute, vkLink?: string) {
    this.firstName = firstName;
    this.secondName = secondName;
    this.vkLink = vkLink;
    this.institute = institute;
    this.fullname = `${secondName} ${firstName}`;
  }

  public async save(){
    let model = Student.getModel();
    await model.create({
      firstName: this.firstName,
      institute: this.institute,
      secondName: this.secondName,
      vkLink: this.vkLink,
      fullname: this.fullname
    })
  }

  //todo: setNewVkLink(), delete(), setNew
}
