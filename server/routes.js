const { User, Team, Task } = require("./mongoose");
const func = require("./functions");
const { authMiddleware } = require("./functions");
const express = require("express");
const router = express.Router();
const path = require("path");
const { body, param, validationResult } = require("express-validator");

//express validator chains
const createEmailChain = () =>
  body("data.email").isEmail().withMessage("Invalid email");
const createPasswordChain = () =>
  body("data.password")
    .trim()
    .escape()
    .isLength({ min: 8, max: 24 })
    .withMessage("Password must be between 8 and 24 characters long");
const createNameChain = () => body("data.name").trim().escape();
const createRoleChain = () =>
  body("data.role")
    .trim()
    .escape()
    .isAlphanumeric()
    .withMessage("Role cannot contain any special characters");
const createIdArrayChain = () => [
  body("data.idArray")
    .isArray({ min: 1 })
    .withMessage("Must be an array containing at least 1 item"),
  body("data.idArray.*")
    .trim()
    .escape()
    .isAlphanumeric()
    .withMessage("Id's cannot contain any special characters"),
];
const createIdChain = () =>
  param("id")
    .trim()
    .escape()
    .isAlphanumeric()
    .withMessage("Id cannot contain any special characters");
const createTypeChain = () =>
  param("type")
    .trim()
    .escape()
    .isAlpha()
    .withMessage("Type can only contain alphabetic characters");

//Return index.html file to prevent page 404
router.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/build/index.html'));
});

//user api calls
router.post(
  "/login",
  createEmailChain(),
  createPasswordChain(),
  async (req, res) => {
    const { errors } = validationResult(req);
    if (errors.length > 0) {
      res.status(403);
      return res.send(errors);
    }

    const { password, email } = req.body.data;

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
        res.status(404);
        res.send({ message: "email and password don't match" });
      } else {
        const valid = func.verifyPassword(match.password, password);
        if (valid) {
          const user = await User.findById(match._id, {
            password: 0,
            notifications: 0,
          });

          const token = func.generateAccessToken(user._id);
          const refreshToken = func.generateRefreshToken(user._id);

          res.cookie("accessToken", token, {
            httpOnly: true,
            secure: true, 
            maxAge: 1000 * 60 * 15,
            sameSite: "None",
          });

          res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true, 
            maxAge: 1000 * 60 * 60 * 24 * 7,
            sameSite: "None",
          });

          res.send(user);
        } else {
          res.status(404);
          res.send({ message: "email and password don't match" });
        }
      }
    } catch (err) {
      res.send(err);
    }
  }
);

router.post(
  "/register",
  createEmailChain(),
  createPasswordChain(),
  createNameChain(),
  createRoleChain(),
  async (req, res) => {
    const { errors } = validationResult(req);
    if (errors.length > 0) {
      res.status(403);
      return res.send(errors);
    }

    const { name, role, email, password } = req.body.data;
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
        const hashedPassword = await func.hashPassword(password);
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
  }
);

router.post("/logout", (req, res) => {
  res.clearCookie("accessToken");

  res.clearCookie("refreshToken");

  res.end();
  res.send({ message: "succesfully logged out user" });
});

router.get("/connections", authMiddleware, async (req, res) => {
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

router.post(
  "/get-connected",
  createIdArrayChain(),
  authMiddleware,
  async (req, res) => {
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
  }
);

router.get("/user:id", createIdChain(), authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { myId } = req.user;

  try {
    const user = await User.findById(id, {
      password: 0,
      notifications: 0,
    });

    if (!user.connections.find((user) => user.id === myId) && !myId === id) {
      res.status(401);
      res.send("unauthorized access");
    }

    const userObj = {
      user,
      mutualTeams: [],
      mutualConnections: [],
    };

    if (myId !== String(user._id)) {
      const myProfile = await User.findById(myId, {
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

router.get("/notifications", authMiddleware, async (req, res) => {
  const { unread } = req.query;
  const { myId } = req.user;

  try {
    const user = await User.findById(myId, { notifications: 1 });
    if (unread) {
      user.notifications = user.notifications.filter((item) => !item.isRead);
    }
    res.send(user.notifications);
  } catch (err) {
    res.send(err);
  }
});

//task api calls
router.get("/task:id", createIdChain(), authMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    const task = await Task.findById(id);
    if (!task) {
      res.status(404);
      return res.send({ message: "Invalid task id" });
    }
    res.send(task);
  } catch (err) {
    res.send(err);
  }
});

router.post(
  "/get-all-tasks",
  createIdArrayChain(),
  authMiddleware,
  async (req, res) => {
    const teamIds = req.body;
    try {
      const tasks = await Task.find({ "assignedTeam.id": { $in: teamIds } });
      res.send(tasks);
    } catch (err) {
      res.send(err);
    }
  }
);

//team api calls
router.get("/get-all-teams", authMiddleware, async (req, res) => {
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

router.get("/get-team:id", authMiddleware, async (req, res) => {
  const { myId } = req.user;
  const { id } = req.params;

  try {
    const team = await Team.findById(id);
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
});

//general api calls
router.get(
  "/comments:id/:type",
  createIdChain(),
  createTypeChain(),
  authMiddleware,
  async (req, res) => {
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
  }
);

router.get("/authorize", authMiddleware, (req, res) => {
  res.send({ message: "Succesfully authorized user" });
});

module.exports = router;
