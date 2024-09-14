import { useParams } from "react-router-dom"

function TeamInfo() {
  const { teamId } = useParams();
  console.log(teamId);
  return (
    <div>
      Team Info
    </div>
  )
}

export default TeamInfo
