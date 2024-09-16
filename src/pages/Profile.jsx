import { useSelector } from "react-redux";
import { useParams } from "react-router-dom"
import NotificationList from "../components/NotificationList";

function Profile() {
  const { userId} = useParams();
  const { user } = useSelector(state => state.auth);
  const myProfile = user._id === userId;

  return (
    <div>
      Profile
      {myProfile && <NotificationList />}
    </div>
  )
}

export default Profile
