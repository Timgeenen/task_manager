import { useFieldArray, useForm } from "react-hook-form";
import { IoClose } from "react-icons/io5";
import AddButton from "./AddButton";
import Checkbox from "./Checkbox";
import Optionbox from "./Optionbox";
import SubmitButton from "./SubmitButton";
import Textbox from "./Textbox";
import { useSelector } from "react-redux";
import "react-datepicker/dist/react-datepicker.css";
import DateSelect from "./DateSelect";
import { useMutation } from "@tanstack/react-query";
import { createNewTask } from "../api/Event";

function NewTask({ close }) {
  const { user } = useSelector(state => state.auth);
  const { isError, isSuccess, mutateAsync, error, data } = useMutation({
    mutationKey: ["create-task"],
    mutationFn: (data) => createNewTask(data)
  });

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
  });

  const selectedTeam = watch("team");

  const submitHandler = (formData) => {
    if (formData.team === "") { return alert("please select a valid team")};
    if (formData.members.length === 0) {return alert("please make sure to select at least 1 team member")};

    const team = user.teams.find(item => item.id === selectedTeam);
    const teamObj = {
      name: team.name,
      id: team.id
    };
    const assignedTo = team.members.filter(item => formData.members.includes(item.id));
    formData.members = assignedTo;
    formData.team = teamObj;

    mutateAsync(formData);
  }

  if (isError) { alert(error.message) };
  if (isSuccess) { alert(data.message)};

  return (
    <div className="bg-white w-screen h-screen absolute top-0 left-0 z-50 bg-opacity-80 flex justify-center items-center">

      <button className="absolute top-20 right-20" onClick={close}>
        <IoClose size="2em" />
      </button>

      <form 
      className="flex flex-col gap-2"
      onSubmit={handleSubmit(submitHandler)}
      >

        <Textbox
        label="Title"
        type="text"
        placeholder="add title"
        register={register("title", {required: "Title Is Required"})}
        error={errors.title ? errors.title.message : ""}
        />

        <Optionbox 
        options={user.teams}
        register={register("team")}
        />

        {
          user.teams.map((team) => (
            team.id === selectedTeam &&
            team.members.map((member) => (
              <Checkbox 
              value={member.id}
              text={member.name}

              register={register("members")}
              />
            ))
          ))
        }

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
            <IoClose 
            onClick={() => { remove(i) }}
            size={24}
            className="absolute right-1 top-1.5 hover:cursor-pointer"
            />
          </span>
        ))}

        <DateSelect
        text="Deadline"
        control={control}
        />
        
        <label>Priority</label>
        <select {...register("priority")}>
          {["low", "medium", "high"].map(priority => (
            <option value={priority}>{priority}</option>
          ))}
        </select>
        
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
