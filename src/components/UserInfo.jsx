import { HiMagnifyingGlass } from "react-icons/hi2";
import { ellipsis } from "../library/styles";
import { getTimePassed } from "../library/helperfunctions";
import clsx from "clsx";
import { FaPlus } from "react-icons/fa";

function UserInfo({ name, email, role, isActive, lastOnline, userId, onClick, isFriend }) {
  return (
      <div
      key={userId}
      className="flex w-52 hover:bg-blue-400 border rounded-md shadow-lg p-2 overflow-auto">
        <div className="flex flex-col p-2 font-semibold">
          <span>Name</span>
          {isFriend && <span>Email</span>}
          <span>Role</span>
          <span>Active</span>
          <button onClick={onClick}>
            {isFriend
              ? <HiMagnifyingGlass size={20} />
              : <FaPlus />
            }
          </button>
        </div>
        <div className="flex flex-col p-2 w-36">
          <span className={ellipsis}>{name}</span>
          {isFriend && <span className={ellipsis}>{email}</span>}
          <span className={ellipsis}>{role}</span>
          {
            isActive ?
            <span className={clsx(ellipsis, "text-green-400 w-24")}>Online</span> :
            <span className={clsx(ellipsis, "text-gray-400 w-24")}>{
              getTimePassed(lastOnline)
            }</span>
          }
        </div>
      </div>
  )
}

export default UserInfo
