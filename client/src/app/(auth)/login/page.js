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
	const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
	const passwordRef1 = useRef();
	const [showHidePassword, setShowHidePassword] = useState(false);
	const [inputType, setInputType] = useState("password");

	const [apiMessage, setApiMessage] = useState(null);
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
		setShowHidePassword(!showHidePassword);
		setInputType(showHidePassword ? "password" : "text");
	};

	return (
		// Background: Dark Gray (Stone-900)
		<div className="flex items-center justify-center min-h-screen bg-stone-900 text-white px-4">
			{/* Card: White with Gray border */}
			<div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 border-t-8 border-orange-600">
				<div className="flex flex-col items-center mb-6">
					<Image
						src="/eKharidLogo.png"
						alt="logo"
						height={80}
						width={80}
						className="cursor-pointer mb-2"
					/>
					<h1 className="text-3xl font-extrabold text-stone-800">
						Welcome Back
					</h1>
					<p className="text-stone-500 text-sm">
						Please sign in to your account
					</p>
				</div>

				<Formik
					initialValues={{ email: "", password: "" }}
					validationSchema={SignupSchema}
					onSubmit={async (values, { setSubmitting, resetForm }) => {
						try {
							const response = await fetch(
								`${NEXT_PUBLIC_API_URL}/user/userLogin`,
								{
									method: "POST",
									headers: { "Content-Type": "application/json" },
									body: JSON.stringify(values),
								},
							);
							await sleep(500);

							const data = await response.json();
							if (!response.ok) {
								setApiMessage(data.message);

								throw new Error(data.message || "Something went wrong");
							}
							localStorage.setItem("userToken", data.user);
							setSubmittedData(data);
							resetForm();

							if (data.user?.role === "buyer")
								router.push(`/buyer/${data.user._id}/home`);
							if (data.user?.role === "seller")
								router.push(`/seller/${data.user._id}/home`);
						} catch (error) {
							console.error(error);
						} finally {
							setSubmitting(false);
							setTimeout(() => {
								setApiMessage(null);
							}, 5000);
						}
					}}
				>
					{({ isSubmitting }) => (
						<Form className="space-y-5">
							{/* Email */}
							<div>
								<label className="block text-sm font-semibold text-stone-700">
									Email Address
								</label>
								<Field
									type="email"
									name="email"
									className="mt-1 w-full px-4 py-3 bg-stone-50 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-orange-600 transition-all"
									placeholder="name@company.com"
								/>
								<ErrorMessage
									name="email"
									component="div"
									className="text-xs text-red-600 mt-1 font-medium"
								/>
							</div>

							{/* Password */}
							<div className="relative">
								<label className="block text-sm font-semibold text-stone-700">
									Password
								</label>
								<div className="relative">
									<Field
										type={inputType}
										name="password"
										className="mt-1 w-full px-4 py-3 bg-stone-50 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-orange-600 transition-all"
										placeholder="••••••••"
									/>
									<div
										onClick={handleClick}
										className="absolute right-3 top-1/2 -translate-y-1/2 mt-0.5 text-xs font-bold text-orange-600 cursor-pointer hover:text-orange-700 select-none"
									>
										{showHidePassword ? "HIDE 🙈" : "SHOW 🐵"}
									</div>
								</div>
								<ErrorMessage
									name="password"
									component="div"
									className="text-xs text-red-600 mt-1 font-medium"
								/>
							</div>

							{/* Submit Button: Dark Orange */}
							<button
								type="submit"
								disabled={isSubmitting}
								className="w-full bg-orange-600 hover:bg-orange-700 active:scale-[0.98] text-white font-bold py-3 rounded-lg shadow-lg shadow-orange-900/20 transition-all disabled:opacity-70"
							>
								{isSubmitting ? "Authenticating..." : "SIGN IN"}
							</button>

							<div className="text-center text-sm text-stone-600 font-medium">
								Don&apos;t have an account?{" "}
								<Link
									href="/register"
									className="text-orange-600 hover:underline font-bold"
								>
									Register here
								</Link>
							</div>
						</Form>
					)}
				</Formik>

				<div className="text-black">
					{submittedData && (
						<div className="mt-6 p-3 bg-green-100 border border-green-200 text-green-800 rounded-lg text-center text-xs font-bold animate-pulse">
							SUCCESS: Redirecting...
						</div>
					)}
					{apiMessage && <div>{apiMessage}</div>}
				</div>
			</div>
		</div>
	);
}
