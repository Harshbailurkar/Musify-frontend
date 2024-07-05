import React from "react";
import { registerUser } from "../API/userAPI.js";
import { redirect, useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [loginData, setLoginData] = React.useState({
    username: "",
    email: "",
    fullName: "",
    password: "",
    avatar: "",
  });
  const [error, setError] = React.useState(null);
  const [status, setStatus] = React.useState("idle");
  const navigate = useNavigate();
  function handleSubmit(e) {
    e.preventDefault();
    setStatus("submitting");

    registerUser(loginData)
      .then((data) => {
        console.log(data);
        setStatus("idle");
        navigate("/");
      })
      .catch((error) => {
        setError(error.message);
        setStatus("idle");
      });
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div className="flex flex-col items-center self-center">
      <div className="items-center text-center mt-28">
        <h1 className="text-4xl font-bold pb-9">Register</h1>
        <p>Fill all the details</p>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col">
            <input
              type="text"
              className="border-2 p-2 m-2"
              placeholder="Username"
              onChange={handleChange}
              name="username"
              value={loginData.usernameOrEmail}
            />
            <input
              type="eamil"
              className="border-2 p-2 m-2"
              placeholder="Email"
              onChange={handleChange}
              name="email"
              value={loginData.usernameOrEmail}
            />
            <input
              type="text"
              className="border-2 p-2 m-2"
              placeholder="Full Name"
              onChange={handleChange}
              name="fullName"
              value={loginData.usernameOrEmail}
            />
            <input
              type="password"
              className="border-2 p-2 m-2"
              placeholder="Password"
              onChange={handleChange}
              name="password"
              value={loginData.password}
            />
            <input
              type="file"
              placeholder="chosese a profile picture"
              onChange={handleChange}
              name="avatar"
              value={loginData.avatar}
            />
            <button
              className="bg-blue-400 p-2 m-2 rounded"
              disabled={status === "submitting"}
            >
              {status === "submitting" ? "creating ..." : "create account"}
            </button>
          </div>
        </form>
        {error && <p className="text-red-500">{error}</p>}{" "}
        <h3 className="">already have an account? login Here</h3>
      </div>
    </div>
  );
}
