"use client";

import { authClient } from "@/lib/auth-client";
import { Check } from "@gravity-ui/icons";
import {
    Button,
    Description,
    FieldError,
    Form,
    Input,
    Label,
    TextField,
} from "@heroui/react";
import Image from "next/image";

import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function LoginPage() {
    const router = useRouter();

    const onSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const data = {};

        formData.forEach((value, key) => {
            data[key] = value.toString();
        });

        const { data: result, error } = await authClient.signIn.email({
            ...data
        })

        if (!error) {
            toast.success('Login successfull')
            router.push("/");
        } else {
            toast.error('Something error')
        }
    };

    const handleGoogleLogin = () => {
        console.log("Google login clicked");
        router.push("/");
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">

            <div className="w-full max-w-md bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6">

                {/* TITLE */}
                <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white">
                    Welcome Back
                </h2>

                <p className="text-sm text-center text-gray-500 dark:text-gray-400 mb-4">
                    Login to your ReadHaus account
                </p>

                {/* FORM */}
                <Form className="flex flex-col gap-4" onSubmit={onSubmit}>

                    {/* EMAIL */}
                    <TextField
                        isRequired
                        name="email"
                        type="email"
                        validate={(value) => {
                            if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
                                return "Please enter a valid email address";
                            }
                            return null;
                        }}
                    >
                        <Label>Email</Label>
                        <Input placeholder="john@example.com" />
                        <FieldError />
                    </TextField>

                    {/* PASSWORD */}
                    <TextField
                        isRequired
                        name="password"
                        type="password"
                        validate={(value) => {
                            if (value.length < 6) {
                                return "Password must be at least 6 characters";
                            }
                            return null;
                        }}
                    >
                        <Label>Password</Label>
                        <Input placeholder="Enter your password" />
                        <Description>
                            Use your registered password
                        </Description>
                        <FieldError />
                    </TextField>

                    {/* BUTTONS */}
                    <div className="flex gap-2 pt-2">

                        <Button type="submit" className="flex-1">
                            <Check />
                            Login
                        </Button>

                        <Button type="reset" variant="secondary" className="flex-1">
                            Reset
                        </Button>

                    </div>

                </Form>

                {/* GOOGLE LOGIN */}
                <div className="mt-6">

                    <div className="flex items-center my-4">
                        <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600"></div>
                        <span className="px-2 text-xs text-gray-500">OR</span>
                        <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600"></div>
                    </div>

                    <Button
                        onClick={handleGoogleLogin}
                        className="
    w-full flex items-center justify-center gap-2
    py-2 rounded-md
    bg-white text-gray-900 border border-gray-300
    dark:bg-gray-700 dark:text-white dark:border-gray-600
    hover:bg-gray-100 dark:hover:bg-gray-600
    transition
  "
                    >
                        <Image
                            src="/google.png"
                            alt="google"
                            width={20}
                            height={20}
                            className="shrink-0"
                        />

                        <span className="font-medium">Continue with Google</span>
                    </Button>
                </div>

            </div>

        </div>
    );
}