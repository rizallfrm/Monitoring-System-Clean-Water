"use client";
import React, { useState } from "react";
import { SignInForm } from "./SignInForm";
import { SignUpForm } from "./SignUpForm";

function InputDesign() {
  const [showSignIn, setShowSignIn] = useState(true);

  const toggleForm = () => {
    setShowSignIn(!showSignIn);
  };

  return (
    <main className="flex flex-col items-center px-0 py-10 mx-auto max-w-none bg-blue-50 max-md:p-5 max-md:max-w-[991px] max-sm:p-4 max-sm:max-w-screen-sm">
      {showSignIn ? (
        <SignInForm onSignUp={toggleForm} />
      ) : (
        <SignUpForm onSignIn={toggleForm} />
      )}
    </main>
  );
}

export default InputDesign;
