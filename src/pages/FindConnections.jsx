import { FaPlus } from "react-icons/fa";
import { getFilteredConnections, getTimePassed } from "../library/helperfunctions";
import { useMutation, useQuery } from "@tanstack/react-query";
import { addConnection, getAllUsers } from "../api/Event";
import { useDispatch } from "react-redux";
import { updateUser } from "../redux/state/authSlice";

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
    <div className="w-full m-4">
      {mutation.isSuccess && <div className="text-xs text-green-400">Succesfully added connection</div>}
      {getFilteredConnections(data)?.map((item, i) => (
        <div 
        className="w-full flex justify-between border-2 border-slate-400 p-2"
        key={item._id}>
          <span className="">{item.name}</span>
          <span className="">{item.role}</span>
          <span>{
            item.isActive
            ? <span className="text-green-400">Online</span>
            : getTimePassed(item.updatedAt)
        }</span>
          <button onClick={() => addFriend(item._id)}>
            <FaPlus />
          </button>
        </div>
      ))}
    </div>
  )
}

export default FindConnections
