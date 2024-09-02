require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();

mongoose.connect(process.env.MONGO_URI);

const cors = require("cors");
const bodyParser = require('body-parser');
const corsOptions = { origin: "http://localhost:3000" }
app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


const userSchema = new mongoose.Schema({
  name: String,
  role: String,
  email: String,
  createdAt: Date,
  updatedAt: Date,
  isAdmin: {
    type: Boolean,
    default: false
  },
  isActive: Boolean,
  teams: [{
    name: String,
    id: String
  }]
});

const teamSchema = new mongoose.Schema({
  name: String,
  manager: {
    name: String,
    id: String
  },
  members: [{
    name: String,
    id: String
  }],
  tasks: [{
    title: String,
    assignedTo: [{
      name: String,
      id: String
    }],
    id: String
  }],
  createdOn: Date,
  messages: [{
    author: {
      name: String,
      id: String
    },
    message: String,
    createdOn: Date
  }],
  trash: [Map]
});

const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  subTasks: [{
    description: String,
    completed: {
      type: Boolean,
      default: false
    }
  }],
  createdOn: Date,
  deadline: Date,
  priority: String,
  status: String,
  assignedTo: [{
    name: String,
    id: String
  }],
  comments: [{
    author: {
      name: String,
      id: String
    },
    message: String,
    createdOn: Date
  }],
  updates: [{
    author: {
      name: String,
      id: String,
    },
    message: String,
    updatedOn: Date
  }]
});

let User = mongoose.model('user', userSchema);
let Team = mongoose.model('team', teamSchema);
let Task = mongoose.model('task', taskSchema);

app.get("/test", (req, res) => {
  res.send({message: "returned data from get request"})
})

app.post("/login", (req, res) => {
  const body = req.body;
  User.where({
    password: body.password,
    email: body.email
  }).findOne()
    .then(user => {
      user ? 
      res.send(user) :
      res.send({ error: "email and password do not match"})
    })
    .catch(err => console.log(err))
});

app.post("/createtask", (req, res) => {
  const body = req.body;
  console.log(body);
  res.send(body);
  //TODO: add data into database
  //TODO: add data to team
});

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});