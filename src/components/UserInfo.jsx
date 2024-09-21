import { HiMagnifyingGlass } from "react-icons/hi2";
import { ellipsis, gridCols } from "../library/styles";
import { getTimePassed } from "../library/helperfunctions";
import clsx from "clsx";
import { FaPlus } from "react-icons/fa";

function UserInfo({ name, email, role, isActive, lastOnline, userId, onClick, isFriend }) {
  return (
     <span
     key={userId}
     className="flex hover:bg-blue-300 border-2 bg-blue-50 rounded-full shadow-lg pl-2 pr-2">
        <div className={clsx(gridCols, "text-lg text-start w-full border-r-0 p-2")}>
          <span className={ellipsis}>{name}</span>
          {isFriend && <span className={ellipsis}>{email}</span>}
          <span className={ellipsis}>{role}</span>
        </div>
        <span className={"rounded-full flex space-between w-1/4"}>
          {
            isActive ?
            <span className={clsx(ellipsis, "text-green-400 w-24 p-2")}>Online</span> :
            <span className={clsx(ellipsis, "text-gray-400 w-24 p-2")}>{
              getTimePassed(lastOnline)
            }</span>
          }
            <button
            className="p-2"
            onClick={onClick}
            >
              {isFriend
              ? <HiMagnifyingGlass size={24} />
              : <FaPlus />
              }
            </button>
        </span>
      </span>
  )
}

export default UserInfo
