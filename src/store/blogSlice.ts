import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Post, User } from "../types";

interface BlogState {
  posts: Post[];
  filter: string;
  currentUser: User | null;
  users: User[];
}

const initialState: BlogState = {
  posts: [],
  filter: "",
  currentUser: null,
  users:
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("users") || "[]")
      : [],
};

const savePostsToLocalStorage = (posts: Post[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("posts", JSON.stringify(posts));
  }
};

const saveUsersToLocalStorage = (users: User[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("users", JSON.stringify(users));
  }
};

const blogSlice = createSlice({
  name: "blog",
  initialState,
  reducers: {
    addPost: (
      state,
      action: PayloadAction<{ title: string; content: string; author: string }>
    ) => {
      const newPost: Post = {
        id: state.posts.length + 1,
        title: action.payload.title,
        content: action.payload.content,
        author: action.payload.author,
        date: new Date().toISOString().split("T")[0],
        comments: [],
      };
      state.posts.push(newPost);
      savePostsToLocalStorage(state.posts);
    },

    deletePost: (state, action: PayloadAction<number>) => {
      const post = state.posts.find((p) => p.id === action.payload);
      if (post && state.currentUser?.username === post.author) {
        state.posts = state.posts.filter((p) => p.id !== action.payload);
        savePostsToLocalStorage(state.posts);
      }
    },

    editPost: (
      state,
      action: PayloadAction<{ id: number; title: string; content: string }>
    ) => {
      const post = state.posts.find((p) => p.id === action.payload.id);
      if (post && state.currentUser?.username === post.author) {
        post.title = action.payload.title;
        post.content = action.payload.content;
        savePostsToLocalStorage(state.posts);
      }
    },

    // 🛠️ ОНОВЛЕНО: PayloadAction приймає лише content та author
    addComment: (
      state,
      action: PayloadAction<{
        postId: number;
        comment: { content: string; author: string };
      }>
    ) => {
      const post = state.posts.find((p) => p.id === action.payload.postId);
      if (post) {
        const newComment = {
          ...action.payload.comment,
          id: post.comments.length + 1,
          date: new Date().toISOString().split("T")[0],
        };
        post.comments.push(newComment);
        savePostsToLocalStorage(state.posts);
      }
    },

    setFilter: (state, action: PayloadAction<string>) => {
      state.filter = action.payload;
    },

    initializePosts: (state, action: PayloadAction<Post[]>) => {
      state.posts = action.payload;
      savePostsToLocalStorage(state.posts);
    },

    setCurrentUser: (state, action: PayloadAction<User | null>) => {
      state.currentUser = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem("currentUser", JSON.stringify(action.payload));
      }
    },

    registerUser: (state, action: PayloadAction<User>) => {
      state.users.push(action.payload);
      saveUsersToLocalStorage(state.users);
    },
  },
});

export const {
  addPost,
  deletePost,
  editPost,
  addComment,
  setFilter,
  initializePosts,
  setCurrentUser,
  registerUser,
} = blogSlice.actions;

export default blogSlice.reducer;
