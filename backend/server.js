import express from 'express';
import cors from 'cors';
import * as fs from 'fs';
import { UserSchema as User } from './models/user.schema.js';
import mongoose from 'mongoose';

const usersJson = fs.readFileSync('data/users.json', 'utf8');
let users = JSON.parse(usersJson);

const toDosJson = fs.readFileSync('data/todos.json', 'utf8');
let toDos = JSON.parse(toDosJson);

const app = express();

app.use(cors());
app.use(express.json());

// connecting to mongoDB
const MongoUrl = 'mongodb+srv://omarfarids:Om0123Ar@cluster0.ncvmfrb.mongodb.net/notes?retryWrites=true&w=majority'



mongoose.connect(MongoUrl,{
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then((res) => {
    console.log(
      'Connected to DB'
      );
    })
    .catch((err) => {
      console.log(err);
    });


// basic auth middleware
export const auth = async (req, res, next) => {
    const { authorization } = req.headers;
    // if there is no authorization header, return 401
    if (!authorization) {
        res.status(401).send({
            message: 'Unauthorized'
        });
        return;
    }
    const [username, password] = Buffer.from(authorization.split(' ')[1], 'base64').toString().split(':');


    const userData = await User.findOne({ username: username }).select("-_id -__v");
    // check if user account exists
    if (!userData) {
        res.status(401).send({
            message: 'Account not found'
        });
        return { STATUS: "FAILURE", MESSAGE: "Account not found" };
    }

    if (userData.password !== password) {
        res.status(401).send({
            message: 'Invalid username or password'
        });
        return;
    }

    res.locals.user = userData;
    next();
}


// for Signup
app.post('/signup', async (req, res) => {
    const user = await new User(req.body)
    if(!user){
        res.send('Failed to signup')
    }

    user.save()
    res.status(200).send({
        message: 'Signup Successfully.',
        body:user
    });
})


// login 
app.post('/login', auth ,(req, res) => {
    const user = res.locals.user

    if(user){
        res.status(200).send({
          message: 'Login Successfully.',
          body:true
        });
    }
})



app.listen(4000, () => {
    console.log('Server listening on port http://localhost:4000');
});