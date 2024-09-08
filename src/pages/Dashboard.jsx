import TaskGraph from "../components/TaskGraph";
import Stats from "../components/Stats";
import { useMutation } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getTeamIdArray } from "../library/helperfunctions";
import { getTeamTaskArr } from "../api/Event";

function Dashboard() {
  const { user } = useSelector(state => state.auth);
  const allTeams = user.teams.map(team => ({name: team.name, id: team.id}));

  const [selectedTeam, setSelectedTeam] = useState(allTeams);

  const { isError, isPending, isSuccess, data, error, mutateAsync} = useMutation({
    mutationKey: ["tasks"],
    mutationFn: (teamIdArray) => getTeamTaskArr(teamIdArray)
  });

  const changeTeam = (e) => {
    e.target.value === "all" 
    ? setSelectedTeam(allTeams)
    : setSelectedTeam(allTeams.filter(team => team.id === e.target.value));
  };

  useEffect(() => {
    const teamIdArray = getTeamIdArray(selectedTeam);
    mutateAsync(teamIdArray);
  }, [selectedTeam]);

  if (isError) { alert(error.message) };

  return (
    <div className="w-full flex flex-col gap-2 items-center">
      <select onChange={changeTeam}>
        <option value="all">All Teams</option>
        {allTeams.map((team, i) => (
          <option value={team.id}>{team.name}</option>
        ))}
      </select>
      {isPending && <div>Loading...</div>}
      {isSuccess && 
      <>
        <TaskGraph data={data} />
        <Stats data={data}/>
      </>
      }
    </div>
  )
}

export default Dashboard
