import { useState } from "react";
import { useDispatch } from "react-redux";
import { z } from "zod";
import { addPost } from "../store/blogSlice";

const PostSchema = z.object({
  title: z
    .string()
    .min(3, "Заголовок має містити щонайменше 3 символи")
    .max(100),
  content: z.string().min(10, "Вміст має містити щонайменше 10 символів"),
  author: z.string().min(1, "Автор обов’язковий"),
});

const PostForm = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    author: "",
  });
  const [errors, setErrors] = useState({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = PostSchema.safeParse(formData);
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
    dispatch(addPost(formData));
    setFormData({ title: "", content: "", author: "" });
    setErrors({});
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Заголовок"
          className="w-full p-3 md:p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 text-sm md:text-base"
        />
        {errors.title && (
          <p className="text-red-500 text-xs md:text-sm mt-1">{errors.title}</p>
        )}
      </div>
      <div>
        <textarea
          name="content"
          value={formData.content}
          onChange={handleChange}
          placeholder="Вміст"
          className="w-full p-3 md:p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 h-24 md:h-32 resize-none text-sm md:text-base"
        />
        {errors.content && (
          <p className="text-red-500 text-xs md:text-sm mt-1">
            {errors.content}
          </p>
        )}
      </div>
      <div>
        <input
          name="author"
          value={formData.author}
          onChange={handleChange}
          placeholder="Автор"
          className="w-full p-3 md:p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 text-sm md:text-base"
        />
        {errors.author && (
          <p className="text-red-500 text-xs md:text-sm mt-1">
            {errors.author}
          </p>
        )}
      </div>
      <button
        type="submit"
        className="w-full bg-blue-500 text-white p-2 md:p-3 rounded-lg shadow-md hover:bg-blue-600 transition-colors duration-200 text-sm md:text-base"
      >
        Опублікувати
      </button>
    </form>
  );
};

export default PostForm;