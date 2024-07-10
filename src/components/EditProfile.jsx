import React, { useState } from "react";
import { updateUserInfo, updateAvatar, updatePassword } from "../API/userAPI";
import { useNavigate } from "react-router-dom";

const EditProfile = ({ onClose, user, onSuccess }) => {
  const [formData, setFormData] = useState({
    fullName: user.fullName,
    email: user.email,
    avatar: user.avatar,
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [activeTab, setActiveTab] = useState("basic"); // Default to basic info update
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    setAvatarFile(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    switch (activeTab) {
      case "basic":
        updateUserInfo(formData)
          .then((response) => {
            if (response.success) {
              onSuccess("Profile updated successfully");
              onClose();
            } else {
              setError(response.message);
            }
          })
          .catch((error) =>
            setError("Error updating basic info: " + error.message)
          )
          .finally(() => setLoading(false));
        break;
      case "avatar":
        if (avatarFile) {
          console.log("avatar file: ", avatarFile);
          updateAvatar(avatarFile)
            .then((response) => {
              console.log(response);
              if (response.success) {
                onSuccess("Avatar updated successfully");
                onClose();
              } else {
                setError(response.message);
              }
            })
            .catch((error) =>
              setError("Error updating avatar: " + error.message)
            )
            .finally(() => setLoading(false));
        } else {
          setError("Please select an avatar file.");
          setLoading(false);
        }
        break;
      case "password":
        if (formData.newPassword !== formData.confirmPassword) {
          setError("Passwords do not match");
          setLoading(false);
          return;
        }
        updatePassword({
          oldPassword: formData.oldPassword,
          newPassword: formData.newPassword,
          confirmPassword: formData.confirmPassword,
        })
          .then((response) => {
            if (response.success) {
              onSuccess("Password updated successfully");
              navigate("/user", {
                state: { message: "Changes applied successfully!" },
              });
              onClose();
            } else {
              setError(response.message);
            }
          })
          .catch((error) =>
            setError("Error updating password: " + error.message)
          )
          .finally(() => setLoading(false));
        break;
      default:
        setLoading(false);
        break;
    }
  };

  return (
    <div className="fixed  inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-musify-dark rounded-3xl p-6 w-1/3 flex flex-col items-center">
        <h2 className="text-2xl font-semibold mb-4 text-white">Edit Profile</h2>
        {/** Tab buttons */}
        <div className="flex mb-4">
          <button
            className={`mr-2 py-2 px-4 rounded-t-md ${
              activeTab === "basic"
                ? "bg-teal-600 text-white"
                : "bg-gray-800 text-white hover:bg-gray-700"
            }`}
            onClick={() => setActiveTab("basic")}
          >
            Basic Info
          </button>
          <button
            className={`mr-2 py-2 px-4 ${
              activeTab === "avatar"
                ? "bg-teal-600 text-white"
                : "bg-gray-800 text-white hover:bg-gray-700"
            }`}
            onClick={() => setActiveTab("avatar")}
          >
            Avatar
          </button>
          <button
            className={`py-2 px-4 rounded-b-md ${
              activeTab === "password"
                ? "bg-teal-600 text-white"
                : "bg-gray-800 text-white hover:bg-gray-700"
            }`}
            onClick={() => setActiveTab("password")}
          >
            Password
          </button>
        </div>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          {activeTab === "basic" && (
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-white"
              >
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="mt-1 p-2 w-full text-white bg-neutral-900 border border-gray-700 rounded-md"
              />
              <label
                htmlFor="email"
                className="block text-sm font-medium text-white mt-4"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 p-2 w-full text-white bg-neutral-900 border border-gray-700 rounded-md"
              />
            </div>
          )}
          {activeTab === "avatar" && (
            <div>
              <label
                htmlFor="avatar"
                className="block text-sm font-medium text-white"
              >
                Avatar
              </label>
              <input
                type="file"
                id="avatar"
                name="avatar"
                accept="image/*"
                onChange={handleAvatarChange}
                className="mt-1 p-2 w-full text-white bg-neutral-900 border border-gray-700 rounded-md"
              />
            </div>
          )}
          {activeTab === "password" && (
            <div>
              <label
                htmlFor="oldPassword"
                className="block text-sm font-medium text-white"
              >
                Old Password
              </label>
              <input
                type="password"
                id="oldPassword"
                name="oldPassword"
                value={formData.oldPassword}
                onChange={handleChange}
                className="mt-1 p-2 w-full text-white bg-neutral-900 border border-gray-700 rounded-md"
              />
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-white mt-4"
              >
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className="mt-1 p-2 w-full text-white bg-neutral-900 border border-gray-700 rounded-md"
              />
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-white mt-4"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="mt-1 p-2 w-full text-white bg-neutral-900 border border-gray-700 rounded-md"
              />
            </div>
          )}
          <div className="flex justify-end mt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-800 text-white hover:bg-gray-700 py-2 px-4 rounded-md mr-2"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-gray-300 hover:bg-white text-black py-2 px-4 rounded-md"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
