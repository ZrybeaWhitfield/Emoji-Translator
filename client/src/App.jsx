import { useState } from 'react'
import './App.css'

export default function App() {
  const [inputText, setInputText] = useState("");
  const [emojiPhrase, setEmojiPhrase] = useState("");
  const [error, setError] = useState("");
  const [loadingResponse, setLoadingResponse] = useState(false);


  const MAX_CHARS = 120;

  async function handleConvert() {
    setError("");
    setEmojiPhrase("");

    const trimmedInputText = inputText.trim();

    if (trimmedInputText.length === 0) {
      setError("Type a phrase first");
      return;
    }

    if (trimmedInputText.length > MAX_CHARS) {
      setError(`Keep it under ${MAX_CHARS} characters.`);
      return;
    }

    setLoadingResponse(true);
    try {
      const responseFromServer = await fetch("http://localhost:3001/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: trimmedInputText }),
      });

      const parsedResponse = await responseFromServer.json();
      if (!responseFromServer.ok) {
        setError(parsedResponse.error || "Something went wrong");
      }

      setEmojiPhrase(parsedResponse.emojiPhrase || "");
    } catch (error) {
      console.error(error);
      setError("Network error — is the server running?");
    } finally {
      setLoadingResponse(false);
    }


  }

  function handleClear() {
    setInputText("");
    setEmojiPhrase("");
    setError("");
  }

  return (
    <div className="app-container">
      <div className="page">
        <h1 className="title">Emoji Story Converter</h1>
        <p className="subtitle">Convert a short phrase and convert it to emojis!</p>

        <div className="card">
          <label className="label" htmlFor="phrase-input">
            Your phrase:
          </label>

          <textarea
            id="phrase-input"
            className="input"
            rows={3}
            placeholder='e.g., "Batman eats a burger"'
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            maxLength={MAX_CHARS}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleConvert();
              }
            }}
          />

          <div className="meta">
            <span className="counter">
              {inputText.length}/{MAX_CHARS}
            </span>
          </div>

          {error && <p className="error">{error}</p>}

          <div className="buttons">
            <button className="btn primary" onClick={handleConvert}>
              Convert
            </button>
            <button className="btn" onClick={handleClear}>
              Clear
            </button>
          </div>
        </div>

        <div className="output">
          <h2 className="outputTitle">Emoji Story</h2>
          <div className="outputBox">
            {loadingResponse
              ? "⏳ Converting..."
              : emojiPhrase
                ? emojiPhrase
                : "…"}
          </div>

        </div>
      </div>
    </div>
  );
}
