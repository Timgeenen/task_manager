import { useQuery, useQueryClient } from "@tanstack/react-query";
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
    error,
    data
  } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const notifications = await getAllNotifications(true)
      notifications.length > 1 && setNewNotifications(true);
      return notifications;
    },
  });

  const queryClient = useQueryClient();

  const navigate = useNavigate();
  const navigateToNotifications = () => {
    console.log("navigated to notifcations page")
  }

  const { socket } = useSelector(state => state.auth);

  const [newNotifications, setNewNotifications] = useState(false);
  const [openNotifications, setOpenNotifications] = useState(false);

  if (isError) { console.error(error.message) };

  useEffect(() => {
    socket.on("receiveNotification", (newUpdate) => {
      const notifications = queryClient.getQueryData(["notifications"]);
      queryClient.setQueryData(["notifications"], [newUpdate, ...notifications]);
      setNewNotifications(true);
    });
  }, []);

  const updateNotificationQuery = (index) => {
    const notifications = queryClient.getQueryData(["notifications"]);
    notifications.splice(index, 1);
    queryClient.setQueryData([...notifications]);
  }

  const showNotifications = () => {
    newNotifications && setNewNotifications(false);
    setOpenNotifications(!openNotifications);
  };

  return (
    <Tippy
    appendTo={document.body}
    content={
      <div className="flex flex-col p-2 gap-2">
        {isLoading && <span>Loading...</span>}
        {data && data?.slice(0, 10).map((item, i) => (
          <NotificationLink
          message={item.message}
          type={item.nType}
          teamName={item.team?.name}
          teamId={item.team?.id}
          taskName={item.task?.name}
          taskId={item.task?.id}
          userName={item.user?.name}
          userId={item.user?.id}
          notificationId={item._id}
          updateQuery={updateNotificationQuery}
          index={i}
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
      <button
      onClick={showNotifications}
      className="relative"
      >
        <IoMdNotificationsOutline size="2em"/>
        {newNotifications && 
        <span className="absolute bottom-1 right-1 bg-red-600 rounded-full p-1"></span>}
      </button>
    </Tippy>
  )
}

export default memo(Notifications)