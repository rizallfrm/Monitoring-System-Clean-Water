import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import InputDesign from "./InputDesign";

describe("InputDesign", () => {
  it("renders sign in form by default", () => {
    render(<InputDesign />);
    expect(screen.getByText("Sign in to your account")).toBeInTheDocument();
  });

  it("switches to sign up form when clicking sign up button", () => {
    render(<InputDesign />);
    const signUpButton = screen.getByText("Sign up");
    fireEvent.click(signUpButton);
    expect(screen.getByText("Create an account")).toBeInTheDocument();
  });

  it("switches back to sign in form when clicking sign in button", () => {
    render(<InputDesign />);
    const signUpButton = screen.getByText("Sign up");
    fireEvent.click(signUpButton);
    const signInButton = screen.getByText("Sign in");
    fireEvent.click(signInButton);
    expect(screen.getByText("Sign in to your account")).toBeInTheDocument();
  });
});
