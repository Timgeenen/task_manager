import { useQuery } from "@tanstack/react-query";
import Tippy from "@tippyjs/react";
import { memo, useEffect, useState } from "react";
import { IoMdNotificationsOutline } from "react-icons/io";
import { getAllNotifications } from "../api/Event";
import { useSelector } from "react-redux";
import NotificationLink from "./NotificationLink";
import { useNavigate } from "react-router-dom";

function Notifications() {
  const {
    isError,
    isLoading,
    isSuccess,
    error,
    data
  } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => getAllNotifications(),
    staleTime: Infinity
  });

  const navigate = useNavigate();
  const navigateToNotifications = () => {
    console.log("navigated to notifcations page")
  }

  const { socket } = useSelector(state => state.auth);

  const [notifications, setNotifications] = useState([]);
  const [newNotifications, setNewNotifications] = useState(true);
  const [openNotifications, setOpenNotifications] = useState(false);

  if (isError) { alert(error.message) };
  
  useEffect(() => {

    setNotifications(data.notifications);
    socket.on("receiveNotification", (newUpdate) => {
      !newNotifications && setNewNotifications(true);
      setNotifications([newUpdate, ...notifications]);
    });
  }, []);

  const showNotifications = () => {
    newNotifications && setNewNotifications(false);
    setOpenNotifications(!openNotifications);
  }
  return (
    <Tippy
    content={
      <div className="flex flex-col p-2 gap-2">
        {isLoading && <span>Loading...</span>}
        {/* TODO: change to use data instead of fake data */}
        {notifications.map((item) => (
          <NotificationLink
            message={item.message}
            type={item.nType}
            isNew={item.isRead}
            teamName={item.team.name}
            teamId={item.team.id}
            taskName={item.task && item.task.name}
            taskId={item.task && item.task.id}
          />
        ))}
        <button
        onClick={navigateToNotifications}
        className="text-xs"
        >See All Notifications</button>
      </div>
    }
    onClickOutside={() => {
      openNotifications && setOpenNotifications(false);
    }}
    interactive={true}
    visible={openNotifications}
    >
      <button onClick={showNotifications} >
        <IoMdNotificationsOutline size="2em"/>
        {newNotifications && 
        <span className="absolute bottom-3 right-3 bg-red-600 rounded-full p-1"></span>}
      </button>
    </Tippy>
  )
}

export default memo(Notifications)
