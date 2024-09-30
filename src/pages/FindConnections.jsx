import { getFilteredConnections } from "../library/helperfunctions";
import { useQuery } from "@tanstack/react-query";
import { getAllUsers } from "../api/Event";
import { useDispatch } from "react-redux";
import { updateUser } from "../redux/state/authSlice";
import UserInfo from "../components/UserInfo";
import { useSocket } from "../context/SocketProvider";
import { useState } from "react";
import { errorMessage } from "../library/styles";

function FindConnections() {
  const dispatch = useDispatch();
  const { isPending, isError, data, error, refetch } = useQuery({
    queryKey: ["connections"],
    queryFn: getAllUsers,
  });

  const socket = useSocket();
  const [updateError, setUpdateError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(null);

  if (isPending) {
    return (
      <div>Loading...</div>
    )
  }
  if (isError) {
    return (
      <div>Fetching data failed. Error: {error.message}. Please reload the page to try again.</div>
    )
  }

  const addFriend = async (id) => {
    setIsSuccess(null);
    setUpdateError(null)
    socket.emit("addConnection", id, (response => {
      if (response.error) {
        setUpdateError(response.error.message);
      } else {
        setIsSuccess(true);
        dispatch(updateUser(response.user));
        refetch();
      }
    }))
  };

  return (
    <div className="w-full m-4 mt-10 flex flex-col gap-2 text-lg">
      {isSuccess && <div className="text-xs text-green-400">Succesfully added connection</div>}
      {updateError && <div className={errorMessage}>{updateError}</div>}
      {getFilteredConnections(data)?.map((item, i) => (
        <UserInfo
        name={item.name}
        email={item.email}
        role={item.role}
        isActive={item.isActive}
        lastOnline={item.updatedAt}
        userId={item._id}
        isFriend={false}
        onClick={() => addFriend(item._id)}
        />
      ))}
    </div>
  )
}

export default FindConnections
