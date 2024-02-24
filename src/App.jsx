import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

const url = "https://render-express-test-gi1r.onrender.com";

function App() {
  const [data, setData] = useState([]);
  const [user, setUser] = useState("sam");

  useEffect(() => {
    getData();

    async function getData() {
      const res = await fetch(`${url}/${user}`);
      const data = await res.json();
      setData(data);
    }
  }, [user]);

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
              <li key={id}>{content}</li>
            ))}
        </ul>
      </div>
    </>
  );
}

export default App;
