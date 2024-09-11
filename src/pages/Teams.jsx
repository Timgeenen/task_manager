import { useSelector } from "react-redux";
import AddButton from "../components/AddButton";
import MembersTag from "../components/MembersTag";
import { useNavigate } from "react-router-dom";

function Teams() {
  const { user } = useSelector(state => state.auth);
  const navigate = useNavigate();

  return (
    <div className="w-full flex flex-col gap-10">
      {user.teams.map((team, i) => (
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