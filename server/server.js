require("dotenv").config();
const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

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
      _id: false,
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
      isRead: Boolean,
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
      deadline: Date,
      id: String,
      _id: false,
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
  subtasks: [
    {
      name: String,
      completed: {
        type: Boolean,
        default: false,
      },
    },
  ],
  createdAt: Date,
  deadline: Date,
  priority: String,
  status: String,
  assignedTo: [
    {
      name: String,
      id: String,
      _id: false,
    },
  ],
  assignedTeam: {
    name: String,
    id: String,
    _id: false,
  },
  // activelyWorking: [
  //   {
  //     name: String,
  //     id: String,
  //     _id: false,
  //   },
  // ],
  comments: [
    {
      author: {
        name: String,
        id: String,
        _id: false,
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
        _id: false,
      },
      message: String,
      updatedAt: Date,
    },
  ],
});

let User = mongoose.model("user", userSchema);
let Team = mongoose.model("team", teamSchema);
let Task = mongoose.model("task", taskSchema);

//user api calls
app.post("/login", async (req, res) => {
  const { password, email } = req.body;
  try {
    const user = await User.where({
      password: password,
      email: email,
    }).findOne();
    res.send(user);
  } catch (err) {
    res.send(err);
  }
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

app.get("/connections", async (req, res) => {
  try {
    const users = await User.find(
      {},
      {
        name: 1,
        role: 1,
        email: 1,
        isActive: 1,
        updatedAt: 1,
      }
    );
    res.send(users);
  } catch (err) {
    res.send(err);
  }
});

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
    res.send({ user: activeUser });
  } catch (error) {
    res.send({ error: "Adding connection failed" });
  }
});

app.get("/user:id", (req, res) => {
  User.findById(req.params.id)
    .then((user) => res.send(user))
    .catch((err) => res.send(err));
});

//task api calls
app.post("/create-task", async (req, res) => {
  const { subtasks, title, team, description, deadline, members, priority } =
    req.body;

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
    updates: [],
  };

  try {
    const newTask = await Task.create(data);

    const taskPointer = {
      title,
      priority,
      status: "pending",
      deadline,
      id: newTask._id,
    };

    await Team.findByIdAndUpdate(team.id, {
      $push: { tasks: taskPointer },
    });

    res.send({ message: "Succesfully created task" });
  } catch (err) {
    res.send(err);
  }
});

app.get("/task:id", async (req, res) => {
  const { id } = req.params;
  try {
    const task = await Task.findById(id, {
      title: 1,
      description: 1,
      subtasks: 1,
      deadline: 1,
      priority: 1,
      status: 1,
      assignedTo: 1,
      assignedTeam: 1,
      comments: 1,
      updates: 1,
    });
    res.send(task);
  } catch (err) {
    res.send(err);
  }
});

app.get("/comments:id", async (req, res) => {
  const { id } = req.params;
  try {
    const comments = await Task.findById(id, { comments: 1, _id: 0 });
    res.send(comments);
  } catch (err) {
    res.send(err);
  }
});

app.post("/get-all-tasks", async (req, res) => {
  const teamIds = req.body;
  try {
    const tasks = await Task.find({ "assignedTeam.id": { $in: teamIds } });
    res.send(tasks);
  } catch (err) {
    res.send(err);
  }
});

app.post("/get-tasks-by-teamId", (req, res) => {
  const { teamIds } = req.body;
  Team.find({ _id: { $in: teamIds } })
    .then((data) => {
      const tasks = data.flatMap((team) => team.tasks);
      const taskIds = tasks.map((task) => task.id);
      Task.find({ _id: { $in: taskIds } })
        .then((tasks) => res.send(tasks))
        .catch((err) => res.send(err.message));
    })
    .catch((err) => res.send({ message: err.message }));
});

//team api calls
app.post("/get-teams", (req, res) => {
  const { teamIds } = req.body;
  Team.find({ _id: { $in: teamIds } })
    .then((data) => res.send(data))
    .catch((err) => res.send(err));
});

app.post("/get-team-tasksArr", async (req, res) => {
  const teamIds = req.body;
  try {
    const tasks = await Team.find(
      { _id: { $in: teamIds } },
      { tasks: 1, _id: 0 }
    );

    const taskArr = tasks.flatMap((obj) => obj.tasks);
    res.send(taskArr);
  } catch (err) {
    res.send(err);
  }
});

app.post("/create-team", async (req, res) => {
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

    const ids = members.map((member) => {
      return member.id;
    });

    await User.updateMany({ _id: { $in: ids } }, { $push: { teams: teamObj } });

    const user = await User.findById(manager.id);

    res.send(user);
  } catch (err) {
    res.send(err);
  }
});

//io chatrooms
io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("joinTaskRoom", (taskId) => {
    socket.join(taskId);
    console.log(`User {add name} joined the chat for ${taskId}`);
  });

  socket.on("sendMessage", async (messageObj) => {
    const { author, message, taskId } = messageObj;
    const comment = {
      author,
      message,
      createdAt: func.newDate(),
    };

    try {
      const updatedTask = await Task.findByIdAndUpdate(taskId, {
        $push: { comments: { $each: [comment], $position: 0 } },
      }, { new: true });
      io.to(taskId).emit("receiveMessage", updatedTask.comments[0]);
    } catch (err) {
      console.error(err.message);
    }
  });

  socket.on("disconnect", () => {
    console.log(`User {add name} has disconnected`);
  });
});

httpServer.listen(8080, () => {
  console.log("Server is running on port 8080");
});
