import {Mentor} from './mentor';
import {Institute} from './Institute';
import {Student} from './student';
import {DocumentType, getModelForClass, mongoose, prop, Ref, ReturnModelType} from '@typegoose/typegoose';


export class Group {
  public static getModel(){
    return getModelForClass(Group)
}
  @prop()
  _id: mongoose.Types.ObjectId
  @prop({ default: []})
  mentors: Array<Mentor>
  @prop({default: []})
  students: Array<Student>
  @prop({required: true})
  institute: Institute
  @prop({required: true})
  groupIndex: string


  constructor(mentors: Array<Mentor | DocumentType<Mentor>>, institute: Institute, groupIndex: string) {
    this.mentors = mentors;
    this.institute = institute;
    this.groupIndex = groupIndex;
    this._id = mongoose.Types.ObjectId(Group.generateObjectId());
  }

  private static generateObjectId(){
    let timestamp = (new Date().getTime() / 1000 | 0).toString(16);
    return timestamp + 'xxxxxxxxxxxxxxxx'.replace(/[x]/g, function() {
      return (Math.random() * 16 | 0).toString(16);
    }).toLowerCase();
  }

  public static async createGroupBy(index: string, inst: Institute){
    let model = this.getModel();
    let response = await model.find({inst, index}).exec();
    if(response.length != 0)
      return;
    await model.create({
      mentors: undefined,
      institute: inst,
      groupIndex: index,
      students: []
    })
  }

  public async saveGroup(){
    let model = Group.getModel();
    let response = await model.find({institute: this.institute, groupIndex: this.groupIndex}).exec();
    if(response.length == 1){
      let data = response[0];
      data.mentors = this.mentors;
      data.institute = this.institute;
      data.groupIndex = this.groupIndex;
      data.students = this.students;
      return await data.save().then(x => {
        return data;
      });
    }
    await model.create({
      _id: this._id,
      mentors: this.mentors,
      institute: this.institute,
      groupIndex: this.groupIndex,
      students: []
    }).then(x => {
      return x;
    });
  }


  public static async getGroupByIndex(index: string){
    return this.getModel().find({groupIndex: index}).exec();
  }

  //todo: pushStudent()
}
