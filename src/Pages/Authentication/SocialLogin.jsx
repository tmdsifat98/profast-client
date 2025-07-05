import React from "react";
import { FcGoogle } from "react-icons/fc";
import useAuth from "../../hooks/useAuth";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";
import useAxiosLocal from "../../hooks/useAxiosLocal";

const SocialLogin = () => {
  const { googleLogin } = useAuth();
  const navigate = useNavigate();
  const axiosLocal = useAxiosLocal();
  const handleGoogleLogin = () => {
    googleLogin()
      .then((res) => {
        const email = res.user.email;
        const name = res.user.displayName;
        axiosLocal.post("/users", { email, name }).then((res) => {
          if (res.data.insertedId || res.data.modifiedCount) {
            navigate("/");
            Swal.fire({
              position: "center",
              icon: "success",
              title: "Logged in successful!",
              showConfirmButton: false,
              timer: 1500,
            });
          }
        });
      })
      .catch((err) => console.log(err));
  };
  return (
    <div>
      <button
        onClick={handleGoogleLogin}
        className="btn bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600 text-black border-[#e5e5e5] w-full"
      >
        <FcGoogle size={21} />
        Login with Google
      </button>
    </div>
  );
};

export default SocialLogin;
