require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();

mongoose.connect(process.env.MONGO_URI);

const cors = require("cors");
const bodyParser = require("body-parser");
const func = require("./functions");
const corsOptions = { origin: "http://localhost:3000" };
app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const userSchema = new mongoose.Schema({
  name: String,
  role: String,
  email: String,
  password: String,
  createdAt: Date,
  updatedAt: Date,
  isAdmin: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  teams: [
    {
      name: String,
      id: String,
      members: [
        {
          name: String,
          id: String,
        },
      ],
    },
  ],
  connections: [
    {
      name: String,
      role: String,
      email: String,
      id: String,
      _id: false,
    },
  ],
  notifications: [
    {
      title: String,
      author: {
        name: String,
        id: String,
      },
      message: String,
    },
  ],
});

const teamSchema = new mongoose.Schema({
  name: String,
  manager: {
    name: String,
    role: String,
    email: String,
    id: String,
    _id: false,
  },
  members: [
    {
      name: String,
      role: String,
      email: String,
      id: String,
      _id: false,
    },
  ],
  tasks: [
    {
      title: String,
      priority: String,
      status: String,
      id: String,
    },
  ],
  createdOn: Date,
  messages: [
    {
      author: {
        name: String,
        id: String,
      },
      message: String,
      createdOn: Date,
    },
  ],
  trash: [Map],
});

const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  subTasks: [
    {
      description: String,
      completed: {
        type: Boolean,
        default: false,
        _id: false
      },
    },
  ],
  createdAt: Date,
  deadline: Date,
  priority: String,
  status: String,
  assignedTo: [{
    name: String,
    id: String,
  }],
  assignedTeam: {
    name: String,
    id: String,
  },
  comments: [
    {
      author: {
        name: String,
        id: String,
        _id: false
      },
      message: String,
      createdAt: Date,
    },
  ],
  updates: [
    {
      author: {
        name: String,
        id: String,
        _id: false
      },
      message: String,
      updatedAt: Date,
    },
  ],
});

let User = mongoose.model("user", userSchema);
let Team = mongoose.model("team", teamSchema);
let Task = mongoose.model("task", taskSchema);

app.get("/connections", (req, res) => {
  User.find(
    {},
    {
      name: 1,
      role: 1,
      email: 1,
      isActive: 1,
      updatedAt: 1,
    }
  )
    .then((data) => res.send(data))
    .catch((err) => res.send(err));
});

app.get("/user:id", (req, res) => {
  User.findById(req.params.id)
    .then(user => res.send(user))
    .catch(err => res.send(err))
})

app.put("/add-connection", async (req, res) => {
  const { user, id } = req.body;

  const activeUser = await User.findById(user);
  const addedUser = await User.findById(id);

  if (!activeUser || !addedUser) {
    res.send({ error: "user not found" });
  }

  const activeUserData = func.createConnectionObj(activeUser);
  const addedUserData = func.createConnectionObj(addedUser);

  try {
    activeUser.connections.push(addedUserData);
    addedUser.connections.push(activeUserData);
    await activeUser.save();
    await addedUser.save();
    res.send({
      message: "Succesfully added connection",
      user: activeUser,
    });
  } catch (error) {
    res.send({ error: "Adding connection failed" });
  }
});

app.post("/get-teams", (req, res) => {
  const { teamIds } = req.body;
  Team.find({ _id: { $in: teamIds}})
    .then(data => res.send(data))
    .catch(err => res.send({message: err.message}));
});

app.post("/get-tasks", (req, res) => {
  const { teamIds } = req.body;
  Task.find({ assignedTeam: { $in: teamIds}})
    .then(data => res.send(data))
    .catch(err => res.send({message: err.message}));
})

app.post("/login", (req, res) => {
  const { password, email } = req.body;
  User.where({
    password: password,
    email: email,
  })
    .findOne()
    .then((user) => {
      user
        ? res.send(user)
        : res.send({ error: "email and password do not match" });
    })
    .catch((err) => res.send(err));
});

app.post("/register", async (req, res) => {
  const { name, role, email, password } = req.body;
  const registered = await User.where({
    email: email,
  })
    .findOne()
    .then((user) => {
      return user ? true : false;
    })
    .catch((err) => res.send(err));

  if (registered) {
    res.send({ error: "email adress is already in use" });
  } else {
    const newDate = func.newDate();
    const user = await User.create({
      name: name,
      role: role,
      email: email,
      password: password,
      createdAt: newDate,
      updatedAt: newDate,
      teams: [],
      connections: [],
      notifications: [],
    });
    res.send(user);
  }
});

app.post("/createteam", async (req, res) => {
  try {
    const { name, manager, members } = req.body;

    const team = await Team.create({
      name,
      manager,
      members,
      tasks: [],
      createdOn: func.newDate(),
      messages: [],
      trash: [],
    });

    const teamObj = {
      name,
      members,
      id: team._id,
    };

    const ids = members.map(member => {return member.id});

    await User.updateMany(
      { _id: { $in: ids } },
      { $push: { teams: teamObj} }
    )

    res.send({ message: "Succesfully Created New Team"});
  } catch (err) {
    res.send({ message: err.message });
  }
});

app.post("/createtask", async (req, res) => {
  try {
    const { subtasks, title, team, description, deadline, members, priority } = req.body;
    console.log(team)
    const data = {
      title,
      description,
      subtasks,
      createdOn: func.newDate(),
      deadline,
      priority,
      status: "pending",
      assignedTo: members,
      assignedTeam: team,
      comments: [],
      updates: []
    }

    const newTask = await Task.create(data);

    const taskPointer = {
      title,
      priority,
      status: "pending",
      id: newTask._id
    }

    await Team.findByIdAndUpdate(team.id, {
      $push: { tasks: taskPointer }
    })

    res.send({message: "Succesfully created task"});
  } catch (err) {
    res.send({message: err.message})
  }

});

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
