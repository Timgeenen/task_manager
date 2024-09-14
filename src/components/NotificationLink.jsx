import { memo } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function NotificationLink({
message,
type,
teamName,
teamId,
taskName,
taskId,
userName,
userId,
notificationId,
index,
updateQuery
}) {
  const { socket } = useSelector(state => state.auth);
  const navigate = useNavigate();

  const id = teamId ? teamId : taskId ? taskId : userId;
  const route = teamId ? `/team-info/${id}` : taskId ? `/task-info/${id}` : `/profile/${id}`
  const title = teamName ? teamName : taskName ? taskName : userName;

  const handleClick = () => {
    socket.emit("readNotification", userId, notificationId, (response) => {
      if (response.error) { return console.error(response.error.message) };
      updateQuery(index);
      navigate(route)
    });
  };

  return (
    <button
    key={notificationId}
    id={notificationId}
    onClick={handleClick}
    className="mb-1 border-2 p-1 rounded-lg">
      <div className="text-sm flex justify-between font-semibold pb-1">
        <span className="">{type}</span>
        <span>{title}</span>
      </div>
      <span className="text-xs line-clamp-1 items-start">{message}</span>
    </button>
  )
}

export default memo(NotificationLink);