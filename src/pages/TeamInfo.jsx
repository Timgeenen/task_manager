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
    <div className="w-full h-full border-4 flex justify-center">
      {isLoading && <div>Loading...</div>}
      {data && 
        <div className="w-3/4 overflow-hidden">
          <h1 className="text-3xl font-semibold m-2 mt-10 mb-6">{data[0]?.name}</h1>
          {/* <span>{data[0].createdOn.split('T')[0]}</span> */}
          <div className="flex w-full">
            <div className="w-60 border-2 flex flex-col gap-y-1 p-2 overflow-y-scroll">
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
            className="flex flex-col"
            >
              {data[0]?.tasks.map((task, i) => (
                <button
                className="grid grid-flow-col auto-cols-fr border-2 p-2 hover:bg-blue-300"
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
