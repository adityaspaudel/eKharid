"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function SignupPage() {
  const [submittedData, setSubmittedData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // ✅ Yup Validation Schema
  const SignupSchema = Yup.object().shape({
    fullName: Yup.string()
      .min(3, "Full name must be at least 3 characters")
      .required("Full name is required"),
    username: Yup.string()
      .min(3, "username must be at least 3 characters")
      .required("username is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm Password is required"),
    role: Yup.string().required("role is required"),
  });

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 text-black">
      <div className="w-full max-w-md bg-white rounded-2xl transition shadow hover:shadow-gray-600 hover:shadow-md px-8 py-4">
        <div>
          <Image src="/eKharidLogo.png" alt="logo" height={100} width={100} />
          <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
            Create an Account
          </h1>
        </div>

        <Formik
          initialValues={{
            fullName: "",
            email: "",
            username: "",
            password: "",
            confirmPassword: "",
            role: "",
          }}
          validationSchema={SignupSchema}
          onSubmit={async (values, { resetForm }) => {
            try {
              console.log("✅ Submitted Values:", values);
              const response = await fetch(
                "http://localhost:8000/user/userRegistration",
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(values),
                }
              );
              const data = await response.json();

              if (!response.ok) {
                throw new Error(data.message || "Something went wrong");
              }
              setIsSubmitting(true);
              setSubmittedData(data);
              alert("✅ Signup successful!");
              resetForm();
            } catch (error) {
              console.error(`error occurred while form submission,\n${error}`);
            } finally {
              setIsSubmitting(false);
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-5">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <Field
                  type="text"
                  name="fullName"
                  className="mt-1 w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  placeholder="Enter your full name"
                />
                <ErrorMessage
                  name="fullName"
                  component="div"
                  className="text-sm text-red-500 mt-1"
                />
              </div>

              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <Field
                  type="text"
                  name="username"
                  className="mt-1 w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  placeholder="Enter your username"
                />
                <ErrorMessage
                  name="username"
                  component="div"
                  className="text-sm text-red-500 mt-1"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <Field
                  type="email"
                  name="email"
                  className="mt-1 w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  placeholder="Enter your email"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-sm text-red-500 mt-1"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <Field
                  type="password"
                  name="password"
                  className="mt-1 w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  placeholder="Enter password"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-sm text-red-500 mt-1"
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <Field
                  type="password"
                  name="confirmPassword"
                  className="mt-1 w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  placeholder="Re-enter password"
                />
                <ErrorMessage
                  name="confirmPassword"
                  component="div"
                  className="text-sm text-red-500 mt-1"
                />
              </div>
              {/* Role */}
              <div className="flex flex-col">
                <Field as="select" name="role" className=" w-40 ">
                  <option value="" className="">
                    Select a role
                  </option>
                  <option value="buyer" default>
                    buyer
                  </option>
                  <option value="seller">seller</option>
                </Field>
              </div>
              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-indigo-600 hover:bg-indigo-700 shadow-md text-white font-semibold py-2 rounded-lg transition"
              >
                {isSubmitting ? "Creating Account..." : "Sign Up"}
              </button>
            </Form>
          )}
        </Formik>
        <div className="text-sm">
          already have an account?{" "}
          <Link
            href="/login"
            className="underline  hover:text-indigo-700 shadow-md"
          >
            Login here
          </Link>
        </div>
        {/* Show submitted data for demo */}
        {submittedData && (
          <div className="mt-6 p-3 bg-green-50 text-green-700 rounded-lg text-sm">
            ✅ Signup successful! Data logged in console.
          </div>
        )}
      </div>
    </div>
  );
}
