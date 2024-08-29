import { useState } from "react";
import { useForm } from "react-hook-form";
import Textbox from "../components/Textbox";
import { Navigate } from "react-router-dom";
import { user } from "../library/fakedata";//TODO: change to fetch user from authSlice
import SubmitButton from "../components/SubmitButton";

function Login() {
  const { 
    register, 
    handleSubmit,
    formState: { errors }
   } = useForm();
  const [data, setData] = useState("");
  //TODO: update handle submit to handle login logic
 
  return user ? ( <Navigate to="/dashboard" replace /> ) : (
    <div className="w-screen h-screen flex flex-col justify-center gap-20 items-center">
      <h1 className="text-5xl font-bold text-blue-600">Welcome Back!</h1>
      <form 
      className="flex flex-col justify-center gap-4 border p-8 rounded-md"
      onSubmit={handleSubmit((data) => console.log(data))}>
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

        <SubmitButton />
      </form>

      {/* forgot password */}
      {/* register new user */}
    </div>
  )
}

export default Login
