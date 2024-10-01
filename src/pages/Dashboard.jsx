import TaskGraph from "../components/TaskGraph";
import Stats from "../components/Stats";
import { useMutation } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getTeamIdArray } from "../library/helperfunctions";
import { getTeamTaskArr } from "../api/Event";
import Loading from "../components/Loading";

function Dashboard() {
  const { user } = useSelector(state => state.auth);

  const [selectedTeam, setSelectedTeam] = useState(null);

  const { isError, isPending, data, error, mutateAsync} = useMutation({
    mutationKey: ["tasks"],
    mutationFn: (teamIdArray) => getTeamTaskArr(teamIdArray)
  });

  const changeTeam = (e) => {
    e.target.value === "all" 
    ? setSelectedTeam(allTeams)
    : setSelectedTeam(allTeams.filter(team => team.id === e.target.value));
  };

  useEffect(() => {
    if (!selectedTeam) {
      const allTeams = user.teams.map(team => ({name: team.name, id: team.id}));
      setSelectedTeam(allTeams);
      const teamIdArray = getTeamIdArray(allTeams);
      mutateAsync(teamIdArray);
    } else {
      const teamIdArray = getTeamIdArray(selectedTeam);
      mutateAsync(teamIdArray); 
    }
  }, [selectedTeam]);

  if (isError) { alert(error.message) };

  return (
    <div className="w-full flex flex-col gap-2 items-center">
      {isPending && <Loading />}
      {data &&
      <>
        <select onChange={changeTeam}>
          <option value="all">All Teams</option>
          {selectedTeam.map((team, i) => (
            <option
            key={`team-${i}`}
            value={team.id}
            >{team.name}</option>
          ))}
        </select>
        <>
          <TaskGraph data={data} />
          <Stats data={data}/>
        </>
      </>
      }
    </div>
  )
}

export default Dashboard
