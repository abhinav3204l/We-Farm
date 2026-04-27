import { useEffect, useState } from "react";
import API from "../api";

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");

  const load = async () => {
    const res = await API.get("/posts");
    setPosts(res.data);
  };

  useEffect(() => { load(); }, []);

  const post = async () => {
    if (!content) return;
    await API.post("/posts", { content, role: "farmer" });
    setContent("");
    load();
  };

  return (
    <div className="page">
      <h2>🌾 Farmer Feed</h2>

      <textarea
        placeholder="మీ వ్యవసాయ ప్రశ్నను అడగండి..."
        value={content}
        onChange={e => setContent(e.target.value)}
      />
      <button onClick={post}>Send</button>

      {posts.map(p => (
        <div key={p._id} style={{
          background: "#fff",
          padding: 10,
          marginTop: 10,
          borderRadius: 8
        }}>
          {p.content}
        </div>
      ))}
    </div>
  );
}
