import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import Textbox from "../components/Textbox";
import SubmitButton from "../components/SubmitButton";
import Checkbox from "../components/Checkbox.jsx";
import { getTeamDataObj } from '../library/helperfunctions';
import { useState } from "react";
import { updateUser } from "../redux/state/authSlice.jsx";
import { useSocket } from "../context/SocketProvider.jsx";
import DOMPurify from "dompurify";

function CreateTeam() {
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  const socket = useSocket();

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors }
  } = useForm();

  const [newTeam, setNewTeam] = useState(null);

  const createTeam = (data) => {
    data.name = DOMPurify.sanitize(data.name);
    if (!data.name) {
      reset();
      return setError("name", { type: "custom", message: "Please enter valid team name" });
    }
    newTeam && setNewTeam(null);
    const teamData = getTeamDataObj(data, user);
    socket.emit("createTeam", teamData, (response) => {
      if (response.error) {
        const { error } = response;
        return setError("name", {type: "custom", message: error.message});
      } else {
        dispatch(updateUser(response.user));
        setNewTeam(data.name);
      }
      reset();
    });
  }

  return (
    <div className="w-full h-full flex flex-col">
      {newTeam && <div className=" self-center text-xs text-green-400 mt-2">
          Succesfully created new team: {newTeam}</div>}
      <form 
      className="flex flex-col mt-10 w-2/3 min-w-72 max-w-xl m-auto items-center p-2 rounded-xl shadow-lg bg-blue-300"
      onSubmit={handleSubmit(createTeam)}>
        <div className="p-4">
          <Textbox
          label="Team Name"
          type="text"
          placeholder="add team name"
          register={register("name", {required: "Team Name Is Required!"})}
          error={errors.name ? errors.name.message : ""}
          />
        </div>
        <div className="flex ml-auto mr-auto p-2 flex-wrap flex-grow-0 flex-shrink-0 gap-2 w-5/6">
        {user.connections.map((member) => (
          <Checkbox
          value={member.name}
          text={member.name}
          register={register("members")}
          />
        ))}
        </div>

        <div className="p-4">
        <SubmitButton />
        </div>

      </form>

    </div>
  )
}

export default CreateTeam
