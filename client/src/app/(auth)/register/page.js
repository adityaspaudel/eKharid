"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function SignupPage() {
	const [submittedData, setSubmittedData] = useState(null);
	const [apiMessage, setApiMessage] = useState(null);
	const router = useRouter();
	// ✅ Yup Validation Schema
	const SignupSchema = Yup.object().shape({
		fullName: Yup.string()
			.min(3, "Full name must be at least 3 characters")
			.required("Full name is required"),
		username: Yup.string()
			.min(3, "Username must be at least 3 characters")
			.required("Username is required"),
		email: Yup.string()
			.email("Invalid email address")
			.required("Email is required"),
		password: Yup.string()
			.min(6, "Password must be at least 6 characters")
			.required("Password is required"),
		confirmPassword: Yup.string()
			.oneOf([Yup.ref("password"), null], "Passwords must match")
			.required("Confirm Password is required"),
		role: Yup.string().required("Role is required"),
	});

	return (
		// Background: Dark Gray (Stone-900)
		<div className="flex items-center justify-center min-h-screen bg-stone-900 text-white p-6">
			{/* Card: White with Orange accent border */}
			<div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border-t-8 border-orange-600 px-8 py-6">
				<div className="flex flex-col items-center mb-6">
					<Image
						src="/eKharidLogo.png"
						alt="logo"
						height={80}
						width={80}
						className="mb-2"
					/>
					<h1 className="text-3xl font-extrabold text-stone-800">
						Create an Account
					</h1>
					<p className="text-stone-500 text-sm">Join the marketplace today</p>
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
					onSubmit={async (values, { setSubmitting, resetForm }) => {
						try {
							const response = await fetch(
								"http://localhost:8000/user/userRegistration",
								{
									method: "POST",
									headers: { "Content-Type": "application/json" },
									body: JSON.stringify(values),
								},
							);
							const data = await response.json();

							if (!response.ok) {
								setApiMessage(data.message);

								throw new Error(data.message || "Something went wrong");
							}
							router.push("/login");
							setSubmittedData(data);
							alert("✅ Signup successful!");
						} catch (error) {
							// console.error(`Error: ${error}`);
						} finally {
							resetForm();

							setTimeout(() => {
								setSubmitting(false);

								setApiMessage(null);
							}, 5000);
						}
					}}
				>
					{({ isSubmitting }) => (
						<Form className="space-y-4">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								{/* Full Name */}
								<div>
									<label className="block text-sm font-semibold text-stone-700">
										Full Name
									</label>
									<Field
										type="text"
										name="fullName"
										className="mt-1 w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 focus:ring-2 focus:ring-orange-600 focus:outline-none transition"
										placeholder="John Doe"
									/>
									<ErrorMessage
										name="fullName"
										component="div"
										className="text-xs text-red-600 mt-1"
									/>
								</div>

								{/* Username */}
								<div>
									<label className="block text-sm font-semibold text-stone-700">
										Username
									</label>
									<Field
										type="text"
										name="username"
										className="mt-1 w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 focus:ring-2 focus:ring-orange-600 focus:outline-none transition"
										placeholder="johndoe123"
									/>
									<ErrorMessage
										name="username"
										component="div"
										className="text-xs text-red-600 mt-1"
									/>
								</div>
							</div>

							{/* Email */}
							<div>
								<label className="block text-sm font-semibold text-stone-700">
									Email Address
								</label>
								<Field
									type="email"
									name="email"
									className="mt-1 w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 focus:ring-2 focus:ring-orange-600 focus:outline-none transition"
									placeholder="email@example.com"
								/>
								<ErrorMessage
									name="email"
									component="div"
									className="text-xs text-red-600 mt-1"
								/>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								{/* Password */}
								<div>
									<label className="block text-sm font-semibold text-stone-700">
										Password
									</label>
									<Field
										type="password"
										name="password"
										className="mt-1 w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 focus:ring-2 focus:ring-orange-600 focus:outline-none transition"
										placeholder="••••••••"
									/>
									<ErrorMessage
										name="password"
										component="div"
										className="text-xs text-red-600 mt-1"
									/>
								</div>

								{/* Confirm Password */}
								<div>
									<label className="block text-sm font-semibold text-stone-700">
										Confirm Password
									</label>
									<Field
										type="password"
										name="confirmPassword"
										className="mt-1 w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 focus:ring-2 focus:ring-orange-600 focus:outline-none transition"
										placeholder="••••••••"
									/>
									<ErrorMessage
										name="confirmPassword"
										component="div"
										className="text-xs text-red-600 mt-1"
									/>
								</div>
							</div>

							{/* Role Selection */}
							<div>
								<label className="block text-sm font-semibold text-stone-700 mb-1">
									I want to be a:
								</label>
								<Field
									as="select"
									name="role"
									className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 bg-stone-50 focus:ring-2 focus:ring-orange-600 focus:outline-none transition appearance-none"
								>
									<option value="">Select a role</option>
									<option value="buyer">Buyer</option>
									<option value="seller">Seller</option>
								</Field>
								<ErrorMessage
									name="role"
									component="div"
									className="text-xs text-red-600 mt-1"
								/>
							</div>

							{/* Submit Button */}
							<button
								type="submit"
								disabled={isSubmitting}
								className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-lg shadow-lg transition-transform active:scale-[0.98] disabled:bg-stone-400 mt-2"
							>
								{isSubmitting ? "Creating Account..." : "SIGN UP"}
							</button>
						</Form>
					)}
				</Formik>

				<div className="text-center text-sm mt-6 text-stone-600 font-medium">
					Already have an account?{" "}
					<Link
						href="/login"
						className="text-orange-600 font-bold hover:underline"
					>
						Login here
					</Link>
					<div className="text-red-600">
						{apiMessage && <div>{apiMessage}</div>}
						{submittedData && (
							<div className="mt-4 p-3 bg-green-100 border border-green-200 text-green-800 rounded-lg text-center text-xs font-bold">
								✅ Registration Successful!
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
