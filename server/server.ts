import express from 'express';
import {MongoClient} from 'mongodb';
import cors from 'cors';
import bodyParser from 'body-parser';
import {MongoOptions} from './config/mongoOptions';
import mongoose, {Types} from 'mongoose';
import {IMentor, Mentor} from './models/mentor';
import {Group, IGroup} from './models/group';
import {IUser, User} from './models/user';
import {ensureAuthenticated, UserController} from './controllers/userController';

let app = express();
let jsonParser = express.json();
const port = 5000;
app.get('/', (req, res) => (res.send('Express run')));
app.listen(port, ()=>{
  console.log(`[SRV]: Running at http://localhost:${port}`)
})

let options : cors.CorsOptions = {
  origin: "http://localhost:4200"
}

app.use(cors(options));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}))


const client = new MongoClient(MongoOptions.URI, MongoOptions.options);

mongoose.connect(MongoOptions.URI, (err: any) =>{
  if(err)
    console.error()
  console.log("[MNG] Successfully connected to MongoDB")
});

function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}


app.post("/signup/:inviteKey", (req, res)=>{
  if(isEmpty(req.body)){
    return res.sendStatus(204)
  }
  let data:IUser = req.body;
  User.getModel().find({inviteKey: req.params.inviteKey}).exec().then(result => {
    if(!result)
      return res.status(204).send({error: "No users with this InviteKey"});
    let user = result[0];
    if(user.username)
      return res.status(204).send({error: "User already exist"})
    UserController.register(user, data.password, data.username).then((x)=>{
      if(x){
        return res.sendStatus(200);
      }
      return res.sendStatus(204);
    });
  })
})

app.post("/signin/", (req, res)=>{
  if(isEmpty(req.body))
    res.status(204).send({error: "No data"});
  let user: IUser = req.body;
  User.getModel().find({username: user.username}).exec().then(result => {
    if(result.length === 0){
      return res.status(204).send({error: 'User not exist'})
    }
    let userModel = result[0];
    if(UserController.signIn(userModel, user.password)){
      Mentor.getModel().findById(userModel.mentor).exec().then(result => {
        return res.send({
          token: userModel.generateToken(),
          fullname: result.getFullname()
        })
      })

    } else
    return res.send({error: "Not correct password"});
  })
})

app.post("/createNewUser", ensureAuthenticated ,async (req, res) => {
  if (!req.user.admin){
    res.status(400).json({error: "No admin permissions"})
  }
  if(!req.body)
    res.sendStatus(400);
  let data = req.body;
  let mentorInfo: IMentor = data[0];
  let groupInfo: IGroup = data[1]
  let mentor = new Mentor({
    firstName: mentorInfo.firstName,
    secondName: mentorInfo.secondName,
    institute: mentorInfo.institute,
    vkLink: mentorInfo.vkLink,
    group: undefined
  })
  Group.getModel().find({ groupIndex: groupInfo.groupIndex }).exec().then( async result=>{
    if(!result){
      await mentor.saveMentor();
      let group = await new Group([mentor], mentor.institute, groupInfo.groupIndex);
      await group.saveGroup();
      mentor.group = group;
      group.mentors = [mentor]
      await group.saveGroup();
      await mentor.saveMentor();
    }else{
      if (result.length != 1)
        throw new Error("Collision on group select");
      let group = result[0];
      mentor.group = group._id;
      await mentor.saveMentor()
      group.mentors.push(mentor._id);
      await group.saveGroup();
    }
    let user = new User(mentor.getHashCode().toString(), mentor);
    user.saveUser().catch(console.error);
    res.sendStatus(200);
  }).catch(console.error);
  /*
  InputJson:
    [
      {mentor:{
        "firstname": "dale",
        "secondname": "unixal",
        "vkLink": "https://vk.com/daleunixal,
        "institute": 1
         }},
         {group:{
          "groupIndex":"РИ-100023"
         }}
    ]
   */
})

app.delete("/mentor/removeFromGroup/mentor=:mentor&group=:group", ensureAuthenticated, async (req,res) => {
  let correctGroup = Group.getModel().find({groupIndex: req.params.group}).exec().then(async  result =>{
    if (!result) {
      res.status(401).send({
        error: "SomeThing went wrong"
      })
      throw new Error();
    }
    //result[0].mentors = result[0].mentors.filter(e => e !== mongoose.Types.ObjectId(req.params.mentor));
    result[0].mentors = result[0].mentors.filter(e =>
       !mongoose.Types.ObjectId(req.params.mentor).equals(<mongoose.Types.ObjectId>e)
    );
    await result[0].saveGroup();
    res.sendStatus(200);
  });
})

app.get("/validate", ensureAuthenticated, (req, res)=>{
  res.status(200).json(true)
})
