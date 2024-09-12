import AddButton from "../components/AddButton";
import MembersTag from "../components/MembersTag";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAllTeams } from "../api/Event";

function Teams() {
  const navigate = useNavigate();

  const { isLoading, isError, isSuccess, data, error } = useQuery({
    queryKey: ["teams"],
    queryFn: getAllTeams
  })

  if (isError) { console.error(error.message) };

  return (
    <div className="w-full flex flex-col gap-10">
      {isLoading && <div>Loading...</div>}
      {isSuccess && data?.map((team, i) => (
          <div key={team.id} className="">
            <button className="w-1/4">{team.name}</button>
            <span>
              {team.members.map((member, i) => (
                <MembersTag 
                member={member.name}
                index={i}
                key={`${member.id}${i}`} />
              ))}
            </span>
          </div>
        ))
      }
      <AddButton 
      text="Create Team" 
      handleClick={() => navigate("/create-team")}/>
    </div>
  )
}

export default Teams