import clsx from "clsx"
import { AiOutlineUsergroupAdd } from "react-icons/ai"
import { IoClose, IoPersonAddOutline } from "react-icons/io5"
import { VscNewFile } from "react-icons/vsc"

function README({ handleClick, isOpen }) {
  return (
    <div
    className={clsx("w-screen h-screen z-50 bg-white bg-opacity-90 absolute flex items-center flex-col", !isOpen && "hidden")}>
      <button
      className="absolute top-8 left-8"
      onClick={handleClick}
      >
        <IoClose size={30}/>
      </button>
      <div className="max-w-80 flex flex-col gap-4 mt-24 overflow-y-scroll p-6 bg-blue-200 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold pb-4">Instructions</h3>
        <p className="inline text-sm">
          1) Click on the <IoPersonAddOutline className="inline ml-1 mr-2" size={16} />
          icon to add people to your connection list
        </p>
        <p className="text-xs ml-4 text-blue-600 -mt-4">
          *To test the functionality of the page, friend requests will be accepted automatically
        </p>
        <p className="inline text-sm items-center gap-2">
          2) Click on the <AiOutlineUsergroupAdd className="inline ml-1 mr-2" size={16} />
          icon to create a team
        </p>
        <p className="inline text-sm items-center gap-2">
          3) Click on the <VscNewFile className="inline ml-1 mr-2" size={16} />
          icon to create a new task
        </p>
        <p className="finline text-sm items-center gap-2">
          4) Use the sidebar to navigate to your task and start editing!
        </p>
        <p className="text-xs text-red-600">
          If you experience any bugs or unexpected behavior please send a ticket to:
          <br />
          <a
          className="font-semibold underline"
          href="mailto: geenencleaning@gmail.com"
          >geenencleaning@gmail.com</a>
        </p>
      </div>
    </div>
  )
}

export default README
