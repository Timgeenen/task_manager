import { useSelector } from "react-redux"
import { getTeamIdArray } from "../library/helperfunctions";
import { useQuery } from "@tanstack/react-query";
import { getConnections } from "../api/Event";
import { useNavigate } from "react-router-dom";
import UserInfo from "../components/UserInfo";
import Loading from "../components/Loading";

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
    <div className="w-full h-max flex flex-wrap mr-auto pb-8 ml-auto pt-10 justify-center gap-4 overflow-y-scroll">
      {isLoading && <Loading />}
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
