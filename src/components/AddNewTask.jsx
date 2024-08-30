import { useState } from "react";
import { MdAddTask } from "react-icons/md";
import NewTask from "./NewTask";


function AddNewTask() {
  const [addTaskIsOpen, setAddTaskIsOpen] = useState(false);
  const handleClick = () => {
    setAddTaskIsOpen(!addTaskIsOpen);
  }

  return (
    <>
      <button onClick={handleClick}>
        <MdAddTask size="2em"/>
      </button>
      {addTaskIsOpen && <NewTask close={handleClick}/>}
    </>
  )
}

export default AddNewTask
