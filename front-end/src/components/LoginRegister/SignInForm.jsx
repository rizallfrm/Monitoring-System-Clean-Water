"use client";
import React from "react";
import { Logo } from "./Logo";
import { FormInput } from "./FormInput";
import { Checkbox } from "./CheckBox";
import { Button } from "./Button";

export const SignInForm = ({ onSignUp }) => {
  return (
    <section className="flex justify-center items-center mb-10 w-full max-w-md max-md:max-w-[400px] max-sm:max-w-[360px]">
      <div className="box-border p-8 w-full bg-white rounded-lg shadow-[0px_1px_2px_rgba(0,0,0,0.1),0px_1px_3px_rgba(0,0,0,0.1)] max-md:p-6 max-sm:p-5">
        <Logo />
        <h2 className="mb-6 w-full text-xl font-bold text-center text-gray-900 max-md:text-lg max-sm:text-base">
          Sign in to your account
        </h2>
        <form className="flex flex-col gap-6">
          <FormInput
            label="Email"
            placeholder="name@company.com"
            type="email"
          />
          <FormInput label="Password" placeholder="••••••••" type="password" />
          <div className="flex justify-between items-center">
            <Checkbox>Remember me</Checkbox>
            <button type="button" className="text-sm font-medium text-blue-600">
              Forgot password?
            </button>
          </div>
          <Button>Sign in</Button>
          <p className="text-sm font-light text-center text-gray-500">
            Don't have an account yet?
          </p>
          <button
            type="button"
            onClick={onSignUp}
            className="text-base font-medium text-center text-blue-600 cursor-pointer max-md:text-base max-sm:text-sm"
          >
            Sign up
          </button>
        </form>
      </div>
    </section>
  );
};
