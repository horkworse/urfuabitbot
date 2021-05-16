import {Mentor} from './mentor';
import {Institute} from './Institute';
import {Student} from './student';
import {getModelForClass, index, prop, Ref, ReturnModelType} from '@typegoose/typegoose';
import {Types} from 'mongoose';
import {addWarning} from '@angular-devkit/build-angular/src/utils/webpack-diagnostics';

export class Group {
  public static getModel(){
    return getModelForClass(Group)
}
  @prop({required:true})
  _id: Types.ObjectId
  @prop({required: true, default: []})
  mentors: Array<Ref<Mentor>>
  @prop({required: true, default: []})
  students: Array<Ref<Student>>
  @prop({required: true})
  institute: Institute
  @prop({required: true})
  groupIndex: string


  constructor(mentors: Array<Mentor>, institute: Institute, groupIndex: string) {
    this.mentors = mentors;
    this.institute = institute;
    this.groupIndex = groupIndex;
  }

  public static async createGroupBy(this: ReturnModelType<typeof Group>, index: string, mentors: Array<Mentor>, inst: Institute){
    let response = await this.find({inst, index}).exec();
    if(response.length != 0)
      return;
    await this.create({
      mentors: mentors,
      institute: inst,
      groupIndex: index,
      students: []
    })
  }

  public async save(){
    let model = Group.getModel();
    let response = await model.find({institute: this.institute, groupIndex: this.groupIndex}).exec();
    if(response.length != 0)
      return;
    await model.create({
      mentors: this.mentors,
      institute: this.institute,
      groupIndex: this.groupIndex,
      students: []
    })
  }

  private async resolveMentors(){
    let model = Group.getModel();
  }

  //todo: pushStudent()
}
