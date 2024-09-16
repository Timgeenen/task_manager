import { memo } from "react";
import useNavigateNotification from "../hooks/useNavigateNotification";

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
  const updateFn = () => updateQuery(index);
  const [handleClick] = useNavigateNotification({
    teamId, taskId, userId, notificationId, updateFn
  });

  const title = teamName ? teamName : taskName ? taskName : userName;

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