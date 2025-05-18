import { useState } from "react";
import { useDispatch } from "react-redux";
import { z } from "zod";
import { addComment } from "../store/blogSlice";

const CommentSchema = z.object({
  content: z.string().min(1, "Коментар не може бути порожнім"),
  author: z.string().min(1, "Автор обов’язковий"),
});

interface CommentFormProps {
  postId: number;
}

const CommentForm = ({ postId }: CommentFormProps) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({ content: "", author: "" });
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = CommentSchema.safeParse(formData);
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

    // Відправка коментаря на API
    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, comment: formData }),
      });

      if (!response.ok) throw new Error("Failed to add comment");

      // Якщо API успішно зберегло коментар, оновлюємо Redux
      dispatch(addComment({ postId, comment: formData }));
      setFormData({ content: "", author: "" });
      setErrors({});
    } catch (error) {
      console.error("Error adding comment:", error);
      setErrors({ general: "Не вдалося додати коментар. Спробуйте ще раз." });
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold text-gray-700 mb-3">
        Додати коментар
      </h3>
      <div className="space-y-4">
        <div>
          <input
            name="author"
            value={formData.author}
            onChange={handleChange}
            placeholder="Ваше ім’я"
            className="w-full p-2 md:p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 text-sm md:text-base"
          />
          {errors.author && (
            <p className="text-red-500 text-xs md:text-sm mt-1">
              {errors.author}
            </p>
          )}
        </div>
        <div>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="Ваш коментар"
            className="w-full p-2 md:p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 h-20 md:h-24 resize-none text-sm md:text-base"
          />
          {errors.content && (
            <p className="text-red-500 text-xs md:text-sm mt-1">
              {errors.content}
            </p>
          )}
        </div>
        {errors.general && (
          <p className="text-red-500 text-xs md:text-sm">{errors.general}</p>
        )}
        <button
          onClick={handleSubmit}
          className="w-full bg-blue-500 text-white p-2 md:p-3 rounded-lg shadow-md hover:bg-blue-600 transition-colors duration-200 text-sm md:text-base"
        >
          Відправити коментар
        </button>
      </div>
    </div>
  );
};

export default CommentForm;
