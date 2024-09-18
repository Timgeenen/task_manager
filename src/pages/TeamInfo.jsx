import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom"
import { getTeamsByIds } from "../api/Event";
import MembersTag from "../components/MembersTag";
import Chatroom from "../components/Chatroom";

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
    <div className="w-full h-full flex justify-center">
      {isLoading && <div>Loading...</div>}
      {data && 
        <div className="w-3/4 mt-8">
          <div className="mb-4">
            <h1 className="text-3xl font-semibold m-2 mb-6">{data[0]?.name}</h1>
            <div className="flex w-full shadow-lg rounded-lg p-2">
              <div className="w-60 flex flex-col gap-y-1 p-2 overflow-y-scroll">
                <User
                member={data[0].manager}
                isManager={true}
                />
                {data[0]?.members.map((member, i) =>
                member.id !== data[0].manager.id && (
                  <User
                  member={member}
                  isManager={false}
                  index={i}
                  />
                ))}
              </div>
              <div
              className="w-full h-68"
              >
                <span className="grid grid-flow-col auto-cols-fr p-1 text-center border-2 rounded-full font-semibold">
                  <span>Title</span>
                  <span>Priority</span>
                  <span>Status</span>
                  <span>Deadline</span>
                </span>
                <div className="flex flex-col h-52 overflow-y-scroll gap-1 mt-1">
                {data[0]?.tasks.map((task, i) => (
                  <button
                  className="grid grid-flow-col auto-cols-fr mr-1 ml-1 rounded-full shadow-md p-1 hover:bg-blue-300"
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
          </div>
          <Chatroom
          socketId={teamId}
          socketType="team"
          />
        </div>
      }
    </div>
  )
}

function User({member, isManager, index}) {
  return (
    <div className="font-semibold flex items-center">
      <MembersTag
      member={member.name}
      memberId={member.id}
      isManager={isManager}
      index={index}
      />
      <div className="ml-6">
        <div>{member.name}</div>
        <div className="text-xs font-light">{member.role}</div>
      </div>
    </div>
  )
}

export default TeamInfo
