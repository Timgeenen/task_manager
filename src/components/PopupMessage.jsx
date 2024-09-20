import clsx from "clsx";

function PopupMessage({ open, toggleOpen, message, proceed }) {
  return (
    <div
    className={clsx("w-full h-full absolute bg-white bg-opacity-70 top-0 left-0 flex justify-center items-center", !open && "hidden")}
    >
      <div className=" w-60 p-2 border-2 text-center rounded-lg bg-blue-100">
        <text>{message}</text>
        <div className="flex mt-4 p-2 justify-between">
          <button
          className="w-20 bg-red-600 text-white rounded-full"
          onClick={toggleOpen}
          >
            Cancel
            </button>
          <button
          className="w-20 bg-blue-600 text-white rounded-full"
          onClick={() => {
            proceed();
            toggleOpen();
          }}
          >
            Proceed
          </button>
        </div>
      </div>
    </div>
  )
}

export default PopupMessage
