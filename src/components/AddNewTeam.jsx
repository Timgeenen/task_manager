import { IoClose } from "react-icons/io5"
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import Textbox from "./Textbox";
import SubmitButton from "./SubmitButton";


function AddNewTeam({handleClick}) {
  const { user } = useSelector(state => state.auth);
  const {
    register,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const submitHandler = (data) => {console.log(data)}

  const createTeam = () => {

  }

  return (
    <div className="w-screen h-screen absolute top-0 z-50 flex justify-center items-center bg-white opacity-50">
      <button onClick={handleClick}><IoClose size={24}/></button>
      <form onSubmit={handleSubmit(submitHandler)}>

        <Textbox
        label="Team Name"
        type="text"
        placeholder="add team name"
        register={register("name", {required: "Team Name Is Required!"})}
        error={errors.name ? errors.name.message : ""}
        />

        {user.connections.map((member) => (
          <Checkbox value={member.name} register={register("members")} id={member.id} />
        ))}
        <SubmitButton />
      </form>
    </div>
  )
}

export default AddNewTeam
