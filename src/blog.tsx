import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Routes, Link } from "react-router-dom";
import GuestbookForm from "./guestbook";
import "./index.css";

export type Post = {
  id: number;
  title: string;
  content: string;
};

const Blog = (): JSX.Element => {
  const [blogposts, setBlogposts] = useState<Post[]>([]);

  useEffect(() => {
    fetch("http://localhost:3001/posts")
      .then((res) => res.json())
      .then((json) => setBlogposts(json));
  }, []);

  useEffect(() => {
    console.log(blogposts);
  }, [blogposts]);

  return (
    <div className="m-12">
      <h1 className="text-center text-6xl text-slate-900 mb-12">Pretty Blog</h1>
      {blogposts.map(({ id, title, content }) => (
        <div key={`${id}`}>
          <h2 className="text-3xl text-slate-600 mt-6 mb-3">{title}</h2>
          <p className="text-lg text-slate-800 border-t-2 p-2">{content}</p>
          <Link to={`/${id}`}>
            <div className="flex justify-end">
              <button className="bg-slate-600 hover:bg-slate-400 text-white rounded-lg px-5 py-2">
                more
              </button>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
};
export default Blog;
