import { IoClose } from "react-icons/io5"
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import Textbox from "./Textbox";
import SubmitButton from "./SubmitButton";
import Checkbox from "../components/Checkbox.jsx";
import { BACKEND } from "../library/constants.jsx";
import axios from "axios";
import { updateUser } from "../redux/state/authSlice.jsx";


function AddNewTeam({handleClick}) {
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const createTeam = (data) => {
    const assignedTo = user.connections.filter(item => data.members.includes(item.name));

    const manager = {
      name: user.name,
      role: user.role,
      email: user.email,
      id: user._id
    };

    const members = [...assignedTo, manager];

    const teamData = {
      name: data.name,
      manager: manager,
      members: members,
    }

    axios
      .post(BACKEND + "/createteam", teamData)
      .then(res => {
        dispatch(updateUser(user._id));
        console.log(user.teams)
        alert(res.data.message);
      })
      .catch(err => alert(err));
  }

  return (
    <div className="w-screen h-screen absolute top-0 z-50 flex justify-center items-center bg-white opacity-50">

      <button onClick={handleClick}>
        <IoClose size={24}/>
      </button>

      <form 
      className="flex flex-col"
      onSubmit={handleSubmit(createTeam)}>

        <Textbox
        label="Team Name"
        type="text"
        placeholder="add team name"
        register={register("name", {required: "Team Name Is Required!"})}
        error={errors.name ? errors.name.message : ""}
        />
        
        {user.connections.map((member) => (
              <Checkbox 
              value={member.name}
              register={register("members")}
              />
        ))}

        <SubmitButton />

      </form>

    </div>
  )
}

export default AddNewTeam
