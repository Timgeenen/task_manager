import { getFilteredConnections } from "../library/helperfunctions";
import { useMutation, useQuery } from "@tanstack/react-query";
import { addConnection, getAllUsers } from "../api/Event";
import { useDispatch } from "react-redux";
import { updateUser } from "../redux/state/authSlice";
import UserInfo from "../components/UserInfo";

function FindConnections() {
  const dispatch = useDispatch();
  const { isPending, isError, data, error, refetch } = useQuery({
    queryKey: ["connections"],
    queryFn: getAllUsers,
  });

  const mutation = useMutation({
    mutationKey: ["add-connection"],
    mutationFn: (userId) => addConnection(userId)
  });

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
    mutation.mutateAsync(id);
  };

  if (mutation.isError) { alert(mutation.error.message)};
  if (mutation.isSuccess)  { 
    dispatch(updateUser(mutation.data.user))
    refetch();
  }

  return (
    <div className="w-full m-4 mt-10 flex flex-col gap-2 text-lg">
      {mutation.isSuccess && <div className="text-xs text-green-400">Succesfully added connection</div>}
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
