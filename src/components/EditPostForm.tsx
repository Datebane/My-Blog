"use client";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { editPost } from "../store/blogSlice";
import { RootState } from "../store";
import { Post } from "../types";

interface EditPostFormProps {
  post: Post;
  onClose: () => void;
}

const EditPostForm = ({ post, onClose }: EditPostFormProps) => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: RootState) => state.blog);
  const [formData, setFormData] = useState({
    title: post.title,
    content: post.content,
  });
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUser?.username !== post.author) {
      setError("Ви можете редагувати лише свої пости");
      return;
    }
    dispatch(
      editPost({
        id: post.id,
        title: formData.title,
        content: formData.content,
      })
    );
    onClose();
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">
        Редагувати пост
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Заголовок"
            className="w-full p-2 md:p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 text-sm md:text-base"
          />
        </div>
        <div>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="Вміст"
            className="w-full p-2 md:p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 h-24 md:h-32 resize-none text-sm md:text-base"
          />
        </div>
        {error && <p className="text-red-500 text-xs md:text-sm">{error}</p>}
        <div className="flex gap-2">
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 md:p-3 rounded-lg shadow-md hover:bg-blue-600 transition-colors duration-200 text-sm md:text-base"
          >
            Зберегти
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full bg-gray-500 text-white p-2 md:p-3 rounded-lg shadow-md hover:bg-gray-600 transition-colors duration-200 text-sm md:text-base"
          >
            Скасувати
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPostForm;
