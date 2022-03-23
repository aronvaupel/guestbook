import React, { FormEvent, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

//-------------TYPES DEFINIEREN -----//
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

type Reply = {
  id: number;
  author: string;
  text: string;
};

type CommentFormState = Omit<Comment, "id">;
type RepliesFormState = Omit<Reply, "id">;

//-------------COMPONENTE ERSTELLEN---------------//

const Details = () => {
  //----------HOOKS SCHREIBEN---------------//

  const [post, setPost] = useState<Post>({
    // useState-Hook & Destructuring Poststate
    title: "",
    content: "",
    comments: [],
  });
  const { id, postId } = useParams(); // useParams-Hook & Destructuring URL Parameter holen

  const [comments, setComments] = useState<CommentFormState[]>([]); // useState-Hook Kommentarstate
  const [commentFormState, setCommentFormState] = useState<CommentFormState>({
    //useState-Hook Kommentarfeldstate
    author: "",
    text: "",
  });
  const [replies, setReplies] = useState<Reply[]>([]); // useState-Hook Antwortstate
  const [isActive, setIsActive] = useState(false);

  const [repliesFormState, setRepliesFormState] = useState<RepliesFormState>({
    // useState-Hook Antwortfeldstate
    author: "",
    text: "",
  });

  useEffect(() => {
    // useEffect-Hook Contents Laden aus db.json
    fetch(`http://localhost:3001/posts/${id}`)
      .then((res) => res.json())
      .then((json) => {
        setPost(json);
        console.log(json);
      });
    fetch(`http://localhost:3001/posts/${id}/comments`)
      .then((res) => res.json())
      .then((json) => setComments(json));
    fetch(`http://localhost:3001/comments/${postId}/replies`)
      .then((res) => res.json())
      .then((json) => setReplies(json));
  }, []); // [] = einaml am Anfang

  //-------------FUNKTIONS-SECTION--------------//

  function handleSubmitComment(event: FormEvent) {
    // Kommentar-Formular abschicken
    //
    event.preventDefault(); // Verhindert Reload
    setCommentFormState({ ...commentFormState });
    fetch(`http://localhost:3001/posts/${id}/comments`, {
      // Kommentare in db.json "POSTEN"
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

  function handleSubmitReply(event: FormEvent) {
    event.preventDefault();
    setRepliesFormState({ ...repliesFormState });
    fetch(`http://localhost:3001/comments/${postId}/replies`, {
      // Replies werden in db.json gepostet
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(repliesFormState),
    })
      .then((repliesFormState) => repliesFormState.json())
      .then((repliesFormState) => {
        console.log("Success:", repliesFormState);
        setReplies([...replies, repliesFormState]);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  const openReplyForm = () => {
    //------TOGGLE TRUE/FALSE------//
    setIsActive(!isActive);
  };

  //------------STYLING/MARKUP Sektion------------------//
  return (
    <div className="h-screen flex flex-col justify-start items-start p-10">
      <h1 className="text-center text-6xl text-slate-900 mb-12">
        {post.title}
      </h1>
      <p className="text-lg text-slate-800 border-t-2 p-2">{post.content}</p>

      {comments.map(
        (
          comment,
          id // Erstellen von Markup aus Array-Elementen (.map)
        ) => (
          <div
            className="flex flex-col justify-between items-start w-1/4"
            key={id}
          >
            <div className="flex flex-col gap-3">
              <h2 className="text-lg m-5 font-semibold">
                Comment from: {comment.author}
              </h2>
              <p>{comment.text}</p>
            </div>
            <div className="flex justify-end w-full">
              <button
                onClick={openReplyForm}
                className="bg-orange-500 hover:bg-red-500 rounded-lg my-4 p-1"
              >
                reply
              </button>

              {replies.map((reply, id) => (
                <div key={id}>
                  <h2>Reply from: {reply.author} </h2>
                  <p className="text-lg">Reply: {reply.text}</p>
                </div> // Daten einfügen aus einzelnen Array-Elementen
              ))}
            </div>
          </div>
        )
      )}

      {/* ---------FORMULAR-SEKTION---------------- */}

      <form onSubmit={handleSubmitComment}>
        <input
          value={commentFormState.author}
          // Controlled Input = wenn useState als Input verwendet wird
          className="w-full h-5 my-4"
          placeholder="Enter your name"
          type="text"
          onChange={
            (
              event // spread Operator (...) + Überschreiben von author Key
            ) =>
              setCommentFormState({
                ...commentFormState,
                author: event.target.value,
              }) //On-Change: Event Listener für input/veränderung im Kommentier-Input (Autorspalte)
          }
        />
        <textarea
          className="w-full  my-4"
          value={commentFormState.text}
          rows={6}
          placeholder="Enter a message"
          onChange={
            (
              event // spread Operator (...) + Überschreiben von Text Key
            ) =>
              setCommentFormState({
                ...commentFormState,
                text: event.target.value, // target = Text-Area, value = text
              }) //On-Change: Event Listener für input/veränderung im Kommentier-Input (Textfeld)
          }
        />
        <button className="bg-red-300 hover:bg-red-500 rounded-lg my-4">
          Comment
        </button>
      </form>
      {isActive ? ( //TERNARY CONDITIONAL RENDERING IF/ELSE SHORTFORM
        <form onSubmit={handleSubmitReply}>
          <input
            value={repliesFormState.author}
            className="w-full h-5 my-4"
            placeholder="Enter your name"
            type="text"
            onChange={(event) =>
              setRepliesFormState({
                ...repliesFormState,
                author: event.target.value,
              })
            }
          />
          <textarea
            className="w-full  my-4"
            value={repliesFormState.text}
            rows={6}
            placeholder="Enter a message"
            onChange={(event) =>
              setRepliesFormState({
                ...repliesFormState,
                text: event.target.value,
              })
            }
          />
          <button className="bg-red-300 hover:bg-red-500 rounded-lg my-4">
            Reply
          </button>
        </form>
      ) : null}
    </div>
  );
};

export default Details;
