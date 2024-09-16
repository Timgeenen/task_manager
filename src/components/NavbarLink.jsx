import { useNavigate } from "react-router-dom"

function NavLink({ icon, path }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(path)
  }
  return (
    <button
    onClick={handleClick}
    >
      {icon}
    </button>
  )
}

export default NavLink
