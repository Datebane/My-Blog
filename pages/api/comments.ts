import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import { Post } from "../../src/types";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { postId, comment } = req.body;

    const filePath = path.join(process.cwd(), "src/data/posts.json");
    const posts: Post[] = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    const postIndex = posts.findIndex((p) => p.id === Number(postId));
    if (postIndex === -1) {
      return res.status(404).json({ message: "Post not found" });
    }

    const newComment = {
      ...comment,
      id: posts[postIndex].comments.length + 1,
      date: new Date().toISOString().split("T")[0],
    };

    posts[postIndex].comments.push(newComment);
    fs.writeFileSync(filePath, JSON.stringify(posts, null, 2));

    return res
      .status(200)
      .json({ message: "Comment added", post: posts[postIndex] });
  }

  res.status(405).json({ message: "Method not allowed" });
}
