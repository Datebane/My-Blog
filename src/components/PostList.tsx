import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import Link from "next/link";
import { deletePost, setFilter } from "../store/blogSlice";
import { RootState } from "../store";
import EditPostForm from "./EditPostForm";

const PostList = () => {
  const dispatch = useDispatch();
  const { posts, filter, currentUser } = useSelector(
    (state: RootState) => state.blog
  );
  const [editingPostId, setEditingPostId] = useState<string | null>(null);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setFilter(e.target.value));
  };

  const handleDeletePost = async (id: string) => {
    try {
      const response = await fetch(`/api/deletePost?id=${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Помилка при видаленні поста");
      dispatch(deletePost(id));
    } catch (error) {
      console.error("Помилка:", error);
    }
  };

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(filter.toLowerCase()) ||
      post.content.toLowerCase().includes(filter.toLowerCase()) ||
      post.author.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div>
      <input
        type="text"
        placeholder="Пошук за заголовком, вмістом або автором..."
        onChange={handleFilterChange}
        className="w-full p-3 mb-6 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
      />
      {filteredPosts.length === 0 ? (
        <p className="text-gray-500 text-center">
          Немає постів для відображення.
        </p>
      ) : (
        <div className="space-y-4">
          {filteredPosts.map((post) => {
            console.log("PostList - post.id:", post.id); // Додаткове логування
            return (
              <div
                key={post.id}
                className="p-4 bg-gray-50 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
              >
                <h3 className="text-xl font-bold text-gray-800">
                  {post.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {post.author} - {post.date}
                </p>
                <p className="mt-2 text-gray-700">
                  {post.content.substring(0, 100)}...
                </p>
                <div className="mt-3 flex justify-between items-center">
                  <Link
                    href={`/post/${post.id}`}
                    className="text-blue-500 hover:underline font-medium"
                  >
                    Читати та коментувати
                  </Link>
                  {currentUser?.username === post.author && (
                    <>
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="text-red-500 hover:text-red-700 font-medium transition-colors duration-200 mr-2"
                      >
                        Видалити
                      </button>
                      <button
                        onClick={() => setEditingPostId(post.id)}
                        className="text-yellow-500 hover:text-yellow-700 font-medium transition-colors duration-200"
                      >
                        Редагувати
                      </button>
                    </>
                  )}
                </div>
                {editingPostId === post.id && (
                  <EditPostForm
                    post={post}
                    onClose={() => setEditingPostId(null)}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PostList;
