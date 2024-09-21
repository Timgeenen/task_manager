import { useSelector } from "react-redux"
import { getTeamIdArray, getTimePassed } from "../library/helperfunctions";
import { useQuery } from "@tanstack/react-query";
import { getConnections } from "../api/Event";
import { HiMagnifyingGlass } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";
import { ellipsis } from "../library/styles";
import UserInfo from "../components/UserInfo";

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
          <UserInfo
          name={item.name}
          email={item.email}
          role={item.role}
          isActive={item.isActive}
          lastOnline={item.updatedAt}
          userId={item._id}
          isFriend={true}
          onClick={() => {navigate(`/profile/${item._id}`)}}
          />
        ))
      }
    </div>
  )
}

export default Connections
