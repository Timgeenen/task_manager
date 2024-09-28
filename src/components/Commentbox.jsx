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

    const cleanData = {
      author: {
        name: user.name,
        id: user._id
      },
      message: DOMPurify.sanitize(data.message),
      socketId,
      socketType
    };

    if (cleanData.message.length > 0) {
      submitHandler(data)
    } else {
      console.log("please enter valid message");
    }

    reset();
  }

  return (
    <form 
    onSubmit={handleSubmit(submitFn)}
    className="p-2 border-2 rounded-full bg-white flex justify-center shadow-xl"
    >
      <input 
      type="text"
      placeholder="Type your message here..."
      required
      {...register("message")}
      className="focus:outline-none w-4/5"
      />
      <SubmitButton />
    </form>
  )
}

export default Commentbox
