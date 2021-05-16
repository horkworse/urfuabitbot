import {User} from '../models/user';
import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as options from '../config/encryptionOptions.json'
import moment from 'moment';

export class UserController {
  public static async register(user: User, password: string, username: string ){
    user.username = username;
    user.password = bcrypt.hashSync(password, 10);
    await user.saveUser();
    return true;
  }


  public static signIn(user: User, password: string){
    if(!bcrypt.compareSync(password, user.password)){
      return false;
    }
    return true;
  }

  public static ensureAuthenticated(req,res,next){
    if (!req.headers.authorization){
      return res.status(401).send({error: "TokenMissing"})
    }
    let token = req.headers.authorization.split(' ')[1];

    let payload = null;
    try {
      payload = jwt.decode(options.secret)
    }
    catch (err) {
      return res.status(401).send({error: "TokenInvalid"})
    }

    if(payload.exp <= moment().unix()){
      return res.status(401).send({error: "TokenExpired"})
    }

    User.getModel().findById(payload.id).exec().then(result => {
      if(!result){
        return res.status(401).send({
          error: "UserNotFound"
        });
      }
      req.user = payload.sub;
      next();
    })
  }
}

