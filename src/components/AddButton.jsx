import { FaPlus } from "react-icons/fa";

function AddButton({ text, handleClick, disabled }) {
  return (
    <button
    onClick={handleClick}
    disabled={disabled}
    className="border-2 flex justify-center items-center gap-2 p-1 rounded-md bg-blue-600 text-sm">
      <FaPlus className="text-gray-100"/><span className="text-gray-100">{text}</span>
    </button>
  )
}

export default AddButton
