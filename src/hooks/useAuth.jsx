import React, { useContext } from "react";
import AuthContext from "../Providers/AuthContext";

const useAuth = () => {
  const useAuth = useContext(AuthContext);
  return useAuth;
};

export default useAuth;
