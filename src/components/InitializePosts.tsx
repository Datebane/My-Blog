"use client";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { initializePosts } from "../store/blogSlice";
import { Post } from "../types";

interface InitializePostsProps {
  initialPosts: Post[];
}

const InitializePosts = ({ initialPosts }: InitializePostsProps) => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Завантажуємо пости з localStorage, якщо є, інакше використовуємо initialPosts
    const savedPosts =
      typeof window !== "undefined" ? localStorage.getItem("posts") : null;
    const postsToInitialize = savedPosts
      ? JSON.parse(savedPosts)
      : initialPosts;
    dispatch(initializePosts(postsToInitialize));
  }, [dispatch, initialPosts]);

  return null;
};

export default InitializePosts;
