import { useParams } from "react-router-dom"

function Profile() {
  const { userId} = useParams();
  console.log(userId)
  return (
    <div>
      Profile
    </div>
  )
}

export default Profile
