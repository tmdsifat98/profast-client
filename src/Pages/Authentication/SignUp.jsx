import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import authImage from "../../assets/authImage.png";
import useAuth from "../../hooks/useAuth";
import Swal from "sweetalert2";
import { updateProfile } from "firebase/auth";
import { useNavigate } from "react-router";

const SignUp = () => {
  const { createUser } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    console.log("Form Data:", data);
    const { email, password, name } = data;
    createUser(email, password)
      .then((res) => {
        const user = res.user;
        updateProfile(user, {
          displayName: name,
          photoURL: imageUrl,
        }).then(() => {
          axios.post("http://localhost:3000/users", { email }).then((res) => {
            if (res.data.insertedId) {
              navigate("/");
              Swal.fire({
                position: "center",
                icon: "success",
                title: "Account has been created successfully!",
                showConfirmButton: false,
                timer: 1500,
              });
            }
          });
        });
      })
      .catch((err) => {
        Swal.fire({
          title: `${err.message}`,
          icon: "error",
          draggable: true,
        });
      });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    setLoading(true);

    try {
      const res = await axios.post(
        `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API}`,
        formData
      );
      console.log(res.data);
      setImageUrl(res.data.data.display_url);
    } catch (err) {
      console.error("Image Upload Failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row justify-center md:gap-20 items-center min-h-[calc(100vh-64px)]">
      {/* Left Side - Form */}
      <div className="z-10 w-11/12 backdrop-blur-sm p-8 rounded shadow-2xl md:max-w-md transition-colors duration-500">
        <div className="flex justify-center mb-4">
          <div className="relative w-24 h-24">
            {loading ? (
              <div className="w-24 h-24 rounded-full border-4 border-dashed border-gray-400 animate-spin"></div>
            ) : (
              <img
                src={
                  imageUrl ||
                  "https://www.svgrepo.com/show/382106/user-circle.svg"
                }
                alt="Profile"
                className="w-24 h-24 object-cover rounded-full border"
              />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="absolute inset-0 opacity-0 cursor-pointer"
              title="Upload Image"
            />
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input
              {...register("name", { required: "Name is required" })}
              className="w-full border p-2 rounded"
              placeholder="Enter your name"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              {...register("email", { required: "Email is required" })}
              className="w-full border p-2 rounded"
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium">Password</label>
            <input
              type="password"
              {...register("password", { required: "Password is required" })}
              className="w-full border p-2 rounded"
              placeholder="Enter password"
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium">
              Confirm Password
            </label>
            <input
              type="password"
              {...register("confirmPassword", {
                required: "Please confirm password",
                validate: (value) =>
                  value === watch("password") || "Passwords do not match",
              })}
              className="w-full border p-2 rounded"
              placeholder="Confirm password"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Sign Up
          </button>
        </form>
      </div>

      {/* Right Side - Image */}
      <div>
        <img src={authImage} className="" />
      </div>
    </div>
  );
};
export default SignUp;
