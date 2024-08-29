import { useForm } from "react-hook-form";
import Textbox from "./Textbox";

function NewTask() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  return (
    <div className="bg-gray-400 w-screen h-screen absolute top-0 left-0 z-50 bg-opacity-60 flex justify-center items-center">
      <form>
        <Textbox
        label="Title"
        type="title"
        placeholder="add title"
        register={register("title", {required: "Title Is Required"})}
        error={errors.title ? errors.title.message : ""} />
      </form>
    </div>
  )
}

export default NewTask
