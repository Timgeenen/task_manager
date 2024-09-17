import MembersTag from "../components/MembersTag";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAllTeams } from "../api/Event";
import { countTasksByPriority, countTasksByStatus, getUrgentDeadlines } from "../library/helperfunctions";
import Countup from "../components/Countup";
import usePages from "../hooks/usePages";

function Teams() {
  const navigate = useNavigate();

  const { isLoading, isError, isSuccess, data, error } = useQuery({
    queryKey: ["teams"],
    queryFn: getAllTeams
  });

  const [prev, next, low, high, page, lastPage] = usePages(data?.length, 6);

  if (isError) { console.error(error.message) };
  if (data) {console.log(data)}

  return (
    <div
    className="w-auto mr-auto ml-auto flex flex-wrap justify-center items-center max-w-fit overflow-y-scroll pt-16 pb-28"
    >
      {data && 
        <div className="flex justify-center w-auto absolute top-16 p-2 rounded-full filter backdrop-blur-sm shadow-xl">
          <button
          onClick={prev}
          className="border-2 w-28 p-1 rounded-full bg-blue-600 text-white"
          >
            Prev
          </button>
          <span className="text-center mt-auto mb-auto ml-2 mr-2 bg-transparent text-gray-500">{page}/{lastPage}</span>
          <button
          onClick={next}
          className="border-2 w-28 p-1 rounded-full bg-blue-600 text-white"
          >
            Next
          </button>
        </div>
      }
      {isLoading && <div>Loading...</div>}
      {isSuccess && data?.map((team, i) => {
          if (i < low || i > high) {return}
          const status = countTasksByStatus(team.tasks);
          const priority = countTasksByPriority(team.tasks);
          const total = team.tasks.length;
          const urgent = getUrgentDeadlines(team.tasks);

          return (
          <button
          key={team.id}
          className="flex p-2 m-2 border-2 rounded-xl h-60 hover:bg-blue-300 shadow-lg"
          onClick={() => navigate(`/team-info/${team._id}`)}
          >
            <div className="flex flex-col w-52 items-start text-left gap-6 border-r-2 p-1">
              <div className="text-2xl font-semibold w-48 inline-block overflow-ellipsis overflow-hidden whitespace-nowrap">
                {team.name}
              </div>
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
            <div className="flex flex-col m-auto gap-2 p-1">
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
              <div className="m-auto text-start">
                <div className="text-sm">
                  <span className="font-extrabold">{urgent.thisWeek} </span>
                  Task(s) have to be finished this week
                </div>
                {urgent.overDue > 0 && <div className="text-red-600 text-sm">
                  <span className="font-extrabold">{urgent.overDue} </span>Deadline(s) have passed
                </div>}
              </div>
            </div>
          </button>
          )
        })
      }
    </div>
  )
}

export default Teams