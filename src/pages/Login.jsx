import { useForm } from "react-hook-form";
import { Navigate } from "react-router-dom";
import Textbox from "../components/Textbox";
import SubmitButton from "../components/SubmitButton";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../redux/state/authSlice";
import { useMutation } from "@tanstack/react-query";
import { createUser, authenticateUser } from "../api/Event";
import useToggle from "../hooks/useToggle";

function Login() {
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const { 
    register, 
    handleSubmit,
    setError,
    reset,
    formState: { errors }
   } = useForm({
    defaultValues: {
      email: "",
      password: "",
      name: "",
      role: ""
    }
   });

  const [isOpen, toggle] = useToggle();

  const loginMutation = useMutation({
    mutationKey: ["login"],
    mutationFn: (userData) => authenticateUser(userData)
  });

  const registerMutation = useMutation({
    mutationKey: ["register"],
    mutationFn: (userData) => createUser(userData)
  });

  const loginUser = (data) => {
    loginMutation.mutate(data);
    if (loginMutation.isError) {
      setError("password", {
        type: "custom",
        message: loginMutation.error.response?.data?.message || loginMutation.error.message
      })
    };
    loginMutation.isSuccess && dispatch(login(loginMutation.data));
  }

  const registerUser = (data) => {
    if (data.password !== data.verifyPassword) {
      return setError("password", {
        type: "custom",
        message: "passwords don't match"
      })
    }
    registerMutation.mutate(data);
    if (registerMutation.isError) {
      setError("email", {
        type: "custom",
        message: registerMutation.error.response?.data?.message || registerMutation.error.message
      })
    }
    if (registerMutation.isSuccess) {
      reset();
      toggle();
    }
  }
 
  return user 
  ? ( <Navigate to="/dashboard" replace /> ) 
  : (
    <div className="w-screen h-screen flex flex-col justify-center gap-20 items-center">
      <h1 className="text-5xl font-bold text-blue-600">Welcome Back!</h1>
      <form 
      className="flex flex-col justify-center gap-4 border p-8 rounded-md"
      onSubmit={handleSubmit(isOpen ? registerUser : loginUser)}>
        <h3 className="text-xl font-medium text-blue-600">{isOpen ? "Register" : "Login"}</h3>
        {registerMutation.isSuccess && <div className="text-xs text-green-400">succesfully registered new account</div>}
        <Textbox 
        label="Email Adress"
        type="email"
        placeholder="enter email"
        register={register("email", {required: "Email Adress Is Required!"})}
        error={errors.email ? errors.email.message : ""} />

        <Textbox 
        label="Password"
        type="password"
        placeholder="enter password"
        register={register("password", {required: "Password Is Required!"})}
        error={errors.password ? errors.password.message : ""} />

        <Textbox 
        label="Verify Password"
        type="password"
        placeholder="verify password"
        register={register("verifyPassword", {required: "Please Verify Password"})}
        />

        { isOpen && 
        <>
          <Textbox
          label="Name"
          type="text"
          placeholder="enter full name"
          register={register("name", { required: "Name Is Required!"})}
          error={errors.name ? errors.name.message: ""} />
          
          <Textbox
          label="Role"
          type="text"
          placeholder="enter role"
          register={register("role", { required: "Role Is Required!"})}
          error={errors.role ? errors.role.message: ""} />
        </>
        }

        <SubmitButton />
        {isOpen ? (
        <span>Already registered? <button className="text-blue-600" onClick={toggle}>Login</button>
        </span>
        ) : (
        <span>new user? <button className="text-blue-600" onClick={toggle}>Register</button>
        </span>
        )}
      </form>
    </div>
  )
}

export default Login
