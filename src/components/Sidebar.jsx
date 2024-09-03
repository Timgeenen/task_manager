import SidebarLink from "./SidebarLink"
import { AiOutlineDashboard } from "react-icons/ai";
import { MdTaskAlt } from "react-icons/md";
import { BsPeople } from "react-icons/bs";
import { LiaTrashAltSolid } from "react-icons/lia";
import { GrGroup } from "react-icons/gr";
import { IoClose } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { setOpenSidebar } from "../redux/state/authSlice";
//TODO: remove links for non-admin?

function Sidebar() {
  const iconSize = 24
  const links = [
    {
      text: "Dashboard",
      target: "/dashboard",
      icon: <AiOutlineDashboard size={iconSize} />
    }, {
      text: "Tasks",
      target: "/tasks",
      icon: <MdTaskAlt size={iconSize} />
    }, {
      text: "Teams",
      target: "/teams",
      icon: <GrGroup size={iconSize} />
    }, {
      text: "Connections",
      target: "/connections",
      icon: <BsPeople size={iconSize} />
    }, {
      text: "Trash",
      target: "/trash",
      icon: <LiaTrashAltSolid size={iconSize} />
    }
  ];

  const { isSidebarOpen } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const closeSidebar = () => {
    isSidebarOpen && dispatch(setOpenSidebar(false));
  }

  return (
    <div className="w-1/5 bg-slate-300 h-screen flex flex-col ">
      <IoClose size={24} className="m-2 ml-1 hover:cursor-pointer" onClick={closeSidebar}/>
      {
        links.map((item, i) => (
          <SidebarLink 
          text={item.text}
          target={item.target}
          icon={item.icon}
          />
        ))
      }
    </div>
  )
}

export default Sidebar
