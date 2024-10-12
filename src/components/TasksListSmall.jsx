import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getHoursLeft, sortTasksByDeadline } from '../library/helperfunctions';
import clsx from 'clsx';
import useToggle from "../hooks/useToggle";
import { ellipsis } from "../library/styles";

function TasksListSmall({ data, selectedTeam }) {
  const navigate = useNavigate();
  const [sorted, setSorted] = useState([])
  const [showCompleted, toggle] = useToggle();

  useEffect(() => {
    if (selectedTeam) {
      const selectedTasks = selectedTeam === "all" ?
      data : data.filter(task => task.assignedTeam.id === selectedTeam);
      setSorted(sortTasksByDeadline(selectedTasks))
    } else {
      setSorted(data)
    }
  }, [selectedTeam])

  return (
    <div
    className="w-full max-h-68"
    >
      <span className="grid grid-flow-col auto-cols-fr p-1 text-center border-2 text-sm sm:text-md rounded-full font-semibold bg-blue-400 mb-1">
        <span>Title</span>
        <span>Priority</span>
        <span>Status</span>
        <span>Deadline</span>
      </span>
      <div className="flex flex-col text-sm sm:text-md max-h-48 overflow-y-scroll gap-1 mt-1 mb-4 pb-2">
      {sorted.map((task, i) => {
        if (!showCompleted && task.status === "completed") { return }
        const overdue = getHoursLeft(task.deadline) < 0;
        return (
        <button
        className={clsx("grid grid-flow-col auto-cols-fr mr-1 ml-1 rounded-full shadow-md p-1 hover:bg-blue-300", overdue && "border border-red-500", task.status === "completed" && "bg-green-400")}
        onClick={() => navigate(`/task-info/${task.id ? task.id : task._id}`)}
        key={i}
        >
          <span className={ellipsis}>{task.title}</span>
          <span 
          className={
            task.priority === "low" ?
            "text-green-500" :
            task.priority === "medium" ?
            "text-yellow-500" :
            "text-red-500"
          }>{task.priority}</span>
          <span className={ellipsis}>{task.status}</span>
          <span
          className={clsx(ellipsis, overdue && "text-red-600")}
          >{task.deadline.split("T")[0]}</span>
        </button>
      )})}
      </div>
      <button
      className="p-1 pl-3 pr-3 mb-1 bg-blue-600 rounded-md text-white"
      onClick={toggle}>
        {showCompleted ? "Hide Completed": "Show Completed"}
      </button>
    </div>
  )
}

export default TasksListSmall
