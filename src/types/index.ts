export interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  comments: Comment[];
}

export interface Comment {
  id: number;
  postId: number;
  content: string;
  author: string;
  date: string;
}

export interface User {
  username: string;
  id: string; // Унікальний ідентифікатор
  email: string; // Додаємо email
  password: string; // Додаємо хеш пароля
}
