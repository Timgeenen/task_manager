import { BarChart, Tooltip, XAxis, YAxis, Bar, CartesianGrid, Cell } from "recharts";
import { countTasksByPriority } from "../library/helperfunctions";
import { useEffect, useState } from "react";

function TaskGraph({data}) {

  const [graphData, setGraphData] = useState([]);
  
  useEffect(() => {
    const newData = countTasksByPriority(data)
    setGraphData(newData);
  }, []);

  return (
    <BarChart width={700} height={300} data={graphData}>
      <CartesianGrid strokeDasharray="3 3"/>
      <XAxis dataKey="priority" color="red"/>
      <YAxis />
      <Tooltip />
      <Bar 
      dataKey="tasks">
        {graphData.map((item, i) => (
          <Cell key={`cell-${i}`} fill={item.color} />
        ))}
      </Bar>
    </BarChart>
  )
}

export default TaskGraph