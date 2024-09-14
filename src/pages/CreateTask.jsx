import { useFieldArray, useForm } from "react-hook-form";
import { IoClose } from "react-icons/io5";
import AddButton from "../components/AddButton";
import Checkbox from "../components/Checkbox";
import Optionbox from "../components/Optionbox";
import SubmitButton from "../components/SubmitButton";
import Textbox from "../components/Textbox";
import { useSelector } from "react-redux";
import "react-datepicker/dist/react-datepicker.css";
import DateSelect from "../components/DateSelect";
import { useState } from "react";

function CreateTask() {
  const { user, socket } = useSelector(state => state.auth);
  const [newTask, setNewTask] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    watch,
    reset,
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

    setIsLoading(true);
    setNewTask(null);
    
    const team = user.teams.find(item => item.id === selectedTeam);
    const teamObj = {
      name: team.name,
      id: team.id
    };
    const assignedTo = team.members.filter(item => formData.members.includes(item.id));

    formData.members = assignedTo;
    formData.team = teamObj;
    formData.user = user.name;

    socket.emit("createTask", formData, (response) => {
      if (response.error) {
        const { error } = response
        return console.error(`Creating task failed.\nError message: ${error.message}.\nStatus:${error.status}`);
      } else {
        console.log(response.message);
        setNewTask(formData.title);
        reset();
      }
      setIsLoading(false);
    });
  }

  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      {isLoading && <div>Loading...</div>}
      {newTask && <div className="text-green-400 text-xs p-4">Succesfully created new task: {newTask}</div>}
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
        defaultText="--Select Team"
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
            className="absolute -right-7 top-1.5 hover:cursor-pointer"
            />
          </span>
        ))}

        <DateSelect
        text="Deadline"
        name="deadline"
        minDate={new Date()}
        control={control}
        defaultValue={new Date()}
        />
        
        <label>Priority</label>
        <select {...register("priority")}>
          {["low", "medium", "high"].map(priority => (
            <option value={priority}>{priority}</option>
          ))}
        </select>
        
        <AddButton 
        text="Add Subtask"
        handleClick={(e) => {
          e.preventDefault();
          append({ name: ''});
        }}
        />

        <SubmitButton
        disabled={isLoading}
        />
      </form>
    </div>
  )
}

export default CreateTask
