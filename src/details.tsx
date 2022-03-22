import React, { FormEvent, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

type Post = {
  id?: number;
  title: string;
  content: string;
  comments: Comment[];
};
type Comment = {
  id: number;
  author: string;
  text: string;
};

type CommentFormState = Omit<Comment, "id">;

const Details = () => {
  const [post, setPost] = useState<Post>({
    title: "",
    content: "",
    comments: [],
  });
  const { id } = useParams();

  const [comments, setComments] = useState<CommentFormState[]>([]);
  const [commentFormState, setCommentFormState] = useState<CommentFormState>({
    author: "",
    text: "",
  });

  useEffect(() => {
    fetch(`http://localhost:3001/posts/${id}`)
      .then((res) => res.json())
      .then((json) => {
        setPost(json);
        console.log(json);
      });
    fetch(`http://localhost:3001/posts/${id}/comments`)
      .then((res) => res.json())
      .then((json) => setComments(json));
  }, []);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setCommentFormState({ ...commentFormState });
    fetch(`http://localhost:3001/posts/${id}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(commentFormState),
    })
      .then((commentFormState) => commentFormState.json())
      .then((commentFormState) => {
        console.log("Success:", commentFormState);
        setComments([...comments, commentFormState]);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  return (
    <div className="h-screen flex flex-col justify-start items-start p-10">
      <h1 className="text-center text-6xl text-slate-900 mb-12">
        {post.title}
      </h1>
      <p className="text-lg text-slate-800 border-t-2 p-2">{post.content}</p>

      <form onSubmit={handleSubmit}>
        <input
          value={commentFormState.author}
          className="w-full h-5 my-4"
          placeholder="Enter your name"
          type="text"
          onChange={(event) =>
            setCommentFormState({
              ...commentFormState,
              author: event.target.value,
            })
          }
        />
        <textarea
          className="w-full  my-4"
          value={commentFormState.text}
          rows={6}
          placeholder="Enter a message"
          onChange={(event) =>
            setCommentFormState({
              ...commentFormState,
              text: event.target.value,
            })
          }
        />
        <button className="bg-red-300 hover:bg-red-500 rounded-lg my-4">
          Submit
        </button>
      </form>

      {comments.map((comment, id) => (
        <div key={id}>
          <h2>Comment from: {comment.author}</h2>
          <p>{comment.text}</p>
        </div>
      ))}
    </div>
  );
};
export default Details;
