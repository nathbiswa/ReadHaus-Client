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

export default function RegisterPage() {
    const router = useRouter();

    const onSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const data = {};

        formData.forEach((value, key) => {
            data[key] = value.toString();
        });

        if (data.password !== data.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        const { data: result, error } = await authClient.signUp.email({
            ...data
        })

        if (!error) {
            toast.success('Register successfull')
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
        <div className="min-h-screen py-10 flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">

            <div className="w-full max-w-md bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6">

                {/* TITLE */}
                <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white">
                    Create Account
                </h2>

                <p className="text-sm text-center text-gray-500 dark:text-gray-400 mb-4">
                    Join ReadHaus as Reader or Librarian
                </p>

                {/* FORM */}
                <Form className="flex flex-col gap-4" onSubmit={onSubmit}>

                    {/* NAME */}
                    <TextField isRequired name="name">
                        <Label>Full Name</Label>
                        <Input placeholder="John Doe" />
                        <FieldError />
                    </TextField>

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

                    {/* PHOTO */}
                    <TextField name="photo">
                        <Label>Photo URL</Label>
                        <Input placeholder="https://..." />
                        <FieldError />
                    </TextField>

                    {/* PASSWORD */}
                    <TextField
                        isRequired
                        name="password"
                        type="password"
                        validate={(value) => {
                            if (value.length < 8) {
                                return "Password must be at least 8 characters";
                            }
                            if (!/[A-Z]/.test(value)) {
                                return "Must contain uppercase letter";
                            }
                            if (!/[0-9]/.test(value)) {
                                return "Must contain number";
                            }
                            return null;
                        }}
                    >
                        <Label>Password</Label>
                        <Input placeholder="Enter password" />
                        <Description>
                            8+ chars, 1 uppercase, 1 number
                        </Description>
                        <FieldError />
                    </TextField>

                    {/* CONFIRM PASSWORD */}
                    <TextField isRequired name="confirmPassword">
                        <Label>Confirm Password</Label>
                        <Input placeholder="Confirm password" />
                        <FieldError />
                    </TextField>

                    {/* ROLE (FIXED ONLY HERE) */}
                    <TextField isRequired name="role">
                        <Label>Role</Label>

                        <select
                            name="role"
                            defaultValue="user"
                            className="w-full px-3 py-2 rounded-md border dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        >
                            <option value="user">User (Reader)</option>
                            <option value="librarian">Librarian</option>
                        </select>

                        <FieldError />
                    </TextField>

                    {/* SUBMIT BUTTONS */}
                    <div className="flex gap-2 pt-2">

                        <Button type="submit" className="flex-1">
                            <Check />
                            Create Account
                        </Button>

                        <Button type="reset" variant="secondary" className="flex-1">
                            Reset
                        </Button>

                    </div>

                </Form>

                {/* 🔥 GOOGLE LOGIN (BOTTOM) */}
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