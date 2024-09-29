const mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URI);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
      minLength: [3, "name must be at least 3 characters"],
      maxLength: [50, "name can be a maximum of 50 characters"],
      match: [
        "/^[A-Za-z]+(?:s+[A-Za-z]+)+$/",
        "name can't contain any numbers or special characters",
      ],
      validate: {
        validator: (value) => {
          return value.split().length > 1;
        },
        message: "name must contain first and last name",
      },
      immutable: true,
    },
    role: {
      type: String,
      required: [true, "role is required"],
      minLength: [3, "role must be at least 3 characters"],
      maxLength: [50, "role can be a maximum of 50 characters"],
      match: [
        "/^[A-Za-z0-9 ]*$/",
        "role cannot contain any special characters",
      ],
      trim: true,
      immutable: true,
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: [true, "email adress is already registered"],
      minLength: [6, "email adress must be at least 6 characters long"],
      maxLength: [254, "email adress can be a maximum of 254 characters long"],
      trim: true,
      match: [
        "/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$/",
        "this is not a valid email adress",
      ],
      immutable: true,
    },
    password: {
      type: String,
      required: [true, "password is required"],
      minLength: [8, "password must be at least 8 characters long"],
      maxLength: [50, "password can be a maximum of 50 characters long"],
      trim: true,
      select: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
      immutable: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    teams: [
      {
        name: {
          type: String,
          required: true,
          trim: true,
        },
        id: {
          type: String,
          ref: "Team",
          required: true,
          trim: true,
        },
        managerId: {
          type: String,
          ref: "User",
          required: true,
          trim: true,
        },
        members: [
          {
            name: {
              type: String,
              required: true,
              trim: true,
            },
            role: {
              type: String,
              required: true,
              trim: true,
            },
            email: {
              type: String,
              required: true,
              trim: true,
            },
            id: {
              type: String,
              required: true,
              trim: true,
              ref: "User",
            },
            _id: false,
          },
        ],
        _id: false,
      },
    ],
    connections: [
      {
        name: {
          type: String,
          required: true,
          trim: true,
        },
        role: {
          type: String,
          required: true,
          trim: true,
        },
        email: {
          type: String,
          required: true,
          trim: true,
        },
        id: {
          type: String,
          required: true,
          trim: true,
          ref: "User",
        },
        _id: false,
      },
    ],
    notifications: [
      {
        nType: {
          type: String,
          required: true,
          trim: true,
          enum: {
            values: [
              "New Team",
              "New Task",
              "Task Updated",
              "New Connection",
              "New Message",
            ],
            message: "type must be one of the following: 'New Task', 'New Team', 'Task Updated', 'New Connection', 'New Message'"
          },
        },
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
    refreshToken: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

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

module.exports = {
  User,
  Team,
  Task,
};
