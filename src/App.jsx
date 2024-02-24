import { useState, useEffect, Fragment } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

const url = "https://express-note-taking-app-k3kv.onrender.com"; // new url to backend API (with DELETE route)

function App() {
  const [data, setData] = useState([]);
  const [user, setUser] = useState("sam");
  const [note, setNote] = useState("");
  const [message, setMessage] = useState("");
  const [noteIdToEdit, setNoteIdToEdit] = useState("");
  const [updatedNote, setUpdatedNote] = useState("");
  const selectedUserId = data[0]?.userId; // derived state (derived from data)

  useEffect(() => {
    getData();

    async function getData() {
      const res = await fetch(`${url}/${user}`);
      const data = await res.json();
      setData(data);
    }
  }, [user]);

  async function handleSubmit(e) {
    e.preventDefault();
    const res = await fetch(`${url}/${user}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content: note }),
    });
    const { id, message } = await res.json();
    setMessage(message);
    setNote("");
    setData([
      ...data,
      { id, content: note, name: user, userId: selectedUserId },
    ]);
  }

  async function deleteNote(noteId) {
    const res = await fetch(`${url}/${user}/${noteId}`, {
      method: "DELETE",
    });
    const { message } = await res.json();
    setMessage(message);
    setData(data.filter((note) => note.id != noteId));
  }

  function toggleEditMode(noteId, noteToEdit) {
    noteIdToEdit ? setNoteIdToEdit("") : setNoteIdToEdit(noteId);
    if (noteToEdit) setUpdatedNote(noteToEdit);
    else setUpdatedNote("");
  }

  async function editNote(updatedNote) {
    setUpdatedNote(updatedNote);
  }

  async function handleEdit(noteId) {
    const res = await fetch(`${url}/${user}/${noteId}`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content: updatedNote }),
    });
    const { message } = await res.json();
    setMessage(message);
    toggleEditMode();
    setData(
      data.map((note) =>
        note.id == noteId ? { ...note, content: updatedNote } : note
      )
    );
  }

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Frontend + Backend</h1>
      <div className="card">
        <div>
          <button onClick={() => setUser("eric")}>Eric</button>
          <button onClick={() => setUser("sam")}>Sam</button>
        </div>
        <ul>
          notes from the backend:
          {data
            ?.sort((a, b) => a.id - b.id)
            .map(({ id, content }) => (
              <Fragment key={id}>
                {noteIdToEdit === id ? (
                  <li>
                    <input
                      type="text"
                      value={updatedNote}
                      onChange={(e) => editNote(e.target.value)}
                    />
                    <span>
                      <button onClick={() => handleEdit(id)}>Save</button>
                      <button onClick={toggleEditMode}>Cancel</button>
                    </span>
                  </li>
                ) : (
                  <li>
                    <span onClick={() => toggleEditMode(id, content)}>
                      {content}{" "}
                    </span>
                    <span>
                      <button onClick={() => deleteNote(id)}>X</button>
                    </span>
                  </li>
                )}
              </Fragment>
            ))}
        </ul>
        <div>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
            <button type="submit">Add</button>
          </form>
          <h2>response from the server:</h2>
          <p>{message}</p>
        </div>
      </div>
    </>
  );
}

export default App;
