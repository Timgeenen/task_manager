import { IoClose } from "react-icons/io5"
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import Textbox from "./Textbox";
import SubmitButton from "./SubmitButton";
import Checkbox from "../components/Checkbox.jsx";
import { BACKEND } from "../library/constants.jsx";
import axios from "axios";
import { updateUser } from "../redux/state/authSlice.jsx";
import { useMutation } from "@tanstack/react-query";
import { getTeamDataObj } from '../library/helperfunctions';
import { createNewTeam } from "../api/Event";


function AddNewTeam({handleClick}) {
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const mutation = useMutation({
    mutateKey: ["newTeam"],
    mutationFn: (teamData) => createNewTeam(teamData)
  })

  const createTeam = (data) => {
    const teamData = getTeamDataObj(data, user);
    mutation.mutateAsync(teamData)
  }

  return (
    <div className="w-screen h-screen absolute top-0 z-50 flex justify-center items-center bg-white opacity-50">
      {mutation.isLoading && <div>LOADING...</div>}
      {mutation.isError && <div>{mutation.error.message}</div>}
      {mutation.isSuccess && <div>SUCCESS</div>}
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
              text={member.name}
              register={register("members")}
              />
        ))}

        <SubmitButton />

      </form>

    </div>
  )
}

export default AddNewTeam
