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
      <button
      key={memberId}
      style={{
        background: isManager ? "gold" : COLORS[index],
        color: isManager && "black",
      }}
      onClick={navigateToProfile}
      className="relative rounded-full p-1 w-9 h-9 -mr-4 text-sm font-semibold border-2 border-black text-white"
      >
        {initials}
        {isManager && <MdAdminPanelSettings size={16} className="absolute -bottom-1 -right-1"/>}
      </button>
  )
}

export default MembersTag
