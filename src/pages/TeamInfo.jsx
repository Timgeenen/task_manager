import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom"
import { getTeamById } from "../api/Event";
import MembersTag from "../components/MembersTag";
import Chatroom from "../components/Chatroom";
import Loading from "../components/Loading";
import TasksListSmall from "../components/TasksListSmall";

function TeamInfo() {
  const { teamId } = useParams();

  const { isLoading, isError, error, data } = useQuery({
    queryKey: [`team-${teamId}`],
    queryFn: () => getTeamById(teamId)
  });

  if(isError) {console.error(error.message)};

  return (
    <div className="w-full h-full flex justify-center">
      {isLoading && <Loading />}
      {data && 
        <div className="w-3/4 mt-8">
          <div className="mb-4">
            <h1 className="text-3xl font-semibold m-2 mb-6">{data?.name}</h1>
            <div className="flex w-full shadow-lg rounded-lg p-2">
              <div className="w-60 flex flex-col gap-y-1 p-2 overflow-y-scroll">
                <User
                member={data?.manager}
                isManager={true}
                />
                {data?.members.map((member, i) =>
                member.id !== data.manager.id && (
                  <User
                  member={member}
                  isManager={false}
                  index={i}
                  />
                ))}
              </div>
              <TasksListSmall data={data.tasks} />
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
