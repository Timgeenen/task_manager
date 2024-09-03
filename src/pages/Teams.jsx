import { useSelector } from "react-redux"
import AddButton from "../components/AddButton";
import { useState } from "react";
import AddNewTeam from "../components/AddNewTeam";

function Teams() {
  const { user } = useSelector(state => state.auth);

  const [createTeamOpen, setCreateTeamOpen] = useState(false);

  const closeForm = (e) => {
    e.preventDefault()
    setCreateTeamOpen(false);
  }

  return (
    <div className="w-full">
      {
        user.teams.map((item, i) => (
          <div>
            {item.title}
          </div>
        ))
      }
      <AddButton text="Create Team" handleClick={() => setCreateTeamOpen(true)}/>
        {createTeamOpen && 
          <AddNewTeam handleClick={closeForm}/>
        }
    </div>
  )
}

export default Teams