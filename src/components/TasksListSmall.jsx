import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getHoursLeft, sortTasksByDeadline } from '../library/helperfunctions';
import clsx from 'clsx';

function TasksListSmall({ data }) {
  const navigate = useNavigate();
  const [sorted, setSorted] = useState([])

  useEffect(() => {
    setSorted(sortTasksByDeadline(data))
  }, [])

  return (
    <div
    className="w-full h-68"
    >
      <span className="grid grid-flow-col auto-cols-fr p-1 text-center border-2 rounded-full font-semibold bg-blue-400 mb-1">
        <span>Title</span>
        <span>Priority</span>
        <span>Status</span>
        <span>Deadline</span>
      </span>
      <div className="flex flex-col h-52 overflow-y-scroll gap-1 mt-1">
      {sorted.map((task, i) => {
        if (task.status === "completed") { return }
        const overdue = getHoursLeft(task.deadline) < 0;
        return (
        <button
        className={clsx("grid grid-flow-col auto-cols-fr mr-1 ml-1 rounded-full shadow-md p-1 hover:bg-blue-300", overdue && "border border-red-500")}
        onClick={() => navigate(`/task-info/${task.id}`)}
        key={i}
        >
          <span>{task.title}</span>
          <span 
          className={
            task.priority === "low" ?
            "text-green-500" :
            task.priority === "medium" ?
            "text-yellow-500" :
            "text-red-500"
          }>{task.priority}</span>
          <span>{task.status}</span>
          <span
          className={ overdue ? "text-red-600": "" }
          >{task.deadline.split("T")[0]}</span>
        </button>
      )})}
      </div>
    </div>
  )
}

export default TasksListSmall
