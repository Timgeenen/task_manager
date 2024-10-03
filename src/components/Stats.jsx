import Countup from "./Countup"
import { countTasksByStatus, sortTasksByDeadline } from "../library/helperfunctions";
import { useEffect, useState } from "react";
import TasksListSmall from "./TasksListSmall";

const taskStyle = "text-nowrap overflow-hidden p-1 border-2 border-gray-300 border-black"
const titleStyle = "pt-1"

function Stats({data}) {

  const [statusData, setStatusData] = useState([]);

  useEffect(() => {
    sortTasksByDeadline(data);
    const currentData = countTasksByStatus(data);
    setStatusData(currentData);
  }, []);

  return (
    <div className="w-4/5">
      
      <div className="w-full flex justify-around border-t-2 border-b-2 border-slate-300">
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
      
      <TasksListSmall
      data={data}
      />
    </div>
  )
}

export default Stats
