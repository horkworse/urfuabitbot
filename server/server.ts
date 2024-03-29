import express from 'express';
import {MongoClient} from 'mongodb';
import cors from 'cors';
import bodyParser from 'body-parser';
import {MongoOptions} from './config/mongoOptions';
import mongoose, {Types} from 'mongoose';
import {IMentor, Mentor} from './models/mentor';
import {Group, IGroup} from './models/group';
import {IUser, User} from './models/user';
import {ensureAuthenticated, isValid, UserController} from './controllers/userController';
import {IStudent, Student} from './models/student';

let app = express();
let jsonParser = express.json();
const port = 5000;
app.get('/', (req, res) => (res.send('Express run')));
app.listen(port, () => {
  console.log(`[SRV]: Running at http://localhost:${port}`);
});

let options: cors.CorsOptions = {
  origin: 'http://localhost:4200'
};

app.use(cors(options));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


const client = new MongoClient(MongoOptions.URI, MongoOptions.options);

mongoose.connect(MongoOptions.URI, (err: any) => {
  if (err) {
    console.error();
  }
  console.log('[MNG] Successfully connected to MongoDB');
});

function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}


app.post('/signup/:inviteKey', (req, res) => {
  if (isEmpty(req.body)) {
    return res.sendStatus(204);
  }
  let data: IUser = req.body;
  User.getModel().find({inviteKey: req.params.inviteKey}).exec().then(result => {
    if (!result) {
      return res.status(204).send({error: 'No users with this InviteKey'});
    }
    let user = result[0];
    if (user.username) {
      return res.status(204).send({error: 'User already exist'});
    }
    UserController.register(user, data.password, data.username).then((x) => {
      if (x) {
        return res.status(200).json({text: 'Internal ERR'});
      }
      return res.status(204).json({text: 'Internal ERR'});
    });
  });
}); //Works

app.post('/signin/', (req, res) => {
  if (isEmpty(req.body)) {
    res.status(204).send({error: 'No data'});
  }
  let user: IUser = req.body;
  User.getModel().find({username: user.username}).exec().then(result => {
    if (result.length === 0) {
      return res.status(204).send({error: 'User not exist'});
    }
    let userModel = result[0];
    if (UserController.signIn(userModel, user.password)) {
      Mentor.getModel().findById(userModel.mentor).exec().then(result => {
        return res.send({
          token: userModel.generateToken(),
          fullname: result.getFullname()
        });
      });

    } else {
      return res.send({error: 'Not correct password'});
    }
  });
}); //Works

app.post('/createNewUser', ensureAuthenticated, async (req, res) => {
  if (!req.user.admin) {
    res.status(400).json({error: 'No admin permissions'});
  }
  if (!req.body) {
    res.sendStatus(400);
  }
  let data = req.body;
  let mentorInfo: IMentor = data[0];
  let groupInfo: IGroup = data[1];
  let mentor = new Mentor({
    firstName: mentorInfo.firstName,
    secondName: mentorInfo.secondName,
    institute: mentorInfo.institute,
    vkLink: mentorInfo.vkLink,
    group: undefined
  });
  Group.getModel().find({groupIndex: groupInfo.groupIndex}).exec().then(async result => {
    if (result.length === 0) {
      await mentor.saveMentor();
      let group = await new Group([mentor], mentor.institute, groupInfo.groupIndex);
      await group.saveGroup();
      mentor.group = group;
      group.mentors = [mentor];
      await group.saveGroup();
      await mentor.saveMentor();
    } else {
      if (result.length !== 1) {
        throw new Error('Collision on group select');
      }
      let group = result[0];
      mentor.group = group._id;
      await mentor.saveMentor();
      group.mentors.push(mentor._id);
      await group.saveGroup();
    }
    let user = new User(mentor.getHashCode().toString(), mentor);
    user.saveUser().catch(console.error);
    res.status(200).send(user.inviteKey);
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
}); //Works

app.get('/validate', (req, res) => {
  res.status(200).json(isValid(req));
}); //Works

app.get('/adminVerify', ensureAuthenticated, (req, res) => {
  res.send(req.user.admin);
}); //Works

app.delete('/mentor/removeFromGroup/mentor=:mentor&group=:group', ensureAuthenticated, async (req, res) => {
  Group.getModel().find({groupIndex: req.params.group}).exec().then(async result => {
    if (result.length !== 0) {
      res.status(401).send({
        error: 'SomeThing went wrong'
      });
      throw new Error();
    }
    result[0].mentors = result[0].mentors.filter(e =>
      !mongoose.Types.ObjectId(req.params.mentor).equals(<mongoose.Types.ObjectId> e)
    );
    await result[0].saveGroup();
    res.sendStatus(200);
  });
  Mentor.getModel().find({_id: req.params.mentor}).exec().then(async result => {
    if (result.length !== 0) {
      res.status(401).send({
        error: 'SomeThing went wrong'
      });
      throw new Error();
    }
    result[0].group = null;
    await result[0].saveMentor();
    res.sendStatus(200);
  });
}); //AWAITING

app.post('/mentor/addToGroup/mentor=:mentor&group=:group', ensureAuthenticated, async (req, res) => {
  Group.getModel().find({_id: mongoose.Types.ObjectId(req.params.group)}).exec().then(async resultGroup => {
    if (resultGroup.length !== 0) {
      res.status(401).send({
        error: 'SomeThing went wrong'
      });
      throw new Error();
    }
    Mentor.getModel().find({_id: req.params.mentor}).exec().then(async resultMentor => {
      if (resultMentor.length !== 0) {
        res.status(401).send({
          error: 'SomeThing went wrong'
        });
        throw new Error();
      }
      resultGroup[0].mentors.push(resultMentor[0]._id);
      resultMentor[0].group = resultGroup[0]._id;
      await resultGroup[0].saveGroup();
      await resultMentor[0].saveMentor();
    });
  });
}); //Works

app.get('/mentor/getGroupByMentor/mentor=:mentor', ensureAuthenticated, async (req, res) => {
  Mentor.getModel().find({_id: mongoose.Types.ObjectId(req.params.mentor)}).exec().then(async result => {
    if (!result) {
      throw new Error();
    }
    res.send((<mongoose.Types.ObjectId> result[0].group).toHexString());
  }).catch(console.error);
});

app.post('/student/addStudentToGroup', ensureAuthenticated, async (req, res) => {
  console.log(`[DB] Executed AddStudent() - data: ${req.body}`)
  Group.getModel().find({mentors: mongoose.Types.ObjectId(req.user.mentor)}).exec().then(async resultGroup => {
    if (resultGroup.length === 0) {
      throw new Error("AddStudent() Error: No group");
    }
    let studentData: IStudent = req.body;
    Student.getModel().find({vkLink: studentData.vkLink}).exec().then(async resultStudent => {
      console.log(resultStudent);
      if (resultStudent.length !== 0) {
        res.sendStatus(400).send({
          error: 'AddStudent() Error: Student already exist!'
        });
        throw new Error(`AddStudent() Error: Student already exist! data:  ${resultStudent}`);
      }
      let vkLinkDesc = studentData.vkLink.split('/');
      let newStudent = new Student({
        firstName: studentData.firstName,
        secondName: studentData.secondName,
        institute: resultGroup[0].institute,
        vkLink: vkLinkDesc[vkLinkDesc.length - 1]
      });
      await newStudent.saveStudent();
      resultGroup[0].students.push(newStudent._id);
      await resultGroup[0].saveGroup();
      res.status(200).send({data:"help"})
    }).catch(console.error);
  }).catch(console.error);
}); //Works

app.get('/student/getAll/lastIndex=:lastIndex&count=:count', ensureAuthenticated, (req, res) => {
  let q = parseInt(req.params.lastIndex);
  let p = parseInt(req.params.count);
  Student.getModel().find({}, {response: {$slice: [q, p + q]}}).exec().then(result => {
    if (result.length !== 0) {
      res.json(result);
    }

  });
}); //DEPRECATED

app.get('/student/getAll/', ensureAuthenticated, (req, res) => {

  Student.getModel().find({}).exec().then(result => {
    if (result.length !== 0) {
      res.json(result);
    }
  });
}); //Works

app.get('/student/getByGroup', ensureAuthenticated, (req, res) => {
  Group.getModel().find({mentors: mongoose.Types.ObjectId(req.user.mentor)}).exec().then(async resultGroup => {
    if (resultGroup.length === 0) {
      throw new Error("getByGroup() Error: No group");
    }
    Student.getModel().find({_id: {$in: resultGroup[0].students}}).exec().then(groupStudents => {
      res.json(groupStudents)
    })
  })

}) //Works

app.delete('/student/removeFromGroup/student=:student&group=:group', ensureAuthenticated, async (req, res) => {
  Group.getModel().find({groupIndex: req.params.group}).exec().then(async result => {
    if (result.length !== 0) {
      res.status(401).send({
        error: 'SomeThing went wrong'
      });
      throw new Error();
    }
    result[0].students = result[0].students.filter(e =>
      !mongoose.Types.ObjectId(req.params.students).equals(<mongoose.Types.ObjectId> e)
    );
    await result[0].saveGroup();
    res.sendStatus(200);
  });
}); //AWAITING

app.get('/bot/getMentors/group=:group', async (req, res) => {
  Group.getModel().find({groupIndex: req.params.group}).exec().then(async groupResult => {
    if (groupResult.length !== 1) {
      res.status(401).send({
        error: `Group not found ${req.params.group}`
      });
      throw new Error();
    }
    let groupMentors = '';
    Mentor.getModel().find({_id: {$in: groupResult[0].mentors}}).exec().then(async result => {
      if (result.length === 0) {
        res.status(401).send({
          error: groupResult
        });
        throw new Error();
      }
      for (let mnt of result) {
        groupMentors += '@' + mnt.vkLink + '(' + mnt.firstName + ' ' + mnt.secondName + ")  \n";
      }
      res.send({
        text: groupMentors.trimEnd()
      })
    })
  })
}) //AWAITING
