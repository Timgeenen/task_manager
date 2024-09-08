import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import SubmitButton from "./SubmitButton";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { commentOnTask } from "../api/Event";

function Commentbox({ taskId }) {
  const { user } = useSelector(state => state.auth);
  const queryClient = useQueryClient();

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
      taskId
    }
  });

  const { isPending, isError, isSuccess, error, data, mutateAsync } = useMutation({
    mutationKey: [`comment-${taskId}`],
    mutationFn: (comment) => commentOnTask(comment)
  });

  const submitHandler = (data) => {
    mutateAsync(data);
  };

  if (isSuccess) { 
    queryClient.setQueryData([`task-${taskId}`], data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)}>
      <input 
      type="text"
      placeholder="Type your message here..."
      {...register("message")}
      />
      <SubmitButton />
    </form>
  )
}

export default Commentbox
