import Countup from "./Countup"
import { tasks } from "../library/fakedata";
//TODO: use real data to display stats
//TODO: add functionality to organize current tasks on clicking field
//TODO: add tooltip on hovering task to show more info

const taskStyle = "text-nowrap overflow-hidden p-1 border-2 border-gray-300 border-black"
const titleStyle = "pt-1"

function Stats() {
  let status = [
    {
      status: "completed",
      count: 0
    }, {
      status: "in progress",
      count: 0
    }, {
      status: "pending",
      count: 0
    }
  ];
  let total = 0;

  tasks.filter((task) => {
    if (task.status === "completed") { status[0].count += 1 };
    if (task.status === "in progress") { 
      status[1].count += 1;
      total += 1;
    };
    if (task.status === "pending") { 
      status[2].count += 1 
      total += 1;
    };
  })

  console.log(status)
  return (
    <div className="w-4/5 flex h-52">
      <div className="w-2/5 border-t-2 border-b-2 border-slate-300">
        {
          status.map((item) => (
            <Countup
            actual={item.count}
            total={item.status === "completed" ? item.count : total}
            parameter={item.status}
            radius={20}
            />
          ))
        }
      </div>
      <div className="w-3/5 overflow-y-scroll">
        <div className="grid grid-cols-4 text-center font-semibold sticky bg-slate-300">
          <span className={titleStyle}>Title</span>
          <span className={titleStyle}>Deadline</span>
          <span className={titleStyle}>Priority</span>
          <span className={titleStyle}>Status</span>
        </div>
        {
          tasks.map((item, i) => (
            item.status !== "completed" &&
            <div className="text-center grid grid-cols-4 font-semibold sticky bg-slate-100">
              <span className={taskStyle}>{item.title}</span>
              <span className={taskStyle}>{item.deadline}</span>
              <span 
              className={taskStyle} 
              style={{
                color:
                item.priority === "high" ?
                "red" :
                item.priority === "medium" ?
                "orange" :
                "green"
              }}>{item.priority}</span>
              <span className={taskStyle}>{item.status}</span>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default Stats
