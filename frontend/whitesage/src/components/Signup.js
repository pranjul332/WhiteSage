import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";

const SignUp = () => {
  const { user, loginWithRedirect, logout, isAuthenticated, isLoading } =
    useAuth0();
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const saveUserDetails = async () => {
      if (user) {
        setIsSaving(true);
        try {
          const userData = {
            email: user.email,
            name: user.name,
            picture: user.picture,
            sub: user.sub,
          };
          await axios.post("http://localhost:5000/api/users", userData);
          console.log("User details saved");
        } catch (error) {
          console.error("Error saving user details:", error);
          if (error.response) {
            console.error("Error response data:", error.response.data);
          }
        } finally {
          setIsSaving(false);
        }
      }
    };

    if (user) {
      saveUserDetails();
    }
  }, [user]);

  const handleLogin = () => {
    loginWithRedirect({
      prompt: "login",
      connection: "your-connection-name",
      ui_locales: "en",
      scope: "openid profile email",
    });
  };

  const handleSignUp = () => {
    loginWithRedirect({
      screen_hint: "signup",
      scope: "openid profile email",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-2">
        <div className="w-5 h-5 border-2 border-blue-600 rounded-full animate-spin border-t-transparent"></div>
        <span className="ml-2 text-blue-600 font-medium">Loading...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center w-full">
      {isAuthenticated ? (
        <div className="flex items-center rounded-full transition-all">
          {user.picture && (
            <img
              src={user.picture}
              alt="Profile"
              className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
            />
          )}
          <div className="ml-2 mr-1 flex flex-col">
            <span className="text-sm font-medium truncate max-w-[120px]">
              {user.name}
            </span>
            <button
              onClick={() => logout({ returnTo: window.location.origin })}
              className="text-xs text-gray-600 hover:text-gray-800 text-left font-medium"
            >
              Sign out
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center space-x-2">
          <button
            onClick={handleLogin}
            className="flex items-center bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-all duration-300 font-medium"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
              />
            </svg>
            Sign In
          </button>

          <button
            onClick={handleSignUp}
            className="flex items-center bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-all duration-300 font-medium"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </svg>
            Sign Up
          </button>
        </div>
      )}

      {isSaving && (
        <div className="ml-2 text-xs text-gray-500 flex items-center">
          <div className="w-3 h-3 border-2 border-gray-400 rounded-full animate-spin border-t-transparent mr-1"></div>
          Syncing...
        </div>
      )}
    </div>
  );
};

export default SignUp;
