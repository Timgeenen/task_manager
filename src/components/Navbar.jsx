import Notifications from "./Notifications";
import UserTag from "./UserTag";
import NavbarLink from "./NavbarLink";
import { IoPersonAddOutline } from "react-icons/io5";
import { VscNewFile } from "react-icons/vsc";
import { AiOutlineUsergroupAdd } from "react-icons/ai";


function Navbar() {
  const linkSize = 30
  return (
    <div className="w-full flex items-center justify-between bg-blue-100 p-2">
      <img src="../../logoipsum-297.svg" />
      <div className="flex gap-6">
        <NavbarLink
        icon={<VscNewFile size={linkSize} />}
        path="/create-task"
        />
        <NavbarLink
        icon={<AiOutlineUsergroupAdd size={linkSize}/>}
        path="/create-team"
        />
        <NavbarLink
        icon={<IoPersonAddOutline size={linkSize} />}
        path="/find-connections"
        />
        <Notifications />
        <UserTag />
      </div>
    </div>
  )
}

export default Navbar
