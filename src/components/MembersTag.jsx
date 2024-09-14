import { useNavigate } from "react-router-dom";
import { COLORS } from "../library/constants";
import { getInitials } from "../library/helperfunctions";

function MembersTag({ member, index, memberId }) {
  const initials = getInitials(member);
  const navigate = useNavigate();
  const navigateToProfile = () => {
    navigate(`/profile/${memberId}`)
  };
  return (
      <button
      key={memberId}
      style={{background: COLORS[index]}}
      onClick={navigateToProfile}
      className="rounded-full p-1 w-9 h-9 -mr-4 text-sm font-semibold border-2 border-black text-white"
      >
        {initials}
      </button>
  )
}

export default MembersTag
