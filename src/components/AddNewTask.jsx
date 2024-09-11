import { MdAddTask } from "react-icons/md";
import { useNavigate } from "react-router-dom";


function AddNewTask() {
  const navigate = useNavigate();

  return (
    <>
      <button onClick={() => navigate("/create-task")}>
        <MdAddTask size="2em"/>
      </button>
    </>
  )
}

export default AddNewTask