import React from "react";
import { registerUser } from "../API/userAPI.js";
import { useNavigate, NavLink } from "react-router-dom";
import Logo from "../assets/images/Logo.svg";

export default function RegisterPage() {
  const [registerData, setRegisterData] = React.useState({
    username: "",
    email: "",
    fullName: "",
    password: "",
  });
  const [error, setError] = React.useState(null);
  const [status, setStatus] = React.useState("idle");
  const navigate = useNavigate();

  localStorage.setItem("loggedIn", false);
  function validateInput() {
    const { username, password } = registerData;
    const usernameRegex = /^[a-zA-Z0-9_]+$/;

    if (password.length < 6) {
      return "Password must be greater than 6 characters.";
    }
    if (!usernameRegex.test(username)) {
      return "Username must not contain spaces or special characters.";
    }
    return null;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const validationError = validateInput();
    if (validationError) {
      setError(validationError);
      return;
    }
    setStatus("submitting");

    registerUser(registerData)
      .then((data) => {
        console.log(data);
        setStatus("idle");
        navigate("/");
        window.location.reload();
      })
      .catch((error) => {
        setError(error.message);
        setStatus("idle");
      });
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRegisterData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setError(null);
  };

  return (
    <div className="flex flex-col items-center self-center text-white">
      <div className="items-center text-center mt-5">
        <div className="w-auto">
          <img src={Logo} alt="Musify" className="w-full" />
        </div>
        <h1 className="text-4xl font-bold pb-9">Register</h1>
        <p>Fill all the details</p>
        {error && <p className="text-red-500 w-52">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col">
            <input
              type="text"
              className="border-2 p-2 m-2 border-slate-800 rounded-lg bg-transparent"
              placeholder="Username"
              onChange={handleChange}
              name="username"
              value={registerData.username}
            />
            <input
              type="email"
              className="border-2 p-2 m-2 border-slate-800 rounded-lg bg-transparent"
              placeholder="Email"
              onChange={handleChange}
              name="email"
              value={registerData.email}
            />
            <input
              type="text"
              className="border-2 p-2 m-2 border-slate-800 rounded-lg bg-transparent"
              placeholder="Full Name"
              onChange={handleChange}
              name="fullName"
              value={registerData.fullName}
            />
            <input
              type="password"
              className="border-2 p-2 m-2 border-slate-800 rounded-lg bg-transparent"
              placeholder="Password"
              onChange={handleChange}
              name="password"
              value={registerData.password}
            />
            <button
              className="bg-blue-400 p-2 m-2 rounded text-black"
              disabled={status === "submitting"}
            >
              {status === "submitting" ? "Creating ..." : "Create Account"}
            </button>
            <h1 className="mb-1">or</h1>
            <button type="button" class="login-with-google-btn">
              Continue with Google
            </button>
          </div>
        </form>

        <h3 className="mt-2">
          Already have an account?{" "}
          <NavLink to="/login" className="text-blue-600">
            Login
          </NavLink>{" "}
          here
        </h3>
      </div>
    </div>
  );
}
