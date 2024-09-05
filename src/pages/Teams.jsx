import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import AddButton from "../components/AddButton";
import AddNewTeam from "../components/AddNewTeam";
import MembersTag from "../components/MembersTag";

function Teams() {
  const { user } = useSelector(state => state.auth);

  const [createTeamOpen, setCreateTeamOpen] = useState(false);
  const [teams, setTeams] = useState([]);

  const closeForm = (e) => {
    e.preventDefault()
    setCreateTeamOpen(false);
  }

  useEffect(() => {
    console.log(user.teams)
    setTeams(user.teams)
  }, [])

  return (
    <div className="w-full flex flex-col gap-10">
      {teams.map((team, i) => (
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
            <div>

            </div>
          </div>
        ))
      }
      <AddButton 
      text="Create Team" 
      handleClick={() => setCreateTeamOpen(true)}/>
        {createTeamOpen && 
          <AddNewTeam handleClick={closeForm}/>
        }
    </div>
  )
}

export default Teams