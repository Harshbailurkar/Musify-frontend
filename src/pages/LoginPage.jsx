import React from "react";
import { loginUser, SignInWithGoogle } from "../API/userAPI.js";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import Logo from "../assets/images/Logo.svg";

export default function LoginPage() {
  const [loginData, setLoginData] = React.useState({
    usernameOremail: "",
    password: "",
  });
  const [error, setError] = React.useState(null);
  const [status, setStatus] = React.useState("idle");
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    setStatus("submitting");
    console.log(loginData);
    loginUser(loginData)
      .then((data) => {
        setStatus("idle");
        const RedirectTo = sessionStorage.getItem("redirectAfterLogin") || "/";
        sessionStorage.removeItem("redirectAfterLogin");
        navigate(RedirectTo);
        window.location.reload();
        localStorage.setItem("isAuthenticated", true);
      })
      .catch((error) => {
        localStorage.setItem("loggedIn", false);
        setError(error.message || "Login failed");
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
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log(result);
      const token = await result.user.getIdToken();
      const response = await SignInWithGoogle(token);
      const userData = await response.json();
      console.log("User Data:", userData);
    } catch (error) {
      console.error("Error during sign-in:", error);
    }
  };

  return (
    <div className="flex flex-col items-center self-center ">
      <div className="items-center text-center mt-10">
        <div className="w-auto">
          <img src={Logo} alt="Musify" className="w-full" />
        </div>
        <h1 className="text-4xl font-bold pb-9 text-white">Login</h1>
        <form onSubmit={handleSubmit} className="form">
          <div className="flex flex-col">
            <input
              type="text"
              className="border-2 p-2 m-2 bg-transparent shadow-lg text-white border-slate-800 rounded-lg"
              placeholder="Username or Email"
              onChange={handleChange}
              name="usernameOremail"
              value={loginData.usernameOremail}
            />
            <input
              type="password"
              className="border-2 p-2 m-2 bg-transparent shadow-lg text-white border-slate-800 rounded-lg"
              placeholder="Password"
              onChange={handleChange}
              name="password"
              value={loginData.password}
            />
            <button
              className="bg-blue-400 p-2 m-2 rounded"
              disabled={status === "submitting"}
            >
              {status === "submitting" ? "Logging in..." : "Login"}
            </button>
            <h1 className="text-lg text-white">or</h1>
          </div>
        </form>

        {error && <p className="text-red-500">{error}</p>}
        <h3 className="text-white mt-2">
          Don't have an account?{" "}
          <NavLink to="/register" className="text-blue-600">
            {" "}
            Register{" "}
          </NavLink>{" "}
          Here
        </h3>
      </div>
    </div>
  );
}
