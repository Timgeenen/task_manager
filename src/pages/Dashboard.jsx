import TaskGraph from "../components/TaskGraph";
import Stats from "../components/Stats";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { useState } from "react";
import { getAllTasks } from "../api/Event";
import Loading from "../components/Loading";

function Dashboard() {
  const { user } = useSelector(state => state.auth);

  const [selectedTeam, setSelectedTeam] = useState("all");

  const { isError, isPending, data, error} = useQuery({
    queryKey: ["tasks"],
    queryFn: getAllTasks
  });

  const changeTeam = (e) => {
    setSelectedTeam(e.target.value)
  };

  if (isError) { alert(error.message) };

  return (
    <div className="w-full flex flex-col gap-2 items-center">
      {isPending && <Loading />}
      {data &&
      <>
        <select onChange={changeTeam}>
          <option value="all">All Teams</option>
          {user.teams.map((team, i) => (
            <option
            key={`team-${i}`}
            value={team.id}
            >{team.name}</option>
          ))}
        </select>
        <>
          <TaskGraph
          selectedTeam={selectedTeam}
          data={data}
          />
          <Stats
          selectedTeam={selectedTeam}
          data={data}
          />
        </>
      </>
      }
    </div>
  )
}

export default Dashboard
