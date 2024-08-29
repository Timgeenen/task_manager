import { useForm, useFieldArray } from "react-hook-form";
import Textbox from "./Textbox";
import Optionbox from "./Optionbox";
import { TEAMS } from "../library/fakedata";
import SubmitButton from "./SubmitButton";
import Checkbox from "./Checkbox";
import AddButton from "./AddButton";
import { IoClose } from "react-icons/io5"; //TODO: add functionality to close the form field

//TODO: handle submit logic to post to database
//TODO: add local state for error handling when no team or team member is selected

function NewTask() {
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

  const addSubtask = (e) => {
    e.preventDefault();
  }

  const removeSubtask = (e) => {
    //TODO: add slice functionality to remove specific item
    e.preventDefault();
    console.log(e.target);
  }

  return (
    <div className="bg-gray-400 w-screen h-screen absolute top-0 left-0 z-50 bg-opacity-60 flex justify-center items-center">

      <form 
      className="flex flex-col gap-2"
      onSubmit={handleSubmit(data => {
        console.log(data)
        console.log(selectedTeam);
      })}>

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
