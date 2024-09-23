import { store } from "../redux/store";

export const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  const headerObj = {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  };
    return headerObj;
}

export const getTeamDataObj = (data, user) => {
  const assignedTo = user.connections.filter(item => data.members.includes(item.name));

  const manager = {
    name: user.name,
    role: user.role,
    email: user.email,
    id: user._id
  };

  const members = [...assignedTo, manager];

  return {
    name: data.name,
    manager: manager,
    members: members,
  }
};

export const getTeamIdArray = (teams) => {
  const array = teams.map((team) => (team.id));
  return array;
};

export const getInitials = (name) => {
  let names = name.split(" ");
  let firstLetter = names[0].charAt(0);
  let lastLetter = names[names.length - 1].charAt(0);
  return (firstLetter + lastLetter).toUpperCase();
};

export const getTimePassed = (date) => {
  const lastLogin = Math.floor(new Date(date).getTime() / 1000);
  const currentTime = Math.floor(new Date().getTime() / 1000);
  const timePassed = currentTime - lastLogin;
  const minutes = Math.floor(timePassed / 60);

  if (minutes < 60) { return `${minutes} min`};

  const hours = Math.floor(minutes / 60);
  if (hours < 24) { return `${hours} hr(s)`};

  const days = Math.floor(hours/ 24);
  return `${days} day(s)`;
};

export const getHoursLeft = (date) => {
  const currentTime = Math.floor(new Date().getTime() / 1000);
  const deadline = Math.floor(new Date(date).getTime() / 1000);
  const timeLeft = deadline - currentTime;
  return Math.floor(timeLeft / 60 / 60);
};

export const getTimeDiff = (from, to) => {
  const timeDiff = new Date(to) - new Date(from);
  return timeDiff
}

export const getUrgentDeadlines = (tasks) => {
  let urgent = {
    thisWeek: 0,
    overDue: 0
  }
  tasks.map(task => {
    const hoursLeft = getHoursLeft(task.deadline);
    if (task.status === "completed") { return }
    if (hoursLeft < 0) { urgent.overDue += 1};
    if (hoursLeft / 24 < 7) { urgent.thisWeek += 1};
  });
  return urgent;
};

export const getFilteredConnections = (allUsers) => {

  const user = store.getState().auth.user;
  const connections = user.connections.map(connection => connection.id);
  connections.push(user._id);

  const filtered = allUsers.filter(item => !connections.includes(item._id));

  return filtered;
};

export const countTasksByStatus = (tasks) => {
  let status = [
    {
      status: "in progress",
      count: 0
    }, {
      status: "pending",
      count: 0
    }, {
      status: "completed",
      count: 0
    }, 
  ];

  tasks.filter((task) => {
    if (task.status === "in progress") { status[0].count += 1 };
    if (task.status === "pending") { status[1].count += 1 };
    if (task.status === "completed") { status[2].count += 1 };

  });

  return status;
};

export const countTasksByPriority = (tasks) => {
  let data = [
    {
      priority: "high",
      tasks: 0,
      color: "red"
    }, {
      priority: "medium",
      tasks: 0,
      color: "orange"
    }, {
      priority: "low",
      tasks: 0,
      color: "green"
    }
  ]

  tasks.filter((task) => {
    if (task.priority === "high") {return data[0].tasks += 1 }
    if (task.priority === "medium") { return data[1].tasks += 1 }
    if (task.priority === "low") { return data[2].tasks += 1 }
  });

  return data;
};

export const getGraphData = (tasks) => {
  let data = [
    {
      priority: "high",
      tasks: 0,
      pending: 0,
      inProgress: 0,
      completed: 0,
      overDue: 0,
      thisWeek: 0,
      color: "red"
    }, {
      priority: "medium",
      tasks: 0,
      pending: 0,
      inProgress: 0,
      completed: 0,
      overDue: 0,
      thisWeek: 0,
      color: "orange"
    }, {
      priority: "low",
      tasks: 0,
      pending: 0,
      inProgress: 0,
      completed: 0,
      overDue: 0,
      thisWeek: 0,
      color: "green"
    }
  ]

  tasks.filter((task) => {
    const index = task.priority === "high" ? 0 : task.priority !== "medium" ? 1 : 2;

    data[index].tasks += 1;
    const timeLeft = getHoursLeft(task.deadline);
    if (timeLeft < 0 && task.status !== "completed") { data[index].overDue += 1 };
    if (timeLeft > 0 && timeLeft < 168 && task.status !== "completed") { data[index].thisWeek += 1};
    if (task.status === "pending") { return data[index].pending += 1};
    if (task.status === "in progress") { return data[index].inProgress += 1};
    if (task.status === "completed") { return data[index].completed += 1};
  });

  return data;
};

export const sortTasksByDeadline = (tasks) => {
  const sorted = tasks.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
  return sorted
};

export const getUnreadNotifications = (notifications) => {
  const unRead = notifications.filter(item => { if(item.isRead === false) {return item} });
  return unRead;
};