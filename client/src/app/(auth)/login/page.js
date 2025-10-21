"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function SignInPage() {
  const [submittedData, setSubmittedData] = useState(null);
  const router = useRouter();
  const passwordRef1 = useRef();
  const [showHidePassword, setShowHidePassword] = useState(false);
  const [inputType, setInputType] = useState("password");

  // ✅ Yup Validation Schema
  const SignupSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  const handleClick = () => {
    if (showHidePassword == false) {
      setShowHidePassword(true);
      setInputType("text");
    } else {
      setShowHidePassword(false);
      setInputType("password");
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 text-black">
      <div className="w-full max-w-md bg-white transition shadow hover:shadow-gray-600  hover:shadow-md rounded-2xl  p-8">
        <div className="flex flex-col gap-0">
          <Image src="/eKharidLogo.png" alt="logo" height={100} width={100} />
          <h1 className="text-2xl mt-4 font-bold text-center mb-6 text-gray-800">
            Login
          </h1>
        </div>

        <Formik
          initialValues={{
            email: "",
            password: "",
          }}
          validationSchema={SignupSchema}
          onSubmit={async (values, { resetForm }) => {
            try {
              console.log("✅ Submitted Values:", values);
              const response = await fetch(
                "http://localhost:8000/user/userLogin",
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(values),
                }
              );
              await sleep(500);

              const data = await response.json();
              console.log("response, ", data);
              if (!response.ok) {
                throw new Error(data.message || "Something went wrong");
              }

              setSubmittedData(data);
              alert("✅ Signin successful!");
              resetForm();

              if (data.user.role === "buyer") {
                router.push(`/buyer/${data.user._id}/home`);
              }
              if (data.user.role === "seller") {
                router.push(`/seller/${data.user._id}/home`);
              }
            } catch (error) {
              console.error(`error occurred while form submission,\n ${error}`);
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-5">
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
                  type={inputType}
                  name="password"
                  className="mt-1 w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  placeholder="Enter password"
                  ref={passwordRef1}
                />
                <div onClick={handleClick} className="text-sm">
                  {showHidePassword == false ? (
                    <div>🐵 show</div>
                  ) : (
                    <div>🙈 hide</div>
                  )}
                </div>
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-sm text-red-500 mt-1"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-indigo-600 hover:bg-indigo-700 shadow-md text-white font-semibold py-2 rounded-lg transition"
              >
                {isSubmitting ? "Signing In..." : "Sign In"}
              </button>
              <div className="text-sm">
                Dont have an account?{" "}
                <Link
                  href="/register"
                  className="underline hover:text-indigo-700"
                >
                  Register here
                </Link>
              </div>
            </Form>
          )}
        </Formik>
        <br />

        {/* Show submitted data for demo */}
        {submittedData && (
          <div className="mt-6 p-3 bg-green-50 text-green-700 rounded-lg text-sm">
            ✅ SignIn successful! Data logged in console.
          </div>
        )}
      </div>
    </div>
  );
}
