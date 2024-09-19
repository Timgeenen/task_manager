import { FaArrowRight } from "react-icons/fa";
import MembersTag from "../components/MembersTag";
import { memo } from "react";
import { useNavigate } from "react-router-dom";


function TeamTagSmall({ name, managerName, managerId, memberCount, index, teamId}) {
  const navigate = useNavigate();

  return (
    <div
    className="flex gap-2 w-40 shadow-md p-2 rounded-xl bg-white hover:bg-blue-300 border-2"
    key={index}
    >
      <div className="flex h-24 w-24 flex-col gap-2 justify-between text-sm">
        <span className="font-semibold text-base whitespace-nowrap overflow-ellipsis overflow-hidden">{name}</span>
        <span>Manager:</span>
        <span>Members:</span>
      </div>
      <div className="flex h-24 flex-col justify-between pr-4">
        <button
        onClick={() => navigate(`/team-info/${teamId}`)}
        ><FaArrowRight size={20}/></button>
        <MembersTag
        member={managerName}
        memberId={managerId}
        isManager={true}
        />
        <span>{memberCount}</span>
      </div>
    </div>
  )
}

export default memo(TeamTagSmall)
