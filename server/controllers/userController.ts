import {User} from '../models/user';
import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as options from '../config/encryptionOptions.json'
import moment from 'moment';
import {mongoose} from '@typegoose/typegoose';
import {Mentor} from '../models/mentor';

export class UserController {
  public static async register(user: User, password: string, username: string ){
    return await User.getModel().find({username: username}).exec().then(async result => {
      if(result.length !== 0){
        return false;
      }
      user.username = username;
      user.password = bcrypt.hashSync(password, 10);
      await user.saveUser();
      return true;
    })
  }


  public static signIn(user: User, password: string){
    if(!bcrypt.compareSync(password, user.password)){
      return false;
    }
    return true;
  }

  public static
}

export function isValid(req){
  if (!req.headers.authorization){
    return false
  }
  let token = req.headers.authorization.split(' ')[1];

  let payload = null;
  try {
    payload = jwt.verify(token, options.secret);
  }
  catch (err) {
    return false
  }

  if(moment(payload.expire).unix() <= moment().unix()){
    console.log(payload.expire - moment().unix())
    return false
  }

  return true
}

export function ensureAuthenticated(req,res,next){
  if (!req.headers.authorization){
    return res.status(401).send({error: "TokenMissing"})
  }
  let token = req.headers.authorization.split(' ')[1];

  let payload = null;
  try {
    payload = jwt.verify(token, options.secret);
  }
  catch (err) {
    return res.status(401).send({error: "TokenInvalid"})
  }

  if(moment(payload.expire).unix() <= moment().unix()){
    console.log(payload.expire - moment().unix())
    return res.status(401).send({error: "TokenExpired"})
  }

  Mentor.getModel().findById(mongoose.Types.ObjectId(payload.sub.mentor)).exec().then(result => {
    if(!result){
      return res.status(401).send({
        error: "UserNotFound"
      });
    }
    req.user = payload.sub;
    next();
  })
}
