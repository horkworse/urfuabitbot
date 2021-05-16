import express from 'express';
import {MongoClient} from 'mongodb';
import cors from 'cors';
import bodyParser from 'body-parser';
import {MongoOptions} from './config/mongoOptions';
import mongoose from 'mongoose';
import {Mentor} from './models/mentor';
import {Institute} from './models/Institute';
import {Group} from './models/group';
import {User} from './models/user';

let app = express();
const port = 5000;
app.get('/', (req, res) => (res.send('Express run')));
app.listen(port, ()=>{
  console.log(`[SRV]: Running at http://localhost:${port}`)
})

let options : cors.CorsOptions = {
  origin: "http://localhost:4000"
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


let signupNewMentor  = async () => {
  let mentor = new Mentor({
    firstName: 'Andrey', group: undefined, institute: 1, secondName: 'Govno', vkLink: '123ld0933'
  });
  await mentor.saveMentor();
  let group = await new Group([mentor], 1, "РИФО-001").saveGroup();
  mentor.group = group;
  await mentor.saveMentor();
  let user = new User(mentor.getHashCode().toString(), mentor);
  user.saveUser().catch(console.error);
}



signupNewMentor();
