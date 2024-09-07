import { store } from "../redux/store";

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

export const getFilteredConnections = (allUsers) => {

  const user = store.getState().auth.user;
  const connections = user.connections.map(connection => connection.id);
  connections.push(user._id);

  const filtered = allUsers.filter(item => !connections.includes(item._id));

  return filtered;
};