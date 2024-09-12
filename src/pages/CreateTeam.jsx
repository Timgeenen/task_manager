import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import Textbox from "../components/Textbox";
import SubmitButton from "../components/SubmitButton";
import Checkbox from "../components/Checkbox.jsx";
import { getTeamDataObj } from '../library/helperfunctions';
import { useState } from "react";
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

  const [newTeam, setNewTeam] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const createTeam = (data) => {
    setIsLoading(true);
    newTeam && setNewTeam(null);
    const teamData = getTeamDataObj(data, user);
    socket.emit("createTeam", teamData, (response) => {
      if (response.error) {
        const { error } = response;
        return console.error(`Creating task failed.\nError message: ${error.message}.\nStatus:${error.status}`);
      } else {
        dispatch(updateUser(response.user));
        setNewTeam(data.name);
        reset();
      }
      setIsLoading(false);
    });
  }

  return (
    <div className="w-full h-full flex justify-center items-center">
      <form 
      className="flex flex-col"
      onSubmit={handleSubmit(createTeam)}>
        {isLoading && <div>Loading...</div>}
        {newTeam && <div className="text-xs text-green-400">
          Succesfully created new team: {newTeam}</div>}
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
