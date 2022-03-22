import { FormEvent, useEffect, useState } from "react";

type FormState = {
  name: string;
  email: string;
  text: string;
};

const GuestbookForm = (): JSX.Element => {
  const [formState, setFormState] = useState<FormState>({
    name: "",
    email: "",
    text: "",
  });
  // const entries: FormState[] = [];
  const [entries, setEntries] = useState<FormState[]>([]);
  useEffect(() => {
    fetch("http://localhost:3001/guests")
      .then((response) => response.json())
      .then((data) => setEntries(data))
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setFormState({ ...formState, name: formState.name.toLowerCase() });
    fetch("http://localhost:3001/guests", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formState),
    })
      .then((formState) => formState.json())
      .then((formState) => {
        console.log("Success:", formState);
        setEntries([...entries, formState]);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  return (
    <div className=" min-h-screen flex flex-col justify-center items-center">
      <form className="flex flex-col w-1/3 h-1/2" onSubmit={handleSubmit}>
        <input
          value={formState.name}
          className="w-full h-5 my-4"
          placeholder="Enter your name"
          type="text"
          onChange={(event) =>
            setFormState({ ...formState, name: event.target.value })
          }
        />
        <input
          className="w-full h-5 my-4"
          placeholder="Enter your email"
          value={formState.email}
          type="email"
          onChange={(event) =>
            setFormState({ ...formState, email: event.target.value })
          }
        />
        <textarea
          className="w-full  my-4"
          value={formState.text}
          rows={6}
          placeholder="Enter a message"
          onChange={(event) =>
            setFormState({ ...formState, text: event.target.value })
          }
        />
        <button className="bg-red-300 hover:bg-red-500 rounded-lg my-4">
          Submit
        </button>
      </form>
      <pre>{JSON.stringify(formState, null, 2)}</pre>
      <div className="border-t-2 border-black w-full h-1"></div>
      <div className="border-t-2 border-black w-full h-1"></div>
      <ul>
        {entries.length
          ? entries.reverse().map((entry, id) => (
              <li key={id}>
                Name: {entry.name} <br />
                Email: {entry.email} <br />
                Message: {entry.text}
              </li>
            ))
          : null}
      </ul>
    </div>
  );
};

export default GuestbookForm;
