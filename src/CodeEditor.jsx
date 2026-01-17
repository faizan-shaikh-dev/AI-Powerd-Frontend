import { useEffect, useState } from "react";
import { Editor } from "@monaco-editor/react";
import ReactMarkdown from "react-markdown";
import Navbar from "./Navbar";

const CodeEditor = () => {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);

  /* LOAD SAVED DATA */
  useEffect(() => {
    setCode(localStorage.getItem("revivr_code") || "");
    setLanguage(localStorage.getItem("revivr_lang") || "javascript");
    setReview(localStorage.getItem("revivr_review") || "");
  }, []);

  /* SAVE DATA */
  useEffect(() => {
    localStorage.setItem("revivr_code", code);
    localStorage.setItem("revivr_lang", language);
    localStorage.setItem("revivr_review", review);
  }, [code, language, review]);

  /* REVIEW HANDLER */
  const handleReview = async () => {
    if (!code.trim()) {
      alert("Write some code first");
      return;
    }

    setLoading(true);
    setReview("");

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/review`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code, language }),
        }
      );

      if (!res.ok) {
        throw new Error(`Server error ${res.status}`);
      }

      const data = await res.json();
      setReview(data.review);
    } catch (err) {
      setReview(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setCode("");
    setReview("");
    localStorage.clear();
  };

  return (
    <>
      <Navbar onClearReview={handleClear} />

      <div className="pt-16 flex flex-col lg:flex-row min-h-screen bg-[#0a192f] text-white">
        {/* EDITOR */}
        <div className="flex-1 relative border-r border-cyan-900">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="absolute top-3 right-5 bg-[#0f2027] border border-cyan-700 px-3 py-1 rounded"
          >
            <option value="javascript">JavaScript</option>
            <option value="jsx">React (JSX)</option>
            <option value="typescript">TypeScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
          </select>

          <Editor
            height="calc(100vh - 160px)"
            language={language}
            theme="vs-dark"
            value={code}
            onChange={(v) => setCode(v || "")}
            options={{ minimap: { enabled: false } }}
          />

          <div className="flex justify-center my-4">
            <button
              onClick={handleReview}
              disabled={loading}
              className="bg-cyan-500 hover:bg-cyan-400 text-black px-6 py-2 rounded font-semibold"
            >
              {loading ? "Analyzing..." : "Review Code"}
            </button>
          </div>
        </div>

        {/* REVIEW */}
        <div className="flex-1 p-6 bg-[#0f2130] overflow-auto">
          <h3 className="text-cyan-400 font-semibold mb-3">AI Review</h3>
          <div className="bg-[#0b1a25] p-4 rounded border border-cyan-900 min-h-[70vh]">
            {review ? (
              <ReactMarkdown>{review}</ReactMarkdown>
            ) : (
              <p className="text-gray-500 italic">
                Submit code to get feedback
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CodeEditor;
