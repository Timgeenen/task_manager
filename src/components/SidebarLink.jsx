import { useNavigate } from "react-router-dom"

function SidebarLink({ text, icon, target }) {
  
  const navigate = useNavigate();
  const handleNavigate = () => {
    navigate(target);
  }
  return (
    <button 
    className="flex gap-2 items-center text-lg font-medium p-1 border-1 border-slate-400"
    onClick={handleNavigate}>
      {icon}
      {text}
    </button>
  )
}

export default SidebarLink
