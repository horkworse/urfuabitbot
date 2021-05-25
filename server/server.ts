import express from 'express';
import {MongoClient} from 'mongodb';
import cors from 'cors';
import bodyParser from 'body-parser';
import {MongoOptions} from './config/mongoOptions';
import mongoose from 'mongoose';
import {IMentor, Mentor} from './models/mentor';
import {Institute} from './models/Institute';
import {Group, IGroup} from './models/group';
import {User} from './models/user';
import {addWarning} from '@angular-devkit/build-angular/src/utils/webpack-diagnostics';
import {IStudent, Student} from './models/student'

let app = express();
let jsonParser = express.json();
const port = 5000;
app.get('/', (req, res) => (res.send('Express run')));
app.listen(port, ()=>{
  console.log(`[SRV]: Running at http://localhost:${port}`)
})

let options : cors.CorsOptions = {
  origin: "http://localhost:4000"
}

//app.use(cors(options));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}))


const client = new MongoClient(MongoOptions.URI, MongoOptions.options);

mongoose.connect(MongoOptions.URI, (err: any) =>{
  if(err)
    console.error()
  console.log("[MNG] Successfully connected to MongoDB")
});


// let signupNewMentor  = async () => {
//   let mentor = new Mentor({
//     firstName: 'Andrey', group: undefined, institute: 1, secondName: 'Govno', vkLink: '123ld0933'
//   });
//   await mentor.saveMentor();
//   let group = await new Group([mentor], 1, "РИФО-001");
//   await group.saveGroup();
//   mentor.group = group;
//   group.mentors = [mentor]
//   await group.saveGroup();
//   await mentor.saveMentor();
//   let user = new User(mentor.getHashCode().toString(), mentor);
//   user.saveUser().catch(console.error);
// }
//
// signupNewMentor();
app.get("/mentor/getGroupByMentor/mentor=:mentor", async(req, res) =>{
  Mentor.getModel().find({ _id: mongoose.Types.ObjectId(req.params.mentor)}).exec().then( async result=>{
    if(!result)
      throw new Error();
    res.send((<mongoose.Types.ObjectId>result[0].group).toHexString());
  }).catch(console.error)
});

app.post("/student/addStudentToGroup/group=:group", async(req, res) =>{
  Group.getModel().find({_id: mongoose.Types.ObjectId(req.params.group)}).exec().then(async resultGroup =>{
    if(!resultGroup)
      throw new Error();
  let studentData:IStudent = JSON.parse(req.body)
  Student.getModel().find({vkLink: studentData.vkLink}).exec().then(async resultStudent =>{
    if(!resultStudent)
      throw new Error();
    resultGroup[0].students.push(resultStudent[0]._id)
    await resultGroup[0].saveGroup;
    await resultStudent[0].saveStudent;
    }).catch(console.error);
  }).catch(console.error);
});
 

app.post("/createNewUser", jsonParser,async (req, res) => {
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

