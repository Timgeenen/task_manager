import TaskGraph from "../components/TaskGraph";
import Stats from "../components/Stats";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { useState } from "react";
import { getAllTasks } from "../api/Event";
import Loading from "../components/Loading";
import NotificationList from "../components/NotificationList";

function Dashboard() {
  const { user } = useSelector(state => state.auth);

  const [selectedTeam, setSelectedTeam] = useState("all");

  const { isError, isPending, data, error} = useQuery({
    queryKey: ["tasks"],
    queryFn: () => getAllTasks(user.teams)
  });

  const changeTeam = (e) => {
    setSelectedTeam(e.target.value)
  };

  if (isError) { alert(error.message) };

  return (
    <div className="w-full overflow-y-scroll">
      <div className="m-auto max-w-4xl p-2 pt-8 justify-center flex flex-wrap gap-2 pb-40">
        {isPending && <Loading />}
        {data &&
        <>
        <Stats
        selectedTeam={selectedTeam}
        data={data}
        />
        <div className="flex flex-col items-center">
          <TaskGraph
          selectedTeam={selectedTeam}
          data={data}
          />
          <select
          onChange={changeTeam}
          className="rounded-md p-1 pl-3 pr-3 bg-blue-600 text-white"
          >
            <option value="all">All Teams</option>
            {user.teams.map((team, i) => (
              <option
              key={`team-${i}`}
              value={team.id}
              >{team.name}</option>
            ))}
          </select>
        </div>
        </>
        }
          <NotificationList />

      </div>
    </div>
  )
}

export default Dashboard
