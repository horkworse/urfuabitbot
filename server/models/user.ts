import {getModelForClass, prop} from '@typegoose/typegoose';
import {Mentor} from './mentor';
import jwt from "jsonwebtoken";
import * as options from '../config/encryptionOptions.json';
import moment from "moment";

export class User {
  public static getModel(){
    return getModelForClass(User);
  }

  @prop()
  admin: boolean;
  @prop({required: true})
  inviteKey: string;
  @prop()
  password: string;
  @prop()
  username: string;
  @prop({ref: Mentor})
  mentor: Mentor;


  constructor(inviteKey: string, mentor: Mentor, admin: boolean = false) {
    this.admin = admin;
    this.inviteKey = inviteKey;
    this.mentor = mentor;
  }

  public async saveUser(){
    let model = User.getModel();
    let response = await model.find({inviteKey: this.inviteKey}).exec();
    if(response.length == 1){
      let data = response[0];
      data.inviteKey = this.inviteKey;
      data.admin = this.admin;
      data.password = this.password;
      data.username = this.username;
      data.mentor = this.mentor;
      await data.save();
      return
    }
    await model.create({
      inviteKey: this.inviteKey,
      admin: this.admin,
      password: this.password,
      username: this.username,
      mentor: this.mentor
    })
  }

  public generateToken(){
    return jwt.sign({
      "sub":{
        "admin": this.admin,
        "mentor": this.mentor._id.toHexString()
      },
      "expire": moment().add(45, 's')
    }, options.secret);
  }
}

export interface IUser {
  username: string,
  password: string
}
