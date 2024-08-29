import Notifications from "./Notifications"


function Navbar() {

  return (
    <div className="w-full flex items-center justify-between bg-slate-200 fixed p-2">
      <img src="./logoipsum-297.svg" />
      <div>
        <button>L1</button>
        <button>L1</button>
        <Notifications />
        {/*  */}
      </div>
    </div>
  )
}

export default Navbar
