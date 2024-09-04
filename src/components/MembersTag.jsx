import { useNavigate } from "react-router-dom";
import { COLORS } from "../library/constants";
import { getInitials } from "../library/helperfunctions";

function MembersTag({ member, index }) {
  const initials = getInitials(member.name);
  const navigate = useNavigate();
  const navigateToProfile = () => {
    //TODO: add navigate route to profile
    console.log(`navigated to ${member.name}'s profile`);
  };
  return (
    <>
      <button 
      style={{background: COLORS[index]}}
      onClick={navigateToProfile}
      className="rounded-full p-1 w-9 h-9 -mr-4 text-sm font-semibold border-2 border-black text-white"
      >
        {initials}
      </button>
    </>
  )
}

export default MembersTag
