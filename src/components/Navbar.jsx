import Notifications from "./Notifications";
import AddNewTask from "./AddNewTask";

function Navbar() {
  return (
    <div className="w-full flex items-center justify-between bg-slate-200 fixed p-2">
      <img src="./logoipsum-297.svg" />
      <div className="flex gap-3">
        <AddNewTask />
        <Notifications />
        {/*  */}
      </div>
    </div>
  )
}

export default Navbar
