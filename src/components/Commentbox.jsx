import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import SubmitButton from "./SubmitButton";
import DOMPurify from "dompurify";

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
   data.message = DOMPurify.sanitize(data.message);

    if (data.message.length > 0) {
      submitHandler(data)
    }

    reset();
  }

  return (
    <form 
    onSubmit={handleSubmit(submitFn)}
    className="p-1 ml-1 mr-1 border-2 rounded-full bg-white flex justify-center shadow-xl"
    >
      <input 
      type="text"
      placeholder="Type your message here..."
      {...register("message")}
      className="text-sm sm:text-md focus:outline-none w-4/5"
      />
      <SubmitButton />
    </form>
  )
}

export default Commentbox
