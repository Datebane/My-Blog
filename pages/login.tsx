"use client";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentUser } from "../src/store/blogSlice";
import { RootState } from "../src/store";
import { useRouter } from "next/router";
import { z } from "zod";
import Link from "next/link";
import { hashPassword } from "../src/utils/hashPassword";

const LoginSchema = z.object({
  email: z.string().email("Невірний формат email"),
  password: z.string().min(6, "Пароль має містити щонайменше 6 символів"),
});

const LoginForm = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { users } = useSelector((state: RootState) => state.blog);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = LoginSchema.safeParse(formData);
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

    const hashedPassword = hashPassword(formData.password);
    const user = users.find(
      (u) => u.email === formData.email && u.password === hashedPassword
    );

    if (!user) {
      setErrors({ general: "Невірний email або пароль" });
      return;
    }

    dispatch(setCurrentUser(user));
    router.push("/");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "", general: "" });
  };

  return (
    <div className="max-w-lg mx-auto p-8 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-semibold text-gray-700 mb-6">Авторизація</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
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
        {errors.general && (
          <p className="text-red-500 text-sm">{errors.general}</p>
        )}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-3 rounded-lg shadow-md hover:bg-blue-600 transition-colors duration-200 text-base"
        >
          Увійти
        </button>
      </form>
      <p className="mt-4 text-center text-gray-600">
        Немає акаунту?{" "}
        <Link href="/register" className="text-blue-500 hover:underline">
          Зареєструватися
        </Link>
      </p>
    </div>
  );
};

export default function Login() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <LoginForm />
    </div>
  );
}
