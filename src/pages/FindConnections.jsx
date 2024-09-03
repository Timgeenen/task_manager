import axios from "axios"
import { BACKEND } from "../library/constants";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../redux/state/authSlice";

function FindConnections() {
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    const connections = user.connections.map(item => item.id);
    connections.push(user._id);

    axios.get(BACKEND + "/connections")
      .then(data => {
        const filtered = data.data.filter(item => !connections.includes(item._id));
        setUserData(filtered);
      })
      .catch(err => alert(err))
  }, [user]);

  const addFriend = (id) => {
    const userData = {
      user: user._id,
      id,
    };

    axios.put(BACKEND + "/add-connection", userData)
      .then(data => {
        if (data.data.error) { return alert(data.data.error)};
        dispatch(updateUser(user._id))
        alert(data.data.message);
      })
      .catch(err => alert(err));
  }

  const lastOnline = (date) => {
    const lastLogin = Math.floor(new Date(date).getTime() / 1000);
    const currentTime = Math.floor(new Date().getTime() / 1000);
    const timePassed = currentTime - lastLogin;

    const minutes = Math.floor(timePassed / 60);
    if (minutes < 60) { return `${minutes} min`};

    const hours = Math.floor(minutes / 60);
    if (hours < 24) { return `${hours} hr(s)`};

    const days = Math.floor(hours/ 24);
    return `${days} day(s)`;
  }

  return (
    <div className="w-full m-4">
      {userData.map((item, i) => (
        <div 
        className="w-full flex justify-between border-2 border-slate-400 p-2"
        key={item._id}>
          <span className="">{item.name}</span>
          <span className="">{item.role}</span>
          <span>{
            item.isActive ?
            <span className="text-green-400">Online</span> :
            lastOnline(item.updatedAt)
        }</span>
          <button onClick={() => addFriend(item._id)}>
            <FaPlus />
          </button>
        </div>
      ))}
    </div>
  )
}

export default FindConnections
