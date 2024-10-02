import { useParams } from "react-router-dom"
import NotificationList from "../components/NotificationList";
import { useQuery } from "@tanstack/react-query";
import { getUserById } from "../api/Event";
import { useSelector } from "react-redux";
import { getTimePassed } from "../library/helperfunctions";
import clsx from "clsx";
import MembersTag from "../components/MembersTag";
import TeamTagSmall from "../components/TeamTagSmall";
import usePages from "../hooks/usePages";
import Loading from "../components/Loading";

function Profile() {
  const { userId } = useParams();
  const { user } = useSelector(state => state.auth);
  const myProfile = user._id === userId;

  const { isError, isLoading, data, error } = useQuery({
    queryKey: [`user-${userId}`],
    queryFn: () => getUserById(userId)
  });

  const [prev, next, low, high, page, lastPage] = usePages(data?.user?.teams?.length, 6);

  if (isError) { console.error(error.message)};

  return (
    <div className="w-full flex flex-col items-center mt-10">
      {isLoading && <Loading />}
      {data &&
        <div>
          <div className="flex flex-col mb-4">
            <div className="flex w-full p-2 pl-0">
              <div className="flex flex-col p-2 pl-0 font-semibold text-lg">
                <span>Name</span>
                <span>Email</span>
                <span>Role</span>
                <span className="text-nowrap">Last Online</span>
              </div>
              <div className="flex flex-col p-2 text-lg">
                <span>{data?.user?.name}</span>
                <span>{data?.user?.email}</span>
                <span>{data?.user?.role}</span>
                <span
                className={clsx(data?.user?.isActive && "text-green-400")}
                >{data?.user?.isActive ? "Online" : `${getTimePassed(data?.user?.updatedAt)} ago`}</span>
              </div>
            </div>
            {!myProfile && data?.mutualConnections.length > 0 &&
              <div className="w-full">
                <div>Mutual Connections</div>
                <div className="flex flex-wrap pr-4">
                {data?.mutualConnections?.map((member, i) => (
                  <MembersTag
                  member={member.name}
                  memberId={member.id}
                  index={i}
                  />
                ))}
                </div>
              </div>
            }
          </div>

          {!myProfile && data?.mutualTeams.length > 0 &&
          <div className="flex min-w-xl max-w-2xl shadow-lg rounded-3xl overflow-clip">
            <button
            className="bg-blue-200 p-3 hover:bg-blue-300"
            onClick={prev}
            >{"<"}</button>
            <div className="flex flex-col w-full items-center bg-blue-50">
              <span>Mutual Teams</span>
              <div className="flex flex-wrap gap-10 p-5 justify-center">
                {data?.mutualTeams?.map((team, i) => {
                  if (i < low || i > high) { return }
                  const manager = team.members.find(member => member.id === (team.managerId ? team.managerId : user._id))
                  return (
                    <TeamTagSmall
                    name={team.name}
                    managerName={manager.name}
                    managerId={manager.id}
                    memberCount={team.members.length}
                    index={i}
                    teamId={team.id}
                    />
                )})}
              </div>
              <span className="p-1">{page}/{lastPage}</span>
            </div>
            <button
            className="bg-blue-200 p-3 hover:bg-blue-300"
            onClick={next}
            >{">"}</button>
          </div>}
        </div>
      }
      {myProfile && <NotificationList />}
    </div>
  )
}

export default Profile
