import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import Textbox from "../components/Textbox";
import SubmitButton from "../components/SubmitButton";
import Checkbox from "../components/Checkbox.jsx";
import { useMutation } from "@tanstack/react-query";
import { getTeamDataObj } from '../library/helperfunctions';
import { createNewTeam } from "../api/Event";
import { updateUser } from "../redux/state/authSlice.jsx";


function CreateTeam() {
  const { user, socket } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    reset,
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

  if (mutation.isError) { alert(mutation.error.message) };
  if (mutation.isSuccess) {
    socket.emit("createTeam", mutation.data.team)
    socket.emit("joinNewTeam", mutation.data.team._id);
    dispatch(updateUser(mutation.data.user));
  }

  return (
    <div className="w-full h-full flex justify-center items-center">
      {mutation.isLoading && <div>Loading...</div>}
      <form 
      className="flex flex-col"
      onSubmit={handleSubmit(createTeam)}>
        {mutation.isSuccess && 
        <div className="text-xs text-green-400">
          Succesfully created new team: {mutation.data.team.name}
        </div>}
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

export default CreateTeam
