import { useSelector } from "react-redux"
import { getTeamIdArray, getTimePassed } from "../library/helperfunctions";
import { useQuery } from "@tanstack/react-query";
import { getConnections } from "../api/Event";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { HiMagnifyingGlass } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";

function Connections() {
  const { user } = useSelector(state => state.auth);
  const ids = getTeamIdArray(user.connections)
  const navigate = useNavigate();
  
  const { isSuccess, isLoading, isError, error, data} = useQuery({
    queryKey: ["connections"],
    queryFn: () => getConnections(ids)
  })

  if (isError) { console.error(error.message) };
  if (data) { data.map(item => console.log(item.isActive))}

  return (
    <div className="w-full p-2">
      {isLoading && <div>Loading...</div>}
      {
        data?.map(item => (
          <span className="flex hover:bg-violet-200">
          <div className="grid grid-flow-col auto-cols-fr text-lg text-start w-full border-2 border-r-0 p-2">
            <span>{item.name}</span>
            <span>{item.email}</span>
            <span>{item.role}</span>
          </div>
          <span className="flex border-2 border-l-0">
            {
              item.isActive ?
              <span className="text-green-400 p-2 w-20">Online</span> :
              <span className="text-gray-400 p-2 w-20">{
                getTimePassed(item.updatedAt)
              }</span>
            }
              <button
              onClick={() => {console.log("open chat message editor")}}
              className="p-2"
              disabled={!item.isActive}
              >
                <IoChatbubbleEllipsesOutline size={24} />
              </button>
              <button
              className="p-2"
              onClick={() => {navigate(`/profile/${item._id}`)}}
              >
                <HiMagnifyingGlass size={24} />
              </button>
            </span>
            </span>
        ))
      }
    </div>
  )
}

export default Connections
