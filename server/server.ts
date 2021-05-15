import express from 'express';
import {MongoClient} from 'mongodb';
import cors from 'cors';
import bodyParser from 'body-parser';
import {MongoOptions} from './config/mongoOptions';
import mongoose from 'mongoose';
import {Mentor} from './models/mentor';
import {Institute} from './models/Institute';

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

let fistMaster : Mentor = new Mentor({
  firstName: 'Dale',
  group: undefined,
  institute: Institute.rtf,
  inviteKey: '123dasd3424kfl',
  secondName: 'Ponuhal',
  vkLink: '',
  admin: true,
  password: "13131313",
  username: "unixalunixal"
});

let model = Mentor.model;
console.log(model)
let myBeBack = model.getMentorByUsername("unixalunixal").then(mnt => {
  console.log(mnt);
}).catch(re => console.log(re));


