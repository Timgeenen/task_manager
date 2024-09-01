require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();

mongoose.connect(process.env.MONGO_URI);

const cors = require("cors");
const corsOptions = { origin: "http://localhost:3000" }
app.use(cors(corsOptions));



const userSchema = new mongoose.Schema({
  name: String,
  role: String,
  emal: String,
  createdOn: Date,
  lastUpdated: Date,
  isAdmin: Boolean,
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

app.get("/api:index", async (req, res) => {

});

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});