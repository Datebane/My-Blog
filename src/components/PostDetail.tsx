import CommentForm from "./CommentForm";
import { Post } from "../types";

interface PostDetailProps {
  post: Post | null;
}

const PostDetail = ({ post: initialPost }: PostDetailProps) => {
  console.log("PostDetail - initialPost:", initialPost);

  if (!initialPost) {
    return (
      <div className="text-center p-4 text-gray-600">Пост не знайдено</div>
    );
  }

  // Додаткове логування для відладки
  console.log("PostDetail - rendering post:", initialPost);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg my-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-3">
        {initialPost.title}
      </h2>
      <p className="text-gray-600 mb-4">
        {initialPost.author} - {initialPost.date}
      </p>
      <p className="text-gray-700 leading-relaxed">{initialPost.content}</p>
      <div className="mt-6">
        <h3 className="text-xl font-semibold text-gray-700 mb-3">Коментарі</h3>
        {initialPost.comments.length === 0 ? (
          <p className="text-gray-500">Ще немає коментарів.</p>
        ) : (
          <div className="space-y-3">
            {initialPost.comments.map((comment) => (
              <div
                key={comment.id}
                className="p-3 bg-gray-50 rounded-lg shadow-sm"
              >
                <p className="text-gray-700">{comment.content}</p>
                <p className="text-gray-600 text-sm mt-1">
                  {comment.author} - {comment.date}
                </p>
              </div>
            ))}
          </div>
        )}
        <CommentForm postId={initialPost.id} />
      </div>
    </div>
  );
};

export default PostDetail;
