"use client";
import React from "react";
import { Button } from "./Button";

export const CallToAction = () => {
  return (
    <section className="p-20 bg-blue-600 max-md:p-10 max-sm:p-6">
      <div className="mx-auto max-w-screen-xl text-center">
        <h2 className="mb-8 text-3xl font-bold text-white">
          Ready to optimize your water management?
        </h2>
        <p className="mb-14 text-base text-blue-100">
          Join thousands of satisfied customers who have transformed their water
          monitoring with our smart solution.
        </p>
        <Button variant="white">Start Free Trial</Button>
      </div>
    </section>
  );
};
