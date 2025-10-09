"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useState } from "react";

export default function SignupPage() {
  const [submittedData, setSubmittedData] = useState(null);

  // ✅ Yup Validation Schema
  const SignupSchema = Yup.object().shape({
    fullName: Yup.string()
      .min(3, "Full name must be at least 3 characters")
      .required("Full name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm Password is required"),
  });

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 text-black">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Create an Account
        </h1>

        <Formik
          initialValues={{
            fullName: "",
            email: "",
            password: "",
            confirmPassword: "",
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
              await sleep(500);

              setSubmittedData(values);
            } catch (error) {
              console.error(`error occurred while form submission,\n${error}`);
            } finally {
              resetForm();
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
                  className="mt-1 w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your full name"
                />
                <ErrorMessage
                  name="fullName"
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
                  className="mt-1 w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="mt-1 w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="mt-1 w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Re-enter password"
                />
                <ErrorMessage
                  name="confirmPassword"
                  component="div"
                  className="text-sm text-red-500 mt-1"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
              >
                {isSubmitting ? "Creating Account..." : "Sign Up"}
              </button>
            </Form>
          )}
        </Formik>

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
