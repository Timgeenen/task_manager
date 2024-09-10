import { memo, useState } from "react";
import { useNavigate } from "react-router-dom";

function NotificationLink({
message,
type,
isNew,
teamName,
teamId,
taskName,
taskId
}) {
  const [unread, setUnread] = useState(isNew);
  const navigate = useNavigate();
  const handleClick = () => {
    //TODO: create navigate route based on notification type
    console.log("navigated");
  }
  return (
    <button
    onClick={handleClick}
    className="mb-1 border-2 p-1 rounded-lg">
      <div className="text-sm flex justify-between font-semibold pb-1">
        <span className="">{type}</span>
        <span>{teamName}</span>
      </div>
      <span className="text-xs line-clamp-1">{message}</span>
    </button>
  )
}

export default memo(NotificationLink);