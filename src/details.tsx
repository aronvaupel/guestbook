import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
type Post = {
  id?: number;
  title: string;
  content: string;
};

const Details = () => {
  const [post, setPost] = useState<Post>({
    title: "",
    content: "",
  });
  const { id } = useParams();

  useEffect(() => {
    fetch(`http://localhost:3001/posts/${id}`)
      .then((res) => res.json())
      .then((json) => setPost(json));
  }, []);

  useEffect(() => {
    console.log(post);
  }, [post]);

  return (
    <div className="h-screen flex flex-col justify-center items-start">
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </div>
  );
};
export default Details;
