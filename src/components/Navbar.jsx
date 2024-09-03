import Notifications from "./Notifications";
import AddNewTask from "./AddNewTask";
import UserTag from "./UserTag";
import AddNewConnection from "./AddNewConnection";

function Navbar() {
  return (
    <div className="w-full flex items-center justify-between bg-slate-200 sticky p-2">
      <img src="./logoipsum-297.svg" />
      <div className="flex gap-3">
        <AddNewConnection />
        <AddNewTask />
        <Notifications />
        <UserTag />
      </div>
    </div>
  )
}

export default Navbar
