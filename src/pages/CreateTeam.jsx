import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import Textbox from "../components/Textbox";
import SubmitButton from "../components/SubmitButton";
import Checkbox from "../components/Checkbox.jsx";
import { getTeamDataObj } from '../library/helperfunctions';
import { useState } from "react";


function CreateTeam() {
  const { user, socket } = useSelector(state => state.auth);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();

  const [newTeam, setNewTeam] = useState(null);

  const createTeam = async (data) => {
    const teamData = getTeamDataObj(data, user);
    await socket.emit("createTeam", teamData);
    setNewTeam(data.name);
    reset();
  }

  return (
    <div className="w-full h-full flex justify-center items-center">
      <form 
      className="flex flex-col"
      onSubmit={handleSubmit(createTeam)}>
        {newTeam && 
        <div className="text-xs text-green-400">
          Succesfully created new team: {newTeam}
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
