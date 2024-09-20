import { useSelector } from "react-redux"
import { getTeamIdArray, getTimePassed } from "../library/helperfunctions";
import { useQuery } from "@tanstack/react-query";
import { getConnections } from "../api/Event";
import { HiMagnifyingGlass } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";
import { ellipsis } from "../library/styles";

function Connections() {
  const { user } = useSelector(state => state.auth);
  const ids = getTeamIdArray(user.connections)
  const navigate = useNavigate();
  
  const { isLoading, isError, error, data} = useQuery({
    queryKey: ["connections"],
    queryFn: () => getConnections(ids)
  })

  if (isError) { console.error(error.message) };

  return (
    <div className="w-full p-4 flex flex-col gap-2 overflow-y-scroll">
      {isLoading && <div>Loading...</div>}
      {
        data?.map(item => (
        <span className="flex hover:bg-blue-300 border-2 bg-blue-50 rounded-full shadow-lg pl-2 pr-2">
          <div className="grid grid-flow-col auto-cols-fr text-lg text-start w-full border-r-0 p-2">
            <span className={ellipsis}>{item.name}</span>
            <span className={ellipsis}>{item.email}</span>
            <span className={ellipsis}>{item.role}</span>
          </div>
          <span className="flex rounded-full">
            {
              item.isActive ?
              <span className="text-green-400 p-2 w-20">Online</span> :
              <span className="text-gray-400 p-2 w-20">{
                getTimePassed(item.updatedAt)
              }</span>
            }
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
