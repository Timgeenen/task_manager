require("dotenv").config();
const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");

const helmet = require("helmet");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(12);
  const hashedPassword = bcrypt.hash(password, salt);
  return hashedPassword;
};
const verifyPassword = async (password, hashedPassword) => {
  const isMatch = await bcrypt.compare(password, hashedPassword);
  return isMatch;
};
const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    res.status(401);
    res.send({ message: "no token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401);
    res.send("invalid token");
  }
};

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

//TODO: REMOVE
let userId;

mongoose.connect(process.env.MONGO_URI);

const cors = require("cors");
const bodyParser = require("body-parser");
const func = require("./functions");
const corsOptions = { origin: "http://localhost:3000" };
app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//helmetjs configuration
app.use(helmet());

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
      managerId: String,
      members: [
        {
          name: String,
          role: String,
          email: String,
          id: String,
          _id: false,
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
      nType: String,
      team: {
        name: String,
        id: String,
        _id: false,
      },
      task: {
        name: String,
        id: String,
        _id: false,
      },
      user: {
        name: String,
        id: String,
        _id: false,
      },
      message: String,
      isRead: {
        type: Boolean,
        default: false,
      },
      createdAt: {
        type: Date,
        default: new Date(),
      },
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
  comments: [
    {
      author: {
        name: String,
        id: String,
        _id: false,
      },
      message: String,
      createdAt: {
        type: Date,
        default: new Date(),
      },
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
    managerId: String,
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
      previousState: {
        description: String,
        subTasks: [
          {
            name: String,
            completed: Boolean,
          },
        ],
        status: String,
      },
      updatedAt: Date,
    },
  ],
});

let User = mongoose.model("user", userSchema);
let Team = mongoose.model("team", teamSchema);
let Task = mongoose.model("task", taskSchema);
//user api calls
app.put("/login", async (req, res) => {
  const { password, email } = req.body;
  try {
    const match = await User.findOne(
      {
        email: email,
      },
      {
        password: 1,
      }
    );
    if (!match) {
      res.status(400);
      res.send({ message: "email and password don't match" });
    } else {
      const valid = verifyPassword(match.password, password);
      if (valid) {
        const user = await User.findById(match._id, {
          password: 0,
          notifications: 0,
        });
        const payload = { myId: user._id };
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: "1h",
        });
        res.send({ user, token });
      } else {
        res.status(400);
        res.send({ message: "email and password don't match" });
      }
    }
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
    res.status(401);
    res.send({ message: "email adress is already in use" });
  } else {
    try {
      const hashedPassword = await hashPassword(password);
      const newDate = func.newDate();
      await User.create({
        name: name,
        role: role,
        email: email,
        password: hashedPassword,
        createdAt: newDate,
        updatedAt: newDate,
        teams: [],
        connections: [],
        notifications: [],
      });
      res.send({ message: "succesfully created account" });
    } catch (error) {
      res.send(error);
    }
  }
});

app.get("/connections", async (req, res) => {
  try {
    const users = await User.find(
      {},
      {
        name: 1,
        role: 1,
        isActive: 1,
        updatedAt: 1,
      }
    );
    res.send(users);
  } catch (err) {
    res.send(err);
  }
});

app.post("/get-connected", authMiddleware, async (req, res) => {
  const idArray = req.body;
  try {
    const users = await User.find(
      { _id: { $in: idArray } },
      { name: 1, role: 1, email: 1, updatedAt: 1, isActive: 1 }
    );
    res.send(users);
  } catch (error) {
    res.send(error);
  }
});

app.put("/add-connection", authMiddleware, async (req, res) => {
  const { id } = req.body;
  const { myId } = req.user;

  const activeUser = await User.findById(myId);
  const addedUser = await User.findById(id);

  if (!activeUser || !addedUser) {
    res.send({ error: "user not found" });
  }

  const activeUserData = func.createConnectionObj(activeUser);
  const addedUserData = func.createConnectionObj(addedUser);
  const notificationObj = {
    nType: "New Connection",
    user: {
      name: activeUser.name,
      id: activeUser._id,
    },
    message: `${activeUser.name} has been added to your connections`,
  };

  try {
    activeUser.connections.push(addedUserData);
    addedUser.connections.push(activeUserData);
    addedUser.notifications.unshift(notificationObj);
    await activeUser.save();
    await addedUser.save();

    io.to(id).emit("receiveNotification", notificationObj);
    res.send({ user: activeUser });
  } catch (error) {
    res.send(error);
  }
});

app.get("/user:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { myId } = req.user;

  try {
    const user = await User.findById(id, {
      password: 0,
      notifications: 0,
    });

    if (!user.connections.find((user) => user.id === myId)) {
      res.status(401);
      res.send("unauthorized access");
    }

    const userObj = {
      user,
      mutualTeams: [],
      mutualConnections: [],
    };

    if (myId !== String(user._id)) {
      const myProfile = await User.findById(userId, {
        teams: 1,
        connections: 1,
        _id: 0,
      });
      const teamIds = user.teams.map((team) => team.id);
      const connectionIds = user.connections.map((connection) => connection.id);

      const mutualTeams = myProfile.teams.filter((team) =>
        teamIds.includes(team.id)
      );
      const mutualConnections = myProfile.connections.filter((connection) =>
        connectionIds.includes(connection.id)
      );

      userObj.mutualTeams = mutualTeams;
      userObj.mutualConnections = mutualConnections;
    }

    res.send(userObj);
  } catch (error) {
    res.send(error);
  }
});

app.get("/notifications:id", authMiddleware, async (req, res) => {
  const id = req.params.id;
  const { unread } = req.query;
  const { myId } = req.user;

  if (id !== myId) {
    res.status(401);
    res.send({ message: "unauthorized access" });
  }

  try {
    const user = await User.findById(id, { notifications: 1 });
    if (unread) {
      user.notifications = user.notifications.filter((item) => !item.isRead);
    }
    res.send(user.notifications);
  } catch (err) {
    res.send(err);
  }
});

//task api calls
app.get("/task:id", authMiddleware, async (req, res) => {
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

app.post("/get-all-tasks", authMiddleware, async (req, res) => {
  const teamIds = req.body;
  try {
    const tasks = await Task.find({ "assignedTeam.id": { $in: teamIds } });
    res.send(tasks);
  } catch (err) {
    res.send(err);
  }
});

// app.post("/get-tasks-by-teamId", authMiddleware, (req, res) => {
//   const { teamIds } = req.body;
//   Team.find({ _id: { $in: teamIds } })
//     .then((data) => {
//       const tasks = data.flatMap((team) => team.tasks);
//       const taskIds = tasks.map((task) => task.id);
//       Task.find({ _id: { $in: taskIds } })
//         .then((tasks) => res.send(tasks))
//         .catch((err) => res.send(err.message));
//     })
//     .catch((err) => res.send({ message: err.message }));
// });

//team api calls
app.get("/get-all-teams", authMiddleware, async (req, res) => {
  const { myId } = req.user;

  try {
    const user = await User.findById(myId, { teams: 1, _id: 0 });
    const teamIdsArray = user.teams.map((team) => team.id);
    const allTeams = await Team.find({ _id: { $in: teamIdsArray } });
    res.send(allTeams);
  } catch (error) {
    res.send(error);
  }
});

app.get("/get-team:teamId", authMiddleware, async (req, res) => {
  const { myId } = req.user;
  const { teamId } = req.params;

  try {
    const team = await Team.findById(teamId);
    const valid = team.members.find((member) => member.id === myId);
    if (valid) {
      res.send(team);
    } else {
      res.status(401);
      res.send({ message: "unauthorized access" });
    }
  } catch (error) {
    res.send(error);
  }

  // Team.findById(teamId)
  //   .then((data) => {
  //     console.log(data);
  //     res.send(data)
  //   })
  //   .catch((err) => res.send(err));
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

//general api calls
app.get("/comments:id/:type", authMiddleware, async (req, res) => {
  const { id, type } = req.params;

  try {
    const query = { comments: 1, _id: 0 };
    let comments;

    if (type === "task") {
      comments = await Task.findById(id, query);
    }

    if (type === "team") {
      comments = await Team.findById(id, query);
    }

    res.send(comments);
  } catch (err) {
    res.send(err);
  }
});

//io sockets
io.on("connection", (socket) => {
  const { user } = socket.handshake.auth;

  if (user) {
    User.findByIdAndUpdate(user._id, { $set: { isActive: true } })
      .then((user) => {
        userId = user._id;
        socket.join(user._id);
        console.log(`${user.name} joined notification channel`);
        user.teams.map((team) => {
          socket.join(team.id);
          console.log(`${user.name} joined ${team.name}`);
        });
      })
      .catch((err) => console.error(err.message));
  }

  socket.on("createTeam", async (teamData, callback) => {
    const { name, manager, members } = teamData;

    try {
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
        managerId: manager.id,
      };

      const ids = members.map((member) => member.id);

      const notificationObj = {
        nType: "New Team",
        team: {
          name: team.name,
          id: team._id,
        },
        message: `You have been added to ${team.name}, created by ${team.manager.name}`,
      };

      await User.updateMany(
        { _id: { $in: ids } },
        {
          $push: {
            teams: teamObj,
            notifications: { $each: [notificationObj], $position: 0 },
          },
        }
      );

      const user = await User.findById(manager.id);

      ids.map((id) => io.to(id).emit("receiveNotification", notificationObj));

      callback({ user });
    } catch (err) {
      callback({
        error: err,
      });
    }
  });

  socket.on("createTask", async (taskData, callback) => {
    const {
      subtasks,
      title,
      team,
      description,
      deadline,
      members,
      priority,
      user,
    } = taskData;

    const ids = members.map((member) => member.id);

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

      const notificationObj = {
        nType: "New Task",
        task: {
          name: title,
          id: newTask._id,
        },
        message: `${user} has added a new task to ${team.name}`,
      };

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

      await User.updateMany(
        { _id: { $in: ids } },
        { $push: { notifications: { $each: [notificationObj], $position: 0 } } }
      );

      io.to(team.id).emit("receiveNotification", notificationObj);
      callback({
        message: "succesfully created task",
      });
    } catch (err) {
      callback({
        error: err,
      });
    }
  });

  socket.on("updateTask", async (taskData, callback) => {
    const { taskId, teamId, subtasks, description, completed } = taskData;

    try {
      const task = await Task.findById(taskId);

      const updateObj = {
        author: {
          name: user.name,
          id: user._id,
        },
        previousState: {
          description: task.description,
          subtasks: task.subtasks,
          status: task.status,
        },
        updatedAt: func.newDate(),
      };

      task.updates.unshift(updateObj);
      task.subtasks = subtasks;
      task.description = description;

      if (completed) {
        task.status = "completed";
      }

      await task.save();

      const notificationObj = {
        nType: completed ? "Task Completed" : "Task Updated",
        task: {
          name: task.title,
          id: task._id,
        },
        message: completed
          ? `${task.title} has been completed`
          : `${user.name} has updated ${task.title}`,
      };

      if (completed) {
        await Team.updateOne(
          { _id: teamId, "tasks.id": taskId },
          {
            $set: { "tasks.$.status": "completed" },
          }
        );
      }

      const ids = task.assignedTo.map((member) => member.id);

      await User.updateMany(
        { _id: { $in: ids } },
        { $push: { notifications: { $each: [notificationObj], $position: 0 } } }
      );

      io.to(task.assignedTeam.id).emit("receiveNotification", notificationObj);

      callback(updateObj);
    } catch (error) {
      callback(error);
    }
  });

  socket.on("readNotification", async (userId, notificationId, callback) => {
    try {
      await User.updateOne(
        { _id: userId, "notifications._id": notificationId },
        { $set: { "notifications.$.isRead": true } }
      );
      callback({});
    } catch (error) {
      callback({ error });
    }
  });

  socket.on("markAllAsRead", async (callback) => {
    try {
      const res = await User.updateOne(
        { _id: userId },
        {
          $set: { "notifications.$[notification].isRead": true },
        },
        {
          arrayFilters: [{ "notification.isRead": false }],
        }
      );

      callback({ res });
    } catch (err) {
      callback(err);
    }
  });

  socket.on("deleteReadNotifications", async (callback) => {
    try {
      await User.findByIdAndUpdate(userId, {
        $pull: { notifications: { isRead: true } },
      });
      callback("success");
    } catch (err) {
      callback(err);
    }
  });

  socket.on("joinNewTeam", (teamId) => {
    socket.join(teamId);
    console.log(`user joined new team: ${teamId}`);
  });

  socket.on("joinTaskRoom", (taskId) => {
    socket.join(taskId);
    console.log(`User {add name} joined the chat for ${taskId}`);
  });

  socket.on("sendMessage", async (messageObj) => {
    const { author, message, socketId, socketType } = messageObj;
    const comment = {
      author,
      message,
      createdAt: func.newDate(),
    };

    try {
      let updatedDocument;
      const query = { $push: { comments: { $each: [comment], $position: 0 } } };

      if (socketType === "task") {
        updatedDocument = await Task.findByIdAndUpdate(socketId, query, {
          new: true,
        });
      }

      if (socketType === "team") {
        updatedDocument = await Team.findByIdAndUpdate(socketId, query, {
          new: true,
        });
      }

      io.to(socketId).emit("receiveMessage", updatedDocument.comments[0]);
    } catch (err) {
      console.error(err.message);
    }
  });

  socket.on("disconnect", async () => {
    await User.findByIdAndUpdate(userId, {
      $set: { isActive: false, updatedAt: new Date() },
    });
    console.log(`You have been disconnected`);
  });
});

httpServer.listen(8080, () => {
  console.log("Server is running on port 8080");
});
