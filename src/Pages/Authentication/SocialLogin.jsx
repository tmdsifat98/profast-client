import React from "react";
import { FcGoogle } from "react-icons/fc";

const SocialLogin = () => {
  return (
    <div>
      <button className="btn bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600 text-black border-[#e5e5e5] w-full">
        <FcGoogle size={21} />
        Login with Google
      </button>
    </div>
  );
};

export default SocialLogin;
