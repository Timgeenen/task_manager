import { useParams } from "react-router-dom"
import NotificationList from "../components/NotificationList";
import { useQuery } from "@tanstack/react-query";
import { getUserById } from "../api/Event";
import { useSelector } from "react-redux";
import { getTimePassed } from "../library/helperfunctions";
import clsx from "clsx";

function Profile() {
  const { userId } = useParams();
  const { user } = useSelector(state => state.auth);
  const myProfile = user._id === userId;

  const { isError, isLoading, data, error } = useQuery({
    queryKey: [`user-${userId}`],
    queryFn: () => getUserById(userId)
  });

  if (isError) { console.error(error.message)};

  return (
    <div className="w-full flex flex-col">
      {isLoading && <div>Loading...</div>}
      {data && 
        <div>
          <h2>User Info</h2>
          <div className="flex">
            <div className="flex flex-col p-2">
              <span>Name</span>
              <span>Email</span>
              <span>Role</span>
              <span>Last Online</span>
            </div>
            <div className="flex flex-col p-2">
              <span>{data?.name}</span>
              <span>{data?.email}</span>
              <span>{data?.role}</span>
              <span
              className={clsx(data?.isActive && "text-green-400")}
              >{data?.isActive ? "Online" : `${getTimePassed(data?.updatedAt)} ago`}</span>
            </div>
          </div>
        </div>
      }
      {myProfile && <NotificationList />}
    </div>
  )
}

export default Profile
