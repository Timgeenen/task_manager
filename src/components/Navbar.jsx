import Notifications from "./Notifications";
import UserTag from "./UserTag";
import NavbarLink from "./NavbarLink";
import { IoPersonAddOutline } from "react-icons/io5";
import { VscNewFile } from "react-icons/vsc";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import clsx from "clsx";

function Navbar() {
  const linkSize = 30
  return (
    <div className="w-full flex items-center justify-center sm:justify-between bg-blue-100 p-3">
      <img
      className={clsx("hidden", "sm:block")}
      src="../../logoipsum-297.svg" />
      <div className="flex w-96 justify-between sm:gap-6 sm:w-auto">
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
