import { useState } from "react";
import AddButton from "./AddButton";
import Checkbox from "./Checkbox";
import { useForm, useFieldArray } from "react-hook-form";
import SubmitButton from "./SubmitButton";
import { IoClose } from "react-icons/io5";
import { useSelector } from "react-redux";
import DOMPurify from "dompurify";
import clsx from "clsx";
import { errorMessage } from "../library/styles";

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
      teamId,
      taskId,
      subtasks,
      priority,
      status,
      description,
      completed: status === "completed" ? true : false
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
  const [isCompleted, setIsCompleted] = useState(status === "completed" ? true : false);

  const addSubtask = (e) => {
    e.preventDefault();
    const cleanSubtask = DOMPurify.sanitize(newSubtask);
    if (cleanSubtask === "") { return setError("please add description")};
    const newSubtaskObj = { name: cleanSubtask, completed: false };
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
      data.description = DOMPurify.sanitize(data.description);

      socket.emit("updateTask", data, (response) => {
        if (response.error) {
          return console.error(response.error.message);
        } else {
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
      {isCompleted && <div className="text-center pt-5 text-3xl font-semibold text-green-500">Completed!</div>}
      <form
      className="flex gap-8 items-center"
      onSubmit={handleSubmit(submitHandler)}
      >
        <textarea 
        defaultValue={description}
        {...register("description")}
        disabled={isCompleted}
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
                  disabled={isCompleted}
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
            disabled={isCompleted}
            onChange={handleChange}
            />
            {error && <span className={errorMessage}>{error}</span>}
            <AddButton
            text="Add Subtask"
            disabled={isCompleted}
            handleClick={addSubtask}
            />
          </div>
          <div className="flex flex-col items-center">
          <Checkbox
          register={register("completed")}
          text="Complete Task"
          disabled={isCompleted}
          />
          <SubmitButton
          disabled={isCompleted}
          />
          {submitError && <div className={clsx("text-center", errorMessage)}>{submitError}</div>}
          </div>
        </div>
      </form>
    </div>
  )
}

export default TaskEdit
