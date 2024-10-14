const func = require("./functions");
const jwt = require("jsonwebtoken");
const { User, Team, Task } = require("./mongoose");
const { Server } = require("socket.io");

const initializeSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST", "PUT", "DELETE"],
    },
    connectionStateRecovery: {
      maxDisconnectionDuration: 1000 * 60 * 5,
    },
  });

  io.on("connection", (socket) => {
    const { accessToken } = func.getCookies(socket.handshake.headers.cookie);
    const { myId } = jwt.decode(accessToken);
    const type = socket.handshake.auth.type;

    if (type === "login") {
      User.findByIdAndUpdate(myId, { $set: { isActive: true } })
        .then((user) => {
          socket.join(user._id);
          console.log(`${user.name} joined notification channel`);
          user.teams.map((team) => {
            socket.join(team.id);
            console.log(`${user.name} joined ${team.name}`);
          });
        })
        .catch((err) => console.error(err.message));
    }

    socket.on("reconnect", () => {
      console.log("Reconnected to sockets");
    });

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
      ids.push(myId);

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
          {
            $push: {
              notifications: { $each: [notificationObj], $position: 0 },
            },
          }
        );

        io.to(team.id).emit("receiveNotification", notificationObj);
        callback(newTask);
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
        const user = await User.findById(myId, {
          name: 1,
        });

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

        task.subtasks = subtasks;
        task.description = description;
        task.updates.unshift(updateObj);

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
          {
            $push: {
              notifications: { $each: [notificationObj], $position: 0 },
            },
          }
        );

        io.to(task.assignedTeam.id).emit(
          "receiveNotification",
          notificationObj
        );

        callback(task);
      } catch (error) {
        callback(error);
      }
    });

    socket.on("deleteTask", async (taskId, callback) => {
      const task = await Task.findById(taskId, { _id: 0 });

      if (!task) {
        return callback({ error: { status: 404, message: "Invalid task id" } });
      }
      if (myId !== task.assignedTeam.managerId) {
        return callback({
          error: { status: 403, message: "Unauthorized access" },
        });
      }

      try {
        const team = await Team.findByIdAndUpdate(task.assignedTeam.id, {
          $pull: { tasks: { id: taskId } },
        });

        const notificationObj = {
          nType: "Task Deleted",
          task: {
            name: task.title,
          },
          message: `${task.title} has been deleted from ${task.assignedTeam.name}`,
        };

        const ids = task.assignedTo.map(user => user.id);
        ids.push(task.assignedTeam.managerId);

        const users = await User.updateMany(
          { _id: { $in: ids } },
          {
            $push: {
              notifications: { $each: [notificationObj], $position: 0 },
            },
          }
        );

        await Task.findByIdAndDelete(taskId);

        io.to(task.assignedTeam.id).emit("receiveNotification", notificationObj);
        socket.to(taskId).emit("taskDeleted");
        return callback({ message: "Succesfully deleted task" });
      } catch (error) {
        return callback(error);
      }
    });

    socket.on("startWorkingOnTask", async (taskId, callback) => {
      const task = await Task.findById(taskId);
      if (!task) {
        return callback({ error: { message: "Invalid task id", status: 404 } });
      }
      if (task.status === "completed") {
        return callback({
          error: { message: "Task has already been completed", status: 403 },
        });
      }
      if (task.workingOnTask.includes(myId)) {
        return callback({
          error: { message: "User is already working on task", status: 403 },
        });
      }
      if (
        task.assignedTo.find((item) => item.id === myId) ||
        task.assignedTeam.managerId === myId
      ) {
        task.workingOnTask.push(myId);
        if (task.status === "pending") {
          await Team.updateOne(
            { _id: task.assignedTeam.id, "tasks.id": taskId },
            { $set: { "tasks.$.status": "in progress" } }
          );
          task.status = "in progress";
        }
        task.save();
        return callback(task);
      } else {
        return callback({
          error: { message: "Unauthorized access", status: 403 },
        });
      }
    });

    socket.on("addConnection", async (id, callback) => {
      const activeUser = await User.findById(myId);
      const addedUser = await User.findById(id);

      if (!activeUser || !addedUser) {
        return callback({ error: "user not found" });
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

        callback({ user: activeUser });
      } catch (error) {
        callback(error);
      }
    });

    socket.on("readNotification", async (notificationId, callback) => {
      try {
        await User.updateOne(
          { _id: myId, "notifications._id": notificationId },
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
          { _id: myId },
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
        await User.findByIdAndUpdate(myId, {
          $pull: { notifications: { isRead: true } },
        });
        callback("success");
      } catch (err) {
        callback(err);
      }
    });

    socket.on("joinNewTeam", (teamId) => {
      socket.join(teamId);
      console.log(`You joined a new team: ${teamId}`);
    });

    socket.on("joinTaskRoom", (taskId) => {
      socket.join(taskId);
      console.log(`You joined the task chat for task: ${taskId}`);
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
        const query = {
          $push: { comments: { $each: [comment], $position: 0 } },
        };

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
      await User.findByIdAndUpdate(myId, {
        $set: { isActive: false, updatedAt: new Date() },
      });
      console.log(`You have been disconnected`);
    });
  });

  return io;
};

module.exports = initializeSocket;
