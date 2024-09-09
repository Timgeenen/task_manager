import Checkbox from "./Checkbox";

function TaskEdit({
  teamId,
  taskId,
  description,
  subtasks,
  priority,
  status
}) {
  console.log(subtasks)
  return (
    <div>
      <div className="flex gap-8 items-center">
        <textarea 
        value={description}
        className="w-full m-6 p-2 border-2 rounded-lg h-96 text-lg"
        ></textarea>
        <div className="w-40 border-2 self-start m-6 ml-0 p-2 rounded-lg">
          {subtasks.map((task, i) => (
            <Checkbox
            value={task._id}
            text={task.name}
            checked={task.completed}
            />
          ))}
        </div>
      </div>
      <div>
        <button
        className="border-2 w-40 p-2 rounded-lg font-semibold m-6 mt-0"
        onClick={() => console.log("updated")}
        >UPDATE TASK
        </button>
      </div>
    </div>
  )
}

export default TaskEdit
