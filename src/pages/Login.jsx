import { useState } from "react";
import { useForm } from "react-hook-form";
import { Navigate } from "react-router-dom";
import Textbox from "../components/Textbox";
// import { user } from "../library/fakedata";//TODO: change to fetch user from authSlice
import SubmitButton from "../components/SubmitButton";

function Login() {
  const user = null //TODO: REMOVE AND REPLACE
  const { 
    register, 
    handleSubmit,
    formState: { errors }
   } = useForm();
   const [registerForm, setRegisterForm] = useState(false);
  //TODO: update handle submit to handle login logic
  //TODO: set submithandler to login or register based on state

  const loginUser = (data) => {
    
  }

  const registerUser = (data) => {

  }
 
  return user ? ( <Navigate to="/dashboard" replace /> ) : (
    <div className="w-screen h-screen flex flex-col justify-center gap-20 items-center">
      <h1 className="text-5xl font-bold text-blue-600">Welcome Back!</h1>
      <form 
      className="flex flex-col justify-center gap-4 border p-8 rounded-md"
      onSubmit={handleSubmit((data) => console.log(data))}>
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
        <span>Already registered? <button className="text-blue-600" onClick={(e) => {
          e.preventDefault();
          setRegisterForm(false);
          }}>Login</button>
        </span>
        ) : (
        <span>new user? <button className="text-blue-600" onClick={(e) => {
              e.preventDefault();
              setRegisterForm(true);
            }}>Register</button>
        </span>
        )}
      </form>
    </div>
  )
}

export default Login
