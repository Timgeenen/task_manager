import React from 'react'
import { useNavigate } from 'react-router-dom'

function TasksListSmall({ data }) {
  const navigate = useNavigate();

  return (
    <div
    className="w-full h-68"
    >
      <span className="grid grid-flow-col auto-cols-fr p-1 text-center border-2 rounded-full font-semibold">
        <span>Title</span>
        <span>Priority</span>
        <span>Status</span>
        <span>Deadline</span>
      </span>
      <div className="flex flex-col h-52 overflow-y-scroll gap-1 mt-1">
      {data.map((task, i) => (
        <button
        className="grid grid-flow-col auto-cols-fr mr-1 ml-1 rounded-full shadow-md p-1 hover:bg-blue-300"
        onClick={() => navigate(`/task-info/${task.id}`)}
        key={i}
        >
          <span>{task.title}</span>
          <span>{task.priority}</span>
          <span>{task.status}</span>
          <span>{task.deadline.split("T")[0]}</span>
        </button>
      ))}
      </div>
    </div>
  )
}

export default TasksListSmall
