import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import SubmitButton from "./SubmitButton";

function Commentbox({ socketId, submitHandler, socketType }) {
  const { user } = useSelector(state => state.auth);

  const {
    register,
    handleSubmit,
    reset
  } = useForm({
    defaultValues: {
      author: {
        name: user.name,
        id: user._id
      },
      socketId,
      socketType
    }
  });

  const submitFn = (data) => {
    submitHandler(data)
    reset()
  }

  return (
    <form 
    onSubmit={handleSubmit(submitFn)}
    className="p-2 border-2"
    >
      <input 
      type="text"
      placeholder="Type your message here..."
      required
      {...register("message")}
      />
      <SubmitButton />
    </form>
  )
}

export default Commentbox
