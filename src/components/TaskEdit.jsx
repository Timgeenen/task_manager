import { useState } from "react";
import AddButton from "./AddButton";
import Checkbox from "./Checkbox";
import { useForm, useFieldArray } from "react-hook-form";
import SubmitButton from "./SubmitButton";
import { IoClose } from "react-icons/io5";
import DOMPurify from "dompurify";
import clsx from "clsx";
import { errorMessage } from "../library/styles";
import { useSocket } from "../context/SocketProvider";
import { QueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import MembersTag from "./MembersTag";

function TaskEdit({
  teamId,
  taskId,
  description,
  subtasks,
  priority,
  status,
  workingOnTask,
  teamMembers,
  managerId
}) {

  const socket = useSocket();
  const queryClient = new QueryClient();

  const { user } = useSelector(state => state.auth);

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
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [canEdit, setCanEdit] = useState(workingOnTask.includes(user._id) || managerId === user._id);

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

  const setActiveWorker = (e) => {
    e.preventDefault();
    socket.emit("startWorkingOnTask", taskId, ((response) => {
      if (response.error) {
        console.log(response.error.message);
      } else {
        !canEdit && setCanEdit(true);
        queryClient.setQueryData([`task-${taskId}`], response);
      }
    }))
  }

  const handleChange = (e) => {
    error && setError(null);
    setNewSubtask(e.target.value);
  };

  const submitHandler = (data) => {
    if (isDirty) {
      data.description = DOMPurify.sanitize(data.description);
      setUpdateSuccess(false);

      socket.emit("updateTask", data, (response) => {
        if (response.error) {
          return console.error(response.error.message);
        } else {
          setUpdateSuccess(true);
          queryClient.setQueryData([`task-${taskId}`], response);
        }
      })
    } else {
      setSubmitError("Please adjust the form before submitting");
    }
  }

  if (isDirty) { submitError && setSubmitError(null)};

  return (
    <div>
      {updateSuccess && <div className="text-xs text-green-500 text-center">Succesfully updated task</div>}
      {isCompleted && <div className="text-center pt-5 text-3xl font-semibold text-green-500">Completed!</div>}
      <div className="flex items-center">
        <button
        className={clsx("ml-6 mt-2 p-1 pl-3 pr-3 border font-medium rounded-md text-nowrap bg-blue-600 text-white", (canEdit || isCompleted) && "bg-gray-300")}
        onClick={setActiveWorker}
        disabled={canEdit}
        >
          Start working on task
        </button>
        <div className="flex ml-8 items-center w-full">
          <span className="font-medium mr-2">Active Workers</span>
          {teamMembers.filter(member => workingOnTask.includes(member.id)).map((member, i) => (
            <MembersTag
            member={member.name}
            index={i}
            memberId={member.id}
            isManager={member.id === managerId}
            />
          ))}
        </div>
      </div>
      <form
      className="flex gap-8"
      onSubmit={handleSubmit(submitHandler)}
      disabled={isCompleted || !canEdit}
      >
      <div className="w-full">
        <textarea 
        defaultValue={description}
        {...register("description")}
        disabled={isCompleted || !canEdit}
        className="w-full m-6 mt-2 p-2 border-2 rounded-lg h-96 text-lg"
        ></textarea>
        <div className="flex items-center justify-center">
          <Checkbox
          register={register("completed")}
          text="Complete Task"
          disabled={isCompleted || !canEdit}
          />
          <SubmitButton
          disabled={isCompleted || !canEdit}
          />
        </div>
        {submitError && <div className={clsx("text-center", errorMessage)}>{submitError}</div>}
        </div>
        <div>
          <div className="h-96 overflow-y-scroll w-44 mr-6 mt-2 p-1 rounded-lg flex flex-col gap-1 mb-4 border">
            {fields.map((field, i) => {
              const task = subtasksArr[i];
              task._id && setValue(`subtasks.${i}._id`, task._id);
              setValue(`subtasks.${i}.name`, task.name);
              return (
                <span
                key={field.id}
                className="relative border-2 p-1 rounded-lg flex">
                  <Checkbox
                  text={task.name}
                  checked={task.completed}
                  disabled={isCompleted || !canEdit}
                  register={register(`subtasks.${i}.completed`)}
                  />
                  {!task._id && <IoClose
                  onClick={() => { remove(i)} }
                  size={24}
                  className="hover:cursor-pointer"
                  />}
                </span>
              )
            })}
          </div>
          <div className="w-44 flex flex-col">
            <input
            className="rounded-md border mb-1"
            id="taskEdit__newSubtask"
            placeholder="Add description"
            disabled={isCompleted || !canEdit}
            onChange={handleChange}
            />
            {error && <span className={errorMessage}>{error}</span>}
            <AddButton
            text="Add Subtask"
            disabled={isCompleted || !canEdit}
            handleClick={addSubtask}
            />
          </div>
        </div>
      </form>
    </div>
  )
}

export default TaskEdit
