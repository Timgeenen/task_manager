import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom"
import { getTeamsByIds } from "../api/Event";
import MembersTag from "../components/MembersTag";

function TeamInfo() {
  const { teamId } = useParams();
  const navigate = useNavigate();
  const { isSucces, isLoading, isError, error, data } = useQuery({
    queryKey: [`team-${teamId}`],
    queryFn: () => getTeamsByIds([teamId])
  });

  if(isError) {console.error(error.message)};
  data && console.log(data[0]);
  return (
    <div className="w-full flex justify-center">
      {isLoading && <div>Loading...</div>}
      {data && 
        <div>
          <h1 className="text-3xl font-semibold m-2 mt-10 mb-6">{data[0]?.name}</h1>
          {/* <span>{data[0].createdOn.split('T')[0]}</span> */}
          <div className="flex border-2">
            <div className="border-2 flex flex-col gap-y-1 p-2">
              <div className="pb-2 font-semibold">
                <MembersTag
                member={data[0]?.manager.name}
                memberId={data[0]?.manager.id}
                isManager={true}
                />
                <span className="ml-6">
                  {data[0]?.manager.name}
                </span>
              </div>
              {data[0]?.members.map((member, i) =>
              member.id !== data[0].manager.id && (
                <div>
                <MembersTag
                member={member.name}
                memberId={member.id}
                index={i}
                />
                <span className="ml-6 text-sm">{member.name}</span>
                </div>
              ))}
            </div>
            <div
            className="flex flex-col"
            >
              {data[0]?.tasks.map((task, i) => (
                <button
                className="grid grid-flow-col auto-cols-fr border-2"
                onClick={() => navigate(`/task-info/${task.id}`)}
                >
                  <span>{task.title}</span>
                  <span>{task.priority}</span>
                  <span>{task.status}</span>
                  <span>{task.deadline.split("T")[0]}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      }
    </div>
  )
}

export default TeamInfo
