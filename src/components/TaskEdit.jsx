import { useState } from "react";
import AddButton from "./AddButton";
import Checkbox from "./Checkbox";
import { useForm, useFieldArray } from "react-hook-form";
import SubmitButton from "./SubmitButton";
import { IoClose } from "react-icons/io5";

function TaskEdit({
  teamId,
  taskId,
  description,
  subtasks,
  priority,
  status
}) {

  const {
    register,
    control,
    handleSubmit,
    setValue
  } = useForm({
    defaultValues: {
      subtasks: [{ name: "" }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "subtasks"
  })

  const [newSubtask, setNewSubtask] = useState("");
  const [subtasksArr, setSubtasksArr] = useState(subtasks);
  const [error, setError] = useState(null);

  const addSubtask = (e) => {
    e.preventDefault();
    if (newSubtask === "") { return setError("please add description")}
    const newSubtaskObj = { name: newSubtask, completed: false };
    append(newSubtaskObj);
    setSubtasksArr([...subtasksArr, newSubtaskObj]);
    document.getElementById("taskEdit__newSubtask").value = "";
  };

  const handleChange = (e) => {
    error && setError(null);
    setNewSubtask(e.target.value);
  };

  const submitHandler = (data) => {
    console.log(data);
  }

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
        <div className="w-40 border-2 self-start m-6 ml-0 p-2 rounded-lg flex flex-col">
          {fields.map((field, i) => {
            const task = subtasksArr[i];
            setValue(`subtasks.${i}.name`, task.name)
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
          onChange={handleChange}
          />
          {error && <span className="text-xs text-red-600">{error}</span>}
          <AddButton
          text="Add Subtask"
          handleClick={addSubtask}
          />
        </div>
        <SubmitButton />
      </form>
    </div>
  )
}

export default TaskEdit
