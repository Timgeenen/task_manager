import Countup from "./Countup"
import { tasks } from "../library/fakedata";
import { countTasksByStatus } from "../library/helperfunctions";
import { useEffect, useState } from "react";

//TODO: use real data to display stats
//TODO: add functionality to organize current tasks on clicking field
//TODO: add tooltip on hovering task to show more info

const taskStyle = "text-nowrap overflow-hidden p-1 border-2 border-gray-300 border-black"
const titleStyle = "pt-1"

function Stats({data}) {

  const [statusData, setStatusData] = useState([]);

  useEffect(() => {
    const currentData = countTasksByStatus(data);
    setStatusData(currentData);
  }, []);

  return (
    <div className="w-4/5 flex h-52">
      
      <div className="w-2/5 border-t-2 border-b-2 border-slate-300">
        {
          statusData.map((item) => (
            <Countup
            actual={item.count}
            total={
              item.status === "completed"
              ? item.count
              : data.length}
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
          data.map((item, i) => (
            item.status !== "completed" &&
            <div
            key={`task-${i}`}
            className="text-center grid grid-cols-4 font-semibold sticky bg-slate-100">
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
