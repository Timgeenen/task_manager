import { useEffect, useState } from "react";
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css'; 
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/state/authSlice";
import { getInitials } from "../library/helperfunctions";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../api/Event";

function UserTag() {
  const { user } = useSelector(state => state.auth);
  const [initials, setInitials] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let userInitials = getInitials(user.name);
    setInitials(userInitials);
  }, [user]);


  const [visible, setVisible] = useState(false);
  const show = () => setVisible(true);
  const hide = () => setVisible(false);

  const dispatch = useDispatch();

  const handleClick = async () => {
    logoutUser();
    dispatch(logout());
  };

  const navigateProfile = () => {
    navigate(`/profile/${user._id}`)
  };

  return (
    <Tippy
      appendTo={document.body}
      content={
        <div className="flex flex-col p-2 gap-2">
          <UserLink name="Profile" handleClick={navigateProfile}/>
          <UserLink name="Logout" handleClick={handleClick}/>
        </div>
      }
      onClickOutside={() => {
        visible && setVisible(false);
      }}
      interactive={true}
      visible={visible}>
      <button 
      className="bg-blue-600 rounded-full font-bold text-xl text-white p-3"
      onClick={visible ? hide : show}
      >
        {initials}
      </button>
    </Tippy>
  )
}

function UserLink({ name, handleClick }) {
  return (
    <>
    <button onClick={handleClick}>
      {name}
    </button>
    </>
  )
}

export default UserTag
