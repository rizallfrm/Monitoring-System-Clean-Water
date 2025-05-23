"use client";
import React from "react";
import { Logo } from "./Logo";
import { FormInput } from "./FormInput";
import { Checkbox } from "./CheckBox";
import { Button } from "./Button";

export const SignUpForm = ({ onSignIn }) => {
  return (
    <section className="flex justify-center items-center mb-10 w-full max-w-md max-md:max-w-[400px] max-sm:max-w-[360px]">
      <div className="box-border p-8 w-full bg-white rounded-lg shadow-[0px_1px_2px_rgba(0,0,0,0.1),0px_1px_3px_rgba(0,0,0,0.1)] max-md:p-6 max-sm:p-5">
        <Logo />
        <h2 className="mb-6 w-full text-xl font-bold text-center text-gray-900 max-md:text-lg max-sm:text-base">
          Create an account
        </h2>
        <form className="flex flex-col gap-6">
          <FormInput label="Full Name" placeholder="John Doe" />
          <FormInput
            label="Email"
            placeholder="name@company.com"
            type="email"
          />
          <FormInput label="Password" placeholder="••••••••" type="password" />
          <FormInput
            label="Confirm Password"
            placeholder="••••••••"
            type="password"
          />
          <Checkbox>
            <span>I accept the </span>
            <button
              type="button"
              className="text-sm font-medium text-blue-600 cursor-pointer"
            >
              Terms and Conditions
            </button>
          </Checkbox>
          <Button>Create Account</Button>
          <p className="text-sm font-light text-center text-gray-500">
            Already have an account?
          </p>
          <button
            type="button"
            onClick={onSignIn}
            className="text-base font-medium text-center text-blue-600 cursor-pointer max-md:text-base max-sm:text-sm"
          >
            Sign in
          </button>
        </form>
      </div>
    </section>
  );
};
