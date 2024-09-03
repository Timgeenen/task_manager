import { useNavigate } from "react-router-dom";
import { IoPersonAddOutline } from "react-icons/io5";

function AddNewConnection() {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/find-connections");
  }
  return (
    <button onClick={handleClick}>
      <IoPersonAddOutline size={24}/>
    </button>
  )
}

export default AddNewConnection
