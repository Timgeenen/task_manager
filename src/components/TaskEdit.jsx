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
import useToggle from "../hooks/useToggle";
import PopupMessage from "./PopupMessage";

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
  const [open, toggleOpen] = useToggle();

  const {
    register,
    control,
    handleSubmit,
    setValue,
    reset,
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
  const [activeWorkers, setActiveWorkers] = useState(teamMembers.filter(member => workingOnTask.includes(member.id)))

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

  const addActiveWorker = (e) => {
    e.preventDefault();
    socket.emit("startWorkingOnTask", taskId, ((response) => {
      if (response.error) {
        console.error(response.error.message);
      } else {
        !canEdit && setCanEdit(true);
        const newWorker = {name: user.name, id: user._id};
        setActiveWorkers([...activeWorkers, newWorker]);
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
          const updatedFormData = {
            teamId,
            taskId,
            subtasks: response.subtasks,
            priority,
            status: response.status,
            description: response.description,
            completed: response.status === "completed" ? true : false
          }
          reset(updatedFormData)
        }
      })
    } else {
      setSubmitError("Please adjust the form before submitting");
    }
  }

  const deleteTask = () => {
    socket.emit("deleteTask", taskId, ((response) => {
      if (response.error) {
        console.error(response.error.message);
      } else {
        console.log(response)
      }
    }))
  }

  if (isDirty) { submitError && setSubmitError(null)};

  return (
    <div>
      {updateSuccess && <div className="text-xs text-green-500 text-center">Succesfully updated task</div>}
      {isCompleted && <div className="text-center pt-5 text-xl sm:text-3xl font-semibold text-green-500">Completed!</div>}
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center">
        <button
        className={clsx("sm:ml-6 mt-1 sm:mt-2 p-1 sm:pl-3 sm:pr-3 border text-sm sm:text-md font-medium rounded-md text-nowrap bg-blue-600 text-white", (canEdit || isCompleted) && "bg-gray-300")}
        onClick={addActiveWorker}
        disabled={canEdit}
        >
          Start working on task
        </button>
        <div className="flex sm:ml-8 items-center h-8 w-full">
          <span className="text-xs sm:text-md font-medium mr-2">Active Workers</span>
          {activeWorkers.map((member, i) => (
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
      className="flex flex-col sm:gap-8"
      onSubmit={handleSubmit(submitHandler)}
      disabled={isCompleted || !canEdit}
      >
      <div className="flex flex-col sm:flex-row">
      <div className="w-full sm:flex">
        <textarea 
        defaultValue={description}
        {...register("description")}
        disabled={isCompleted || !canEdit}
        className="w-full sm:w-full sm:m-6 mt-1 sm:mt-2 p-2 border-2 rounded-lg h-40 sm:h-96 text-sm md:text-md"
        ></textarea>

        {submitError && <div className={clsx("text-center", errorMessage)}>{submitError}</div>}
        </div>
        <div>
          <div className="max-h-40 sm:max-h-96 sm:w-44 sm:mr-6 mt-2 p-1 rounded-lg flex flex-col gap-1 mb-4 border">
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
          <div className="w-full sm:w-44 flex flex-col">
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
        </div>
        <div className="flex flex-col pt-3 pb-3 gap-1 sm:gap-2 sm:flex-row items-center justify-center">
          <Checkbox
          register={register("completed")}
          text="Complete Task"
          disabled={isCompleted || !canEdit}
          />
          <div className="flex justify-around w-full">
          <SubmitButton
          disabled={isCompleted || !canEdit}
          />
          {
            managerId === user._id &&
            <>
              <button
              className="bg-red-600 rounded-full p-1 pl-5 pr-5 text-white text-nowrap"
              onClick={toggleOpen}
              >Delete Task
              </button>
              <PopupMessage
              open={open}
              toggleOpen={toggleOpen}
              proceed={deleteTask}
              message={`Are you sure you want to delete this task?`}
              />
            </>
          }
          </div>
        </div>
      </form>
    </div>
  )
}

export default TaskEdit
