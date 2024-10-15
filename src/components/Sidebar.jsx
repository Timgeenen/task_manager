import SidebarLink from "./SidebarLink"
import { AiOutlineDashboard } from "react-icons/ai";
import { MdTaskAlt } from "react-icons/md";
import { BsPeople } from "react-icons/bs";
import { GrGroup } from "react-icons/gr";
import { IoClose } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { setOpenSidebar } from "../redux/state/authSlice";

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
    }
  ];

  const { isSidebarOpen } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const closeSidebar = () => {
    isSidebarOpen && dispatch(setOpenSidebar(false));
  }

  return (
    <div className="bg-blue-100 absolute z-50 inline-block h-full pl-2 pr-6">
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
