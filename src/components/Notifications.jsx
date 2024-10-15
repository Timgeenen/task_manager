import { useQuery, useQueryClient } from "@tanstack/react-query";
import Tippy from "@tippyjs/react";
import { memo, useEffect, useState } from "react";
import { getAllNotifications } from "../api/Event";
import NotificationLink from "./NotificationLink";
import { useNavigate } from "react-router-dom";
import { IoIosNotificationsOutline } from "react-icons/io";
import { useSocket } from "../context/SocketProvider";
import { useSelector } from "react-redux";
import Loading from "./Loading";

function Notifications() {
  const {
    isError,
    isLoading,
    isSuccess,
    error,
    data
  } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => getAllNotifications(true),
    staleTime: 5000,
    cacheTime: 5000
  });

  const socket = useSocket();
  const queryClient = useQueryClient();

  const { user } = useSelector(state => state.auth);

  const navigate = useNavigate();
  const navigateToNotifications = () => {
    navigate(`/profile/${user._id}`)
  }

  const [newNotifications, setNewNotifications] = useState(false);
  const [openNotifications, setOpenNotifications] = useState(false);

  if (isError) { console.error(error.message) };

  useEffect(() => {
    data?.length > 1 && setNewNotifications(true)
  }, [data])

  useEffect(() => {
    if (socket) {
      socket.on("receiveNotification", (newUpdate) => {
        const notifications = queryClient.getQueryData(["notifications"]);
        queryClient.setQueryData(["notifications"], [newUpdate, ...notifications]);
        setNewNotifications(true);
      });
    }
  }, [socket]);

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
        {isLoading && <Loading />}
        {isSuccess && data?.slice(0, 5).map((item, i) => (
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
        <IoIosNotificationsOutline size={36}/>
        {newNotifications && 
        <span className="absolute bottom-1 right-1 bg-red-600 rounded-full p-1"></span>}
      </button>
    </Tippy>
  )
}

export default memo(Notifications)