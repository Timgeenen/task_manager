import { BarChart, Tooltip, XAxis, YAxis, Bar, CartesianGrid, Cell } from "recharts";
import { getGraphData } from "../library/helperfunctions";
import { useEffect, useState } from "react";

function TaskGraph({ data, selectedTeam }) {
  const [graphData, setGraphData] = useState([]);
  
  useEffect(() => {
    const selectedTasks = selectedTeam === "all" ?
    data : data.filter(task => task.assignedTeam.id === selectedTeam);
    const newData = getGraphData(selectedTasks)
    setGraphData(newData);
  }, [selectedTeam]);

  return (
    <BarChart width={300} height={300} data={graphData}>
      <CartesianGrid strokeDasharray="3 3"/>
      <XAxis dataKey="priority" color="red"/>
      <YAxis />
      <Tooltip content={<CustomTooltip />}/>
      <Bar 
      dataKey="tasks">
        {graphData?.map((item, i) => (
          <Cell key={`cell-${i}`} fill={item.color} />
        ))}
      </Bar>
    </BarChart>
  )
};

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length)
  {
    const { color, completed, inProgress, overDue, pending, tasks, thisWeek } = payload[0]?.payload;
    return (
    <div className="bg-slate-600 text-white p-4 flex flex-col rounded-xl">
      <div className="pb-4 text-center flex flex-col">
        <span className={`text-${color === "orange" ? "yellow" : color}-${color === "orange" ? "400" : "600"}`}>{label?.toUpperCase()}
        </span>
        <span>Priority Tasks</span>
      </div>
      <div className="flex justify-center">
        <div className="flex flex-col gap-1 w-28">
          <span>Total</span>
          <span className="h-px bg-slate-300 mt-1 mb-1"/>
          <span>Pending</span>
          <span>In Progress</span>
          <span>Completed</span>
          <span className="h-px bg-slate-300 mt-1 mb-1"/>
          <span>This Week</span>
          <span>Too Late</span>

        </div>
        <div className="flex flex-col gap-1">
          <span>{tasks}</span>
          <span className="h-px bg-slate-300 mt-1 mb-1"/>
          <span>{pending}</span>
          <span>{inProgress}</span>
          <span>{completed}</span>
          <span className="h-px bg-slate-300 mt-1 mb-1"/>
          <span>{thisWeek}</span>
          <span className={overDue > 0 && "text-red-600"}>{overDue}</span>

        </div>
      </div>
    </div>
  )}
}

export default TaskGraph