import { useSelector } from "react-redux"


function Connections() {
  const { user } = useSelector(state => state.auth);

  return (
    <div className="w-full p-2">
      {
        user.connections.map(item => (
          <div className="w-full flex justify-between border-2 border-slate-400 p-2">
            <span>{item.name}</span>
            <span>{item.email}</span>
            <span>{item.role}</span>
          </div>
        ))
      }
    </div>
  )
}

export default Connections
