"use client";
import { GetServerSideProps } from "next";
import fs from "fs";
import path from "path";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import PostForm from "../src/components/PostForm";
import PostList from "../src/components/PostList";
import InitializePosts from "../src/components/InitializePosts";
import { Post } from "../src/types";
import Navbar from "../src/components/Navbar";
import { RootState } from "../src/store";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const filePath = path.join(process.cwd(), "src/data/posts.json");
  const initialPosts: Post[] = fs.existsSync(filePath)
    ? JSON.parse(fs.readFileSync(filePath, "utf-8"))
    : [];
  return { props: { initialPosts } };
};

export default function Home({ initialPosts }: { initialPosts: Post[] }) {
  const router = useRouter();
  const { currentUser } = useSelector((state: RootState) => state.blog);

  useEffect(() => {
    if (!currentUser) {
      router.push("/register");
    }
  }, [currentUser, router]);

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 p-6">
      <Navbar />
      <div className="max-w-7xl mx-auto">
        <InitializePosts initialPosts={initialPosts} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-200px)]">
          <div className="bg-white rounded-xl shadow-lg p-6 overflow-auto scrollbar-hide w-full">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Написати пост
            </h2>
            <PostForm />
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 overflow-auto scrollbar-hide w-full">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Усі пости
            </h2>
            <PostList />
          </div>
        </div>
      </div>
    </div>
  );
}
