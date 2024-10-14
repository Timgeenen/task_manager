const mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URI);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
      minLength: [3, "name must be at least 3 characters"],
      maxLength: [50, "name can be a maximum of 50 characters"],
      immutable: true,
    },
    role: {
      type: String,
      required: [true, "role is required"],
      minLength: [3, "role must be at least 3 characters"],
      maxLength: [50, "role can be a maximum of 50 characters"],
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
      immutable: true,
    },
    password: {
      type: String,
      required: [true, "password is required"],
      select: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
      immutable: true,
    },
    isActive: {
      type: Boolean,
      default: false,
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
              "Task Completed",
              "Task Deleted",
              "New Connection",
              "New Message",
            ],
            message:
              "type must be one of the following: 'New Task', 'New Team', 'Task Updated', 'Task Deleted', 'New Connection', 'New Message'",
          },
        },
        team: {
          name: {
            type: String,
            trim: true,
          },
          id: {
            type: String,
            trim: true,
            ref: "Team",
          },
          _id: false,
        },
        task: {
          name: {
            type: String,
            trim: true,
          },
          id: {
            type: String,
            trim: true,
            ref: "Task",
          },
          _id: false,
        },
        user: {
          name: {
            type: String,
            trim: true,
          },
          id: {
            type: String,
            trim: true,
            ref: "User",
          },
          _id: false,
        },
        message: {
          type: String,
          required: true,
          trim: true,
          minLength: [3, "message must be at least 3 characters long"],
          maxLength: [254, "message can be a maximum of 254 characters long"],
        },
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
  },
  { timestamps: true }
);

const teamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minLength: [8, "team name must be at least 8 characters long"],
      maxLength: [50, "team name can be a maximum of 50 characters long"],
      trim: true,
    },
    manager: {
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
    tasks: [
      {
        title: {
          type: String,
          required: true,
          trim: true,
        },
        priority: {
          type: String,
          required: true,
          trim: true,
          enum: ["low", "medium", "high"],
        },
        status: {
          type: String,
          required: true,
          trim: true,
          enum: ["pending", "in progress", "completed"],
        },
        deadline: {
          type: Date,
          required: true,
          trim: true,
        },
        id: {
          type: String,
          required: true,
          trim: true,
          ref: "Task",
        },
        _id: false,
      },
    ],
    comments: [
      {
        author: {
          name: {
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
        message: {
          type: String,
          required: true,
          minLength: [1, "message must contain at least 1 char"],
          maxLength: [500, "message can contain a maximum of 500 characters"],
        },
        createdAt: {
          type: Date,
          default: new Date(),
        },
      },
    ],
  },
  { timestamps: true }
);

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minLength: [8, "task name must be at least 8 characters long"],
      maxLength: [50, "task name can be a maximum of 50 characters long"],
    },
    description: {
      type: String,
      required: true,
      minLength: [1, "task description must contain at least 1 character"],
    },
    subtasks: [
      {
        name: {
          type: String,
          required: true,
          trim: true,
        },
        completed: {
          type: Boolean,
          default: false,
        },
      },
    ],
    deadline: {
      type: Date,
      required: true,
      trim: true,
    },
    priority: {
      type: String,
      required: true,
      trim: true,
      enum: ["low", "medium", "high"],
    },
    status: {
      type: String,
      required: true,
      trim: true,
      enum: ["pending", "in progress", "completed"],
    },
    assignedTo: [
      {
        name: {
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
    workingOnTask: [
      {
        type: String,
        ref: "User",
      },
    ],
    assignedTeam: {
      name: {
        type: String,
        required: true,
        trim: true,
      },
      id: {
        type: String,
        required: true,
        trim: true,
        ref: "Team",
      },
      managerId: {
        type: String,
        required: true,
        trim: true,
        ref: "User",
      },
      _id: false,
    },
    comments: [
      {
        author: {
          name: {
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
        message: {
          type: String,
          required: true,
          trim: true,
          minlength: [1, "message must be at least 1 char long"],
        },
        createdAt: {
          type: Date,
          required: true,
          default: new Date(),
          trim: true,
        },
      },
    ],
    updates: [
      {
        author: {
          name: {
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
        previousState: {
          description: {
            type: String,
            required: true,
            trim: true,
          },
          subTasks: [
            {
              name: {
                type: String,
                required: true,
                trim: true,
              },
              completed: {
                type: Boolean,
                required: true,
              },
            },
          ],
          status: {
            type: String,
            required: true,
            trim: true,
            enum: ["pending", "in progress", "completed"],
          },
        },
      },
    ],
  },
  { timestamps: true }
);

let User = mongoose.model("user", userSchema);
let Team = mongoose.model("team", teamSchema);
let Task = mongoose.model("task", taskSchema);

module.exports = {
  User,
  Team,
  Task,
};
