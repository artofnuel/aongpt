import "./normal.css";
import "./App.css";
import { BsFillPatchPlusFill, BsFillSendFill } from "react-icons/bs";
import { SiDwavesystems } from "react-icons/si";
import { useState, useEffect } from "react";

function App() {
  // add state for input and chat log

  const [models, setModels] = useState([]);
  const [currentModels, setCurrentModels] = useState("ada");
  console.log(currentModels);

  const [input, setInput] = useState("");
  const [chatLog, setChatLog] = useState([
    {
      user: "me",
      message: "I am the User",
    },
    {
      user: "aon",
      message: "I am ChatAON, How can I help you today?",
    },
  ]);

  // currently working

  const handleSubmit = async (e) => {
    e.preventDefault();

    let newChatLog = [...chatLog, { user: "me", message: `${input}` }];
    setInput("");
    setChatLog(newChatLog);

    const messages = newChatLog.map((data) => data.message).join("\n");

    const response = await fetch("http://localhost:3080/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: messages,
        currentModels,
      }),
    });

    const data = await response.json();
    console.log(data.message);

    setChatLog([...newChatLog, { user: "aon", message: `${data.message}` }]);
  };

  const clearChat = () => {
    setChatLog([]);
  };

  const getEngines = async () => {
    const response = await fetch("http://localhost:3080/models");

    const data = await response.json();
    setModels(data.models);
  };

  useEffect(() => {
    getEngines();
  }, []);

  return (
    <div className="App">
      <aside className="sidemenu">
        <div className="side-menu-button" onClick={clearChat}>
          <BsFillPatchPlusFill className="side-menu-plus" size={"20px"} />
          New Chat
        </div>
        <div className="models">
          <select
            className="models-select"
            onChange={(e) => {
              setCurrentModels(e.target.value);
            }}
          >
            {models.map((model, index) => (
              <option key={model.id} value={model.id}>
                {model.id}
              </option>
            ))}
          </select>
        </div>
      </aside>

      <section className="chatbox">
        {/* The chat box */}

        <div className="chat-log">
          {chatLog.map((data, index) => (
            <ChatMessage key={index} data={data} />
          ))}
        </div>

        <div className="chat-input-position">
          <div className="chat-input-holder">
            <form onSubmit={handleSubmit}>
              <input
                className="chat-input-textarea"
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
              ></input>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

const ChatMessage = ({ data }) => {
  return (
    <div className="chat-message">
      <div className="chat-message-center">
        <div className={`avatar ${data.user == "aon" && "chataonavi"}`}></div>
        <div className="message">{data.message}</div>
      </div>
    </div>
  );
};

export default App;
