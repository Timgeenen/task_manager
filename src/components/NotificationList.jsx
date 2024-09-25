import React from "react";
import { useQuery } from "@tanstack/react-query"
import { getAllNotifications } from "../api/Event";
import { getTimePassed } from "../library/helperfunctions";
import useNavigateNotification from "../hooks/useNavigateNotification";
import clsx from "clsx";
import useToggle from "../hooks/useToggle";
import PopupMessage from "./PopupMessage";
import { useSocket } from "../context/SocketProvider";

function NotificationList() {
  const { isLoading, isError, isSuccess, error, data, refetch } = useQuery({
    queryKey: ["all-notifications"],
    queryFn: () => getAllNotifications(false),
  });

  const socket = useSocket();

  const [open, toggle] = useToggle();

  const markAllAsRead = () => {
    socket.emit("markAllAsRead", (response) => {
      if(response.err) { return console.err(response.err) };
      refetch();
    });
  };

  const deleteAllRead = () => {
    socket.emit("deleteReadNotifications", (response) => {
      if(response.err) { return console.error(response.err)};
      refetch();
    })
  };

  if(isError) {console.log(error.message)};

  return (
    <div className="w-2/3 m-auto mt-10 border-2 relative rounded-lg">
      {isLoading && <div>Loading...</div>}
      <div className="grid grid-cols-6 p-2 bg-blue-400 font-semibold rounded-t-md">
        <span className="col-span-1">Title</span>
        <span className="col-span-1">Type</span>
        <span className="col-span-1">Received</span>
        <span className="col-span-3 text-center">Message</span>
      </div>
      <div className="overflow-y-scroll h-80 pl-1 pr-1">
      {isSuccess && data?.map((item) => (
        <CustomLink
        createdAt={item.createdAt}
        isRead={item.isRead}
        message={item.message}
        task={item.task}
        team={item.team}
        user={item.user}
        type={item.nType}
        notificationId={item._id}
        updateFn={refetch}
        />
      ) )}
      </div>
      <button
      className="text-xs text-blue-500 absolute -bottom-6"
      onClick={markAllAsRead}
      >
        Mark all as read
      </button>
      <button
      className="text-xs text-red-600 absolute -bottom-6 right-0"
      onClick={toggle}
      >
        Delete all read messages
      </button>
      <PopupMessage
      open={open}
      toggleOpen={toggle}
      message="Are you sure you want to delete all read messages?"
      proceed={deleteAllRead}
      />
    </div>
  )
}

const CustomLink = React.memo(({
  createdAt, isRead, message, type, task, team, user, notificationId, updateFn
}) => {
  const title = task ? task.name : team ? team.name : user.name;

  const [handleClick] = useNavigateNotification({
    teamId: team?.id,
    taskId: task?.id,
    userId: user?.id,
    notificationId,
    updateFn
  });

  return (
    <button
        className={clsx("rounded-lg mt-1 mb-1 grid grid-cols-6 w-full p-2 border-2 gap-2 hover:bg-blue-300 text-start text-sm h-16 items-center", {"font-semibold bg-yellow-100": !isRead})}
        key={notificationId}
        onClick={handleClick}
        >
      <span
      className="col-span-1 "
      >
        {title}
      </span>
      <span
      className="col-span-1"
      >
        {type}
      </span>
      <span
      className="col-span-1"
      >
        {getTimePassed(createdAt)} ago
      </span>
      <span
      className="col-span-3"
      >
        {message}
      </span>
    </button>
  )
})

export default NotificationList
