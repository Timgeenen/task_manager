import { useState } from "react";
import AddButton from "./AddButton";
import Checkbox from "./Checkbox";
import { useForm, useFieldArray } from "react-hook-form";
import SubmitButton from "./SubmitButton";
import { IoClose } from "react-icons/io5";
import { useSelector } from "react-redux";
//TODO: disable fields if the task is marked as completed

function TaskEdit({
  teamId,
  taskId,
  description,
  subtasks,
  priority,
  status,
  refetch
}) {
  const { socket } = useSelector(state => state.auth);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { isDirty }
  } = useForm({
    defaultValues: {
      taskId,
      subtasks,
      priority,
      status,
      description,
      completed: false
    }
  });

  const {
    fields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "subtasks"
  })

  const [newSubtask, setNewSubtask] = useState("");
  const [subtasksArr, setSubtasksArr] = useState(subtasks);
  const [error, setError] = useState(null);
  const [submitError, setSubmitError] = useState(null);

  const addSubtask = (e) => {
    e.preventDefault();
    if (newSubtask === "") { return setError("please add description")};
    const newSubtaskObj = { name: newSubtask, completed: false };
    append(newSubtaskObj);
    setSubtasksArr([...subtasksArr, newSubtaskObj]);
    setNewSubtask("");
    document.getElementById("taskEdit__newSubtask").value = "";
  };

  const handleChange = (e) => {
    error && setError(null);
    setNewSubtask(e.target.value);
  };

  const submitHandler = (data) => {
    if (isDirty) {
      socket.emit("updateTask", data, (response) => {
        if (response.error) {
          return console.error(response.error.message);
        } else {
          console.log("SUCCESS")
          console.log(response)
          refetch();
        }
      })
    } else {
      setSubmitError("Please adjust the form before submitting");
    }
  }

  if (isDirty) { submitError && setSubmitError(null)};

  return (
    <div>
      <form
      className="flex gap-8 items-center"
      onSubmit={handleSubmit(submitHandler)}
      >
        <textarea 
        defaultValue={description}
        {...register("description")}
        className="w-full m-6 p-2 border-2 rounded-lg h-96 text-lg"
        ></textarea>
        <div>
          <div className="w-40 self-start m-6 ml-0 rounded-lg flex flex-col">
            {fields.map((field, i) => {
              const task = subtasksArr[i];
              task._id && setValue(`subtasks.${i}._id`, task._id);
              setValue(`subtasks.${i}.name`, task.name);
              return (
                <span
                key={field.id}
                className="relative border-2 p-1 rounded-lg">
                  <Checkbox
                  text={task.name}
                  checked={task.completed}
                  register={register(`subtasks.${i}.completed`)}
                  />
                  {!task._id && <IoClose
                  onClick={() => { remove(i)} }
                  size={24}
                  className="absolute -right-7 top-1.5 hover:cursor-pointer"
                  />}
                </span>
              )
            })}
            
            <input
            className="border-2"
            id="taskEdit__newSubtask"
            placeholder="Add description"
            onChange={handleChange}
            />
            {error && <span className="text-xs text-red-600">{error}</span>}
            <AddButton
            text="Add Subtask"
            handleClick={addSubtask}
            />
          </div>
          <div className="flex flex-col items-center">
          <Checkbox
          register={register("completed")}
          text="Complete Task"
          />
          <SubmitButton />
          {submitError && <div className="text-xs text-red-600 text-center">{submitError}</div>}
          </div>
        </div>
      </form>
    </div>
  )
}

export default TaskEdit
