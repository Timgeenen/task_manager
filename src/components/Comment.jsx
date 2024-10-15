import { useSelector } from "react-redux"
import { getTimePassed } from "../library/helperfunctions";
import { useNavigate } from "react-router-dom";
import { memo } from "react";
import clsx from "clsx";

function Comment({
  authorName,
  authorId,
  message,
  commentId,
  date
}) {
  const { user } = useSelector(state => state.auth);
  const navigate = useNavigate();
  const classes = user._id === authorId
  ? "self-start bg-green-100 ml-2 mr-80"
  : "self-end bg-orange-100 mr-2 ml-80"

  const timePassed = getTimePassed(date);

  const navigateToUser = () => {
    navigate(`/profile/${authorId}`)
  }

  return (
    <div 
    className={clsx("max-w-1/3 min-w-max flex flex-col items-start p-2 rounded-lg border-2", classes)}
    key={commentId}
    >
      <button
      className="text-xs text-gray-400"
      onClick={navigateToUser}
      >{authorName}
      </button>
      <span className="pt-1 pb-1">{message}</span>
      <span className="text-xs text-gray-400">{timePassed} ago</span>
    </div>
  )
}

export default memo(Comment)
