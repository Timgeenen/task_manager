import { forwardRef, useEffect, useState } from "react";
import { user } from "../library/fakedata";
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css'; 
//TODO: use real user
//TODO: customize tippy styling
//TODO: add link to profile page in tippy
//TODO: add logout functionality

function UserTag() {
  const [initials, setInitials] = useState("");

  const getInitials = (name) => {
    let names = name.split(" ");
    let firstLetter = names[0].charAt(0);
    let lastLetter = names[names.length - 1].charAt(0);
    return (firstLetter + lastLetter).toUpperCase();
  } 

  useEffect(() => {
    let userInitials = getInitials(user.name);
    setInitials(userInitials);
  }, [user]);


  const [visible, setVisible] = useState(false);
  const show = () => setVisible(true);
  const hide = () => setVisible(false);


  const logoutUser = () => {
    console.log("user logged out");
  };

  const navigateProfile = () => {
    console.log("navigate to profile");
  };

  return (
    <Tippy
      content={
        <div className="flex flex-col p-2 gap-2">
          <UserLink name="Profile" handleClick={navigateProfile}/>
          <UserLink name="Logout" handleClick={logoutUser}/>
        </div>
      }
      onClickOutside={() => {
        visible && setVisible(false);
      }}
      interactive={true}
      visible={visible}>
      <button 
      className="bg-blue-600 rounded-full font-bold text-xl text-white p-2"
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
