import { useFieldArray, useForm } from "react-hook-form";
import { IoClose } from "react-icons/io5";
import AddButton from "../components/AddButton";
import Checkbox from "../components/Checkbox";
import Optionbox from "../components/Optionbox";
import SubmitButton from "../components/SubmitButton";
import Textbox from "../components/Textbox";
import { useSelector } from "react-redux";
import DateSelect from "../components/DateSelect";
import { useState } from "react";
import { useSocket } from "../context/SocketProvider";
import DOMPurify from "dompurify";
import { errorMessage } from "../library/styles";
import { useQueryClient } from "@tanstack/react-query";

function CreateTask() {
  const { user } = useSelector(state => state.auth);
  const [newTask, setNewTask] = useState(null);

  const socket = useSocket();

  const {
    register,
    control,
    handleSubmit,
    setError,
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
  const queryClient = useQueryClient();

  const submitHandler = (formData) => {
    if (formData.team === "") { 
      return setError("team", {type: "custom", message: "Please select a team"})
    };
    if (!formData.members) {
      return setError("members", {type: "custom", message: "Please select at least 1 team member"})
    };

    formData.title = DOMPurify.sanitize(formData.title);
    formData.description = DOMPurify.sanitize(formData.description);
    formData.subtasks = formData.subtasks.map(item => {
      return { name: DOMPurify.sanitize(item.name) }
    });

    const emptySubtask = formData.subtasks.includes(item => !item.name);
    const noTitle = !formData.title;
    const noDescription = !formData.description;

    if (noTitle || noDescription || emptySubtask) {
      if (noTitle) {
        setError("title", { type: "custom", message: "Please enter a valid title" });
      }
      if (noDescription) {
        setError("description", { type: "custom", message: "Please set a valid description" });
      }
      if (emptySubtask) {
        setError("subtasks", { type: "custom", message: "Please set a valid description" });
      }
      return;
    }

    setNewTask(null);
    
    const team = user.teams.find(item => item.id === selectedTeam);

    const teamObj = {
      name: team.name,
      managerId: team.managerId,
      id: team.id
    };
    const assignedTo = team.members.filter(item => formData.members.includes(item.id));

    formData.members = assignedTo;
    formData.team = teamObj;
    formData.user = user.name;

    
    socket.emit("createTask", formData, (response) => {
      if (response.error) {
        const { error } = response;
        console.log(error.errors)
        if (error.errors) {
          for (var key in error.errors) {
            if (error.errors.hasOwnProperty(key)) {
              setError(key, { type: "custom", message: error.errors[key].message});
            }
          }
        };
        return console.error(`Creating task failed.\nError message: ${error.message}.\nStatus:${error.status}`);
      } else {
        queryClient.setQueryData(["tasks"], (prevData) => [...prevData, response])
        setNewTask(formData.title);
        reset();
      }
    });
  }

  return (
    <div className="w-full h-full flex flex-col pt-10 pb-8 items-center overflow-y-scroll">
      {newTask && <div className="text-green-400 text-xs p-4">Succesfully created new task: {newTask}</div>}
      <form 
      className="flex flex-col gap-4 p-8 rounded-lg bg-blue-300 w-3/4 min-w-72 max-w-xl"
      onSubmit={handleSubmit(submitHandler)}
      >

        <Textbox
        label="Title"
        type="text"
        placeholder="Add Title"
        register={register("title", {required: "Title Is Required"})}
        error={errors.title ? errors.title.message : ""}
        />
        <div className="flex flex-wrap gap-4 justify-between">
          <Optionbox 
          options={user?.teams?.filter(team => team.managerId === user._id)}
          register={register("team")}
          defaultText="--Select Team"
          defaultValue=""
          classes="bg-white"
          />
          <DateSelect
          text="Deadline"
          name="deadline"
          minDate={new Date()}
          control={control}
          defaultValue={new Date()}
          classes="bg-white"
          />

          <Optionbox
          options={["low", "medium", "high"]}
          register={register("priority")}
          classes="bg-white"
          />
        </div>
        {errors.team && <p className={errorMessage}>{errors.team.message}</p>}

        <div className="flex flex-wrap">
        {
          user.teams.map((team) => (
            team.id === selectedTeam &&
            team.members.map((member) => {
              if (member.id === user._id) { return }
              return (
                <Checkbox 
                value={member.id}
                text={member.name}
                register={register("members")}
                />
              )
            })
          ))
        }
        </div>
        {errors.members && <p className={errorMessage}>{errors.members.message}</p>}

        <textarea 
        type="text"
        placeholder="Add Task Description"
        className="shadow-lg p-1 pl-2 pr-2 rounded-md text-sm"
        {...register("description", {required: "Description is required"})}
        />
        {errors.description && <p className={errorMessage}>{errors.description.message}</p>}

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
        {errors.subtasks && <p className={errorMessage}>{errors.subtasks.message}</p>}
        
        <AddButton 
        text="Add Subtask"
        handleClick={(e) => {
          e.preventDefault();
          append({ name: ''});
        }}
        />

        <div className="flex justify-center p-2 pt-4">
          <SubmitButton />
        </div>
      </form>
    </div>
  )
}

export default CreateTask
