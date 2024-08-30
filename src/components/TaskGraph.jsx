import { BarChart, Legend, Tooltip, XAxis, YAxis, Bar, CartesianGrid, Cell } from "recharts";
import { tasks } from "../library/fakedata";
//TODO: change fake to real data
//TODO: switch between teams to show data per team
//TODO: change general color for bars
//TODO: make chart responsive

function TaskGraph() {
  let data = [
    {
      priority: "high",
      tasks: 0,
      color: "red"
    }, {
      priority: "medium",
      tasks: 0,
      color: "orange"
    }, {
      priority: "low",
      tasks: 0,
      color: "green"
    }
  ]

  tasks.filter((task) => {
    if (task.priority === "high") { return data[0].tasks += 1 }
    if (task.priority === "medium") { return data[1].tasks += 1 }
    if (task.priority === "low") { return data[2].tasks += 1 }
  })

  return (
    <BarChart width={700} height={300} data={data}>
      <CartesianGrid strokeDasharray="3 3"/>
      <XAxis dataKey="priority" color="red"/>
      <YAxis />
      <Tooltip />
      <Bar 
      dataKey="tasks">
        {data.map((item, i) => (
          <Cell key={`cell-${i}`} fill={item.color} />
        ))}
      </Bar>
    </BarChart>
  )
}

export default TaskGraph