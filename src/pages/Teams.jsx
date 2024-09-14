import AddButton from "../components/AddButton";
import MembersTag from "../components/MembersTag";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAllTeams } from "../api/Event";
import { countTasksByPriority, countTasksByStatus, getUrgentDeadlines } from "../library/helperfunctions";
import Countup from "../components/Countup";

function Teams() {
  const navigate = useNavigate();

  const { isLoading, isError, isSuccess, data, error } = useQuery({
    queryKey: ["teams"],
    queryFn: getAllTeams
  })

  if (isError) { console.error(error.message) };

  return (
    <div className="w-full flex flex-col">
      {isLoading && <div>Loading...</div>}
      {isSuccess && data?.map((team, i) => {
          const status = countTasksByStatus(team.tasks);
          const priority = countTasksByPriority(team.tasks);
          const total = team.tasks.length;
          const urgent = getUrgentDeadlines(team.tasks);

          return (<div key={team.id} className="flex p-2 m-2 border-2 rounded-xl">
            <div className="flex flex-col w-1/5 min-w-52 items-start gap-8">
            <button className="text-2xl font-semibold">{team.name}</button>
            <span>
              <div className="font-semibold">Manager</div>
              <div>{team.manager.name}</div>
              <div className="text-xs">{team.manager.role}</div>
            </span>
            <span>
              <div className="font-semibold">Team Members</div>
              {team.members.map((member, index) => (
                <MembersTag 
                member={member.name}
                index={index}
                memberId={member.id} />
              ))}
            </span>
            </div>
            <div className="border-l-2 w-full overflow-y-scroll h-56">
              {team.tasks?.map((task, index) => (
                <div>
                  {task.title}
                </div>
              ))}
            </div>
            <div className="flex flex-col m-auto gap-6">
              <div className="flex">
                <div>
                  {priority.map((item) => (
                    <Countup
                    actual={item.tasks}
                    total={total === 0 ? 1 : total}
                    parameter={item.priority}
                    radius={20}
                    color={item.color}
                    />
                  ))}
                </div>
                <div>
                  {status.map((item) => (
                    <Countup
                    actual={item.count}
                    total={total === 0 ? 1 : total}
                    parameter={item.status}
                    radius={20}
                    />
                  ))}
                </div>
              </div>
              <div className="m-auto">
                <div className="text-sm">
                  <span className="font-extrabold">{urgent.thisWeek} </span>
                  Task(s) have to be finished this week
                </div>
                {urgent.overDue > 0 && <div className="text-red-600 text-sm">
                  <span className="font-extrabold">{urgent.overDue} </span>Deadline(s) have passed
                </div>}
              </div>
            </div>
          </div>
          )
        })
      }
      <AddButton 
      text="Create Team" 
      handleClick={() => navigate("/create-team")}/>
    </div>
  )
}

export default Teams