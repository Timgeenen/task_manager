import { useQuery } from "@tanstack/react-query"
import { getAllNotifications } from "../api/Event";
import { getTimePassed } from "../library/helperfunctions";
import useNavigateNotification from "../hooks/useNavigateNotification";

function NotificationList() {
  const { isLoading, isError, isSuccess, error, data } = useQuery({
    queryKey: ["all-notifications"],
    queryFn: getAllNotifications
  });

  if(isError) {console.log(error.message)};
  data && console.log(data)
  return (
    <div className="w-2/3 m-auto">
      {isLoading && <div>Loading...</div>}
      <div className="grid grid-cols-6 p-2 border-2 font-semibold">
        <span className="col-span-1">Title</span>
        <span className="col-span-1">Type</span>
        <span className="col-span-1">Received</span>
        <span className="col-span-3 text-center">Message</span>
      </div>
      <div className="overflow-y-scroll h-80">
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
        />
      ) )}
      </div>
    </div>
  )
}

const CustomLink = React.memo(({
  createdAt, isRead, message, type, task, team, user, notificationId
}) => {
  const title = task ? task.name : team ? team.name : user.name;

  const [handleClick] = useNavigateNotification({
    teamId: team?.id,
    taskId: task?.id,
    userId: user?.id,
    notificationId
  });

  return (
    <button
        className="grid grid-cols-6 w-full p-2 border-2 gap-2 hover:bg-violet-200 text-start text-sm h-16 items-center"
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
