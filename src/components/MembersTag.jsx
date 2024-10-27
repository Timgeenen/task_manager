import { useNavigate } from "react-router-dom";
import { COLORS } from "../library/constants";
import { getInitials } from "../library/helperfunctions";
import { MdAdminPanelSettings } from "react-icons/md";


function MembersTag({ member, index, memberId, isManager }) {
  const initials = getInitials(member);
  const navigate = useNavigate();
  const navigateToProfile = () => {
    navigate(`/profile/${memberId}`)
  };
  return (
    <div className="relative inline-block w-7 h-7 -mr-4 md:w-9 md:h-9">
      <button
      key={memberId}
      style={{
        background: isManager ? "gold" : COLORS[index],
        color: isManager && "black",
      }}
      onClick={navigateToProfile}
      className="rounded-full w-7 h-7 p-1 md:w-9 md:h-9 text-xs md:text-sm font-semibold border-2 text-nowrap overflow-clip border-black text-white"
      >
        {initials}
      </button>
      {isManager && <MdAdminPanelSettings size={16} className="absolute -bottom-1 -right-0"/>}
    </div>
  )
}

export default MembersTag
