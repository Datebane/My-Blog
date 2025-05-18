import { GetServerSideProps } from "next";
import fs from "fs";
import path from "path";
import PostDetail from "../../src/components/PostDetail";
import { Post } from "../../src/types";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = context.params?.id as string;
  const filePath = path.join(process.cwd(), "src/data/posts.json");
  let posts: Post[] = [];

  try {
    if (fs.existsSync(filePath)) {
      const rawData = fs.readFileSync(filePath, "utf-8");
      posts = JSON.parse(rawData);
    } else {
      console.log("getServerSideProps - File not found, creating empty array");
      fs.writeFileSync(filePath, "[]"); // Створюємо порожній файл, якщо його немає
    }
  } catch (error) {
    console.error(
      "getServerSideProps - Error reading or parsing posts.json:",
      error
    );
    posts = [];
  }

  console.log("getServerSideProps - filePath:", filePath);
  console.log("getServerSideProps - file exists:", fs.existsSync(filePath));
  console.log(
    "getServerSideProps - raw posts data:",
    fs.existsSync(filePath)
      ? fs.readFileSync(filePath, "utf-8")
      : "File not found"
  );
  console.log("getServerSideProps - parsed posts:", posts);
  console.log("getServerSideProps - id:", id);

  const post = posts.find((p) => p.id === id) || null;

  console.log("getServerSideProps - found post:", post);

  if (!post) {
    console.log("getServerSideProps - No post found for id:", id);
  }

  return { props: { post } };
};

const PostPage = ({ post: initialPost }: { post: Post | null }) => {
  console.log("PostPage - initialPost:", initialPost);

  if (!initialPost) {
    return (
      <div className="text-center p-4 text-gray-600">Пост не знайдено</div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 p-6">
      <PostDetail post={initialPost} />
    </div>
  );
};

export default PostPage;
