import { useState } from "react";
import { useForm } from "react-hook-form";
import { Navigate } from "react-router-dom";
import Textbox from "../components/Textbox";
import SubmitButton from "../components/SubmitButton";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../redux/state/authSlice";
import { useMutation } from "@tanstack/react-query";
import { createUser, authenticateUser } from "../api/Event";

function Login() {
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const { 
    register, 
    handleSubmit,
    formState: { errors }
   } = useForm();
   const [registerForm, setRegisterForm] = useState(false);

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
    loginMutation.isError && alert(loginMutation.error.message);
    loginMutation.isSuccess && dispatch(login(loginMutation.data));
  }

  const registerUser = (data) => {
    registerMutation.mutate(data);
    registerMutation.isError && alert(loginMutation.error.message);
    registerMutation.isSuccess && dispatch(login(registerMutation.data));
  }

  const toggleForm = (e) => {
    e.preventDefault();
    setRegisterForm(!registerForm);
  }
 
  return user 
  ? ( <Navigate to="/dashboard" replace /> ) 
  : (
    <div className="w-screen h-screen flex flex-col justify-center gap-20 items-center">
      <h1 className="text-5xl font-bold text-blue-600">Welcome Back!</h1>
      <form 
      className="flex flex-col justify-center gap-4 border p-8 rounded-md"
      onSubmit={handleSubmit(registerForm ? registerUser : loginUser)}>
        <h3 className="text-xl font-medium text-blue-600">{registerForm ? "Register" : "Login"}</h3>
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

        { registerForm && 
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
        {registerForm ? (
        <span>Already registered? <button className="text-blue-600" onClick={toggleForm}>Login</button>
        </span>
        ) : (
        <span>new user? <button className="text-blue-600" onClick={toggleForm}>Register</button>
        </span>
        )}
      </form>
    </div>
  )
}

export default Login
