import { useState } from "react";
import { IoMdNotificationsOutline } from "react-icons/io";

function Notifications() {
  const messages = [
    {from: "Tim", team: "team 1", message: "I just added this task to our teams to-do list", id: "1234"},
    {from: "Aimi", team: "team 1", message: "I just completed this task", id: "1235"},
    {from: "Piet", team: "team 1", message: "I just updated this task", id: "1236"},
    {from: "Franske", team: "team 1", message: "I just updated this task", id: "1236"},
    {from: "Piet", team: "team 1", message: "I just updated this task", id: "1236"},
  ]
  //TODO: fetch messages from database, slice first 5 messages
  //TODO: style components
  //TODO: add name badge instead of name
  //TODO: add global state to set new messages


  const [openNotifications, setOpenNotifications] = useState(false);
  const [newNotifications, setNewNotifications] = useState(true);

  const showNotifications = () => {
    newNotifications && setNewNotifications(false);
    setOpenNotifications(!openNotifications);
  }
  return (
    <div className="">
      <button onClick={showNotifications} >
        <IoMdNotificationsOutline size="2em"/>
        {newNotifications && <span className="absolute bottom-3 right-3 bg-red-600 rounded-full p-1"></span>}
      </button>
      {openNotifications && (
        <ul className="absolute w-40 right-1 border-slate-300 p-2">
          {/* TODO: add click handler to redirect to task */}
          {messages.map((item) => (
            <DropdownLink message={item.message} key={item.id} from={item.from} team={item.team} />
          ))}
        </ul>
      )}
    </div>
  )
}

function DropdownLink({message, key, from, team}) {
  const [unread, setUnread] = useState(true);
  return (
    <li key={key} className="mb-1 border-gray-400 border-2 p-1">
      <div className="text-md flex justify-between font-semibold">
        <span className="">{from}</span>
        <span>{team}</span>
      </div>
      <span className="text-sm line-clamp-1">{message}</span>
    </li>
  )
}

export default Notifications
