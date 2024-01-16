'use client'

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import * as yup from "yup";
import { signIn } from "next-auth/react";

const validationSchema = yup.object({
    email: yup
        .string()
        .email("Enter a valid email")
        .required("Email is required"),
    password: yup
        .string()
        .required("Password is required")
        .min(8, "Password should contain 8 or more characters")
        .matches(
            /^[A-Za-z0-9]*$/,
            "Password should contain only Latin letters and numbers"
        ),
});

const LoginPage = () => {

    const router = useRouter();

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(validationSchema),
    });

    const onSubmit = async (data) => {
        const payload = {
            email: data.email,
            password: data.password
        };

        const res = await signIn("credentials", { ...payload, redirect: false });

        if (!res.error) router.push("/");

        else {
            setError('root.serverError', {
                message: res.error
            })
        }
    };

    return (
        <div>
            <form
                method="post"
                onSubmit={handleSubmit(onSubmit)}
                className=" mx-auto my-[200px] max-w-[90vw] md:max-w-[60vw] lg:max-w-[30vw] p-4 rounded-lg flex flex-col gap-5 items-center shadow-2xl"
            >
                <h1 className="text-darkBlue font-semibold text-3xl text-center">Log In</h1>
                <div className="flex flex-col gap-2 w-full">
                    <label htmlFor="title" className="text-gray-400 text-lg">Email</label>
                    <input type="email" id="email" {...register("email")} className="input" />
                    {errors.email?.message && (
                        <p className=" text-red-500 mt-2" role="alert">
                            {errors.email?.message}
                        </p>
                    )}
                </div>
                <div className="flex flex-col gap-2 w-full">
                    <label htmlFor="title" className="text-gray-400 text-lg">Password</label>
                    <input type="password" id="password" {...register("password")} className="input" />
                    {errors.password?.message && (
                        <p className=" text-red-500" role="alert">
                            {errors.password?.message}
                        </p>
                    )}
                </div>
                <button className="button button__submit w-full">Log In</button>
                {errors.root?.serverError && <p className=" text-red-500 mt-2 text-center">{errors.root.serverError.message}</p>}
                <p className="mt-5 text-gray-400">Don't have an account yet? <a href="/signup" className="text-darkBlue">Sign Up</a></p>
            </form>
        </div>
    )
}

export default LoginPage