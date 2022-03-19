import React, { useEffect, useState } from "react";
import {useNavigate, useLocation} from "react-router-dom"
import queryString from "query-string";
import axios from "axios";

const url = "http://localhost:8000/api/user";
export default function Forms() {
  const location = useLocation();
  console.log(location);
  const history = useNavigate();
  const [inValidUser, setInValidUser] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(true);
  const [success, setSuccess] = useState(false);
  const [newPassword, setNewPassword] = useState({
    password: '',
    confirmPassword: '',
  });
  
  const { token, id } = queryString.parse(location.search);
  const verifyToken = async () => {
    try {
      const { data } = await axios(
        `${url}/verify-token?token=${token}&id=${id}`
      );
      setBusy(false);
      console.log(data);
    } catch (error) {
      if (error?.response?.data) {
        const { data } = error.response;
        if (!data.success) return setInValidUser(data.error);
        return console.log(error.response.data);
      }
      console.log(error);
    }
  };
  useEffect(() => {
    verifyToken();
  }, []);

  const handleChange = ({ target }) => {
    const { name, value } = target;
    setNewPassword({ ...newPassword, [name]: value });
  };
  const handleSubmit = async (e) => {
    e.preventdefault();
    const { password, confirmPassword } = newPassword;
    if (password.trim().length < 8 || password.trim().length > 20) {
      return setError("Password must be at least 8-20 characters");
    }
    if (password !== confirmPassword) {
      return setError("New Password does not match!");
    }

    try {
      setBusy(true);
      
      const { data } = await axios.post(
        `${url}/reset-password?token=${token}&id=${id}`, {password: newPassword.password}
      );
      setBusy(false);
      if (data.success) {
        history.replace("./reset-password");
        setSuccess(true);
      }
    } catch (error) {
      if (error?.response?.data) {
        const { data } = error.response;
        console.log(data);
        if (!data.success) return setError(data.error);
        return console.log(error.response.data);
      }
      console.log(error);
    }
  };

  if (success)
    return (
      <div className="max-w-screen-sm m-auto pt-40">
        <h1 className="text-center text-3xl text-green-500 mb3">
          Password Reset Successfully
        </h1>
      </div>
    );
  if (inValidUser)
    return (
      <div className="max-w-screen-sm m-auto pt-40">
        <h1 className="text-center text-3xl text-red-500 mb3">
          {inValidUser}
        </h1>
      </div>
    );
  if (busy)
    return (
      <div className="max-w-screen-sm m-auto pt-40">
        <h1 className="text-center text-3xl text-gray-500 mb3">
          Wait for a moment, verify Reset Token
        </h1>
      </div>
    );
  return (
    <div className="max-w-screen-sm m-auto pt-40">
      <h1 className="text-center text-3xl text-gray-500 mb-3">
        Reset Password
      </h1>
      <form onSubmit={handleSubmit} className="shadow w-full rounded-lg p-10">
        {error && (
          <p className="text-center-p-2 mb-3 bg-red-500 text-white">{error}</p>
        )}
        <div className="space-y-8">
          <input
            type="password"
            placeholder="******"
            name="password"
            onChange={handleChange}
            className="px-3 text-lg h-10 w-full border-gray-500 border-2 rounded"
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="******"
            onChange={handleChange}
            className="px-3 text-lg h-10 w-full border-gray-500 border-2 rounded"
          />
          <button type="submit" className="bg-gray-500 w-full py-3 text-center text-white rounded">
            Reset Password
          </button>
        </div>
      </form>
    </div>
  );
}
