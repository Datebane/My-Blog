"use client";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setCurrentUser, registerUser } from "../src/store/blogSlice";
import { User } from "../src/types";
import { useRouter } from "next/router";
import { z } from "zod";
import Link from "next/link";
import { hashPassword } from "../src/utils/hashPassword";

const RegisterSchema = z
  .object({
    username: z.string().min(1, "Ім'я користувача обов’язкове"),
    email: z.string().email("Невірний формат email"),
    password: z.string().min(6, "Пароль має містити щонайменше 6 символів"),
    confirmPassword: z.string().min(6, "Повторити пароль"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Паролі не збігаються",
    path: ["confirmPassword"],
  });

const RegisterForm = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = RegisterSchema.safeParse(formData);
    if (!result.success) {
      const errorMessages = result.error.issues.reduce(
        (acc, issue) => ({
          ...acc,
          [issue.path[0]]: issue.message,
        }),
        {}
      );
      setErrors(errorMessages);
      return;
    }
    const user: User = {
      username: formData.username,
      id: Date.now().toString(),
      email: formData.email,
      password: hashPassword(formData.password),
    };
    dispatch(registerUser(user)); // Зберігаємо користувача
    dispatch(setCurrentUser(user)); // Встановлюємо поточного користувача
    router.push("/");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  return (
    <div className="max-w-lg mx-auto p-8 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-semibold text-gray-700 mb-6">Реєстрація</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="min-h-[5rem]">
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Ім’я користувача"
            className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 text-base"
          />
          {errors.username && (
            <p className="text-red-500 text-sm mt-2">{errors.username}</p>
          )}
        </div>
        <div className="min-h-[5rem]">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Електронна пошта"
            className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 text-base"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-2">{errors.email}</p>
          )}
        </div>
        <div className="min-h-[5rem]">
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Пароль"
            className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 text-base"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-2">{errors.password}</p>
          )}
        </div>
        <div className="min-h-[5rem]">
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Повторити пароль"
            className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 text-base"
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-2">
              {errors.confirmPassword}
            </p>
          )}
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-3 rounded-lg shadow-md hover:bg-blue-600 transition-colors duration-200 text-base"
        >
          Зареєструватися
        </button>
      </form>
      <p className="mt-4 text-center text-gray-600">
        Уже маєте акаунт?{" "}
        <Link href="/login" className="text-blue-500 hover:underline">
          Увійти
        </Link>
      </p>
    </div>
  );
};

export default function Register() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <RegisterForm />
    </div>
  );
}
