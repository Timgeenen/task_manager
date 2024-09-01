import { useFieldArray, useForm } from "react-hook-form";
import { IoClose } from "react-icons/io5";
import { TEAMS } from "../library/fakedata";
import AddButton from "./AddButton";
import Checkbox from "./Checkbox";
import Optionbox from "./Optionbox";
import SubmitButton from "./SubmitButton";
import Textbox from "./Textbox";
import axios from "axios";
import { BACKEND } from "../library/constants";

//TODO: handle submit logic to post to database
//TODO: add local state for error handling when no team or team member is selected

function NewTask({ close }) {
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: {
      subtasks: [{ name: "" }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "subtasks"
  })

  const selectedTeam = watch("team");

  const submitHandler = (data) => {
    axios.post(BACKEND + "/createtask", data)
      .then(res => console.log(res.data))
      .catch(err => console.log(err))
    // axios.post("/api", data)
    //   .then(() => console.log("post successful"))
    //   .catch(err => console.log(err));
  }

  return (
    <div className="bg-white w-screen h-screen absolute top-0 left-0 z-50 bg-opacity-80 flex justify-center items-center">

      <button className="absolute top-20 right-20" onClick={close}>
        <IoClose size="2em" />
      </button>

      <form 
      className="flex flex-col gap-2"
      onSubmit={handleSubmit(submitHandler)}>

        <Textbox
        label="Title"
        type="text"
        placeholder="add title"
        register={register("title", {required: "Title Is Required"})}
        error={errors.title ? errors.title.message : ""} />

        <Optionbox 
        options={TEAMS}
        register={register("team")}/>

        {
          TEAMS.map((item) => (
            item.title === selectedTeam &&
            item.members.map((member) => (
              <Checkbox value={member} register={register("members")} />
            ))
          ))
        }
        {/* { teamMembers?.length < 1 && <span className="text-xs text-red-600">Select at least 1 team member</span>} */}

        <textarea 
        type="text"
        placeholder="add task description"
        {...register("description", {required: "Description is required"})}
        />

        {fields.map((item, i) => (
          <span key={item.id} className="relative">
            <Textbox
            type="text"
            placeholder="Add Subtask"
            register={register(`subtasks.${i}.name`)}
            />
            <IoClose onClick={() => { remove(i) }} size={24} className="absolute right-1 top-1.5 hover:cursor-pointer"/>
          </span>
        ))}
        <AddButton 
        text="Add Subtask"
        handleClick={() => append({ name: ''})}
        />

        <SubmitButton />
      </form>
    </div>
  )
}

export default NewTask
