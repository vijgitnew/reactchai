import { useState } from "react";
import "./App.css";
import Answers from "./components/Answer";

function App() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState([]);
  const [RecentHistory, setRecentHistory] = useState(JSON.parse(localStorage.getItem("history")));

  const URL = "https://api.groq.com/openai/v1/chat/completions";

  const API_KEY = import.meta.env.VITE_API_KEY;

  const askQuestion = async () => {
   if (localStorage.getItem("history")) {

  let history =
    JSON.parse(localStorage.getItem("history"));

  history = [question, ...history];

  localStorage.setItem(
    "history",
    JSON.stringify(history)
  );

  setRecentHistory(history);

} else {

  localStorage.setItem(
    "history",
    JSON.stringify([question])
  );

  setRecentHistory([question]);

}
    if (!question.trim()) return;


    const payload = {
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: question,
        },
      ],
    };

    try {
      const response = await fetch(URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      const aiResponse = data.choices[0].message.content;
      let datastring = aiResponse.split("*");
      datastring = datastring.map((item) => item.trim());
      setAnswer((prev) => [
        ...prev,
        { type: "q", text: question },
        { type: "a", text: aiResponse },
      ]);
    } catch (error) {
      console.log(error);
    }
  };
  console.log(RecentHistory);
  return (
    <div className="grid grid-cols-5 h-screen">
      <div className="col-span-1 bg-zinc-900 text-white p-5">
        <h1 className="sol-span-1 text-xl text-white bg-zinc-800 p-3 text-center" >Recent Search</h1>
<ul className="pl-5 text-left overflow-auto text-sm p-5" >

{
  RecentHistory &&
  RecentHistory.map((item, index) => (

    <li
      key={index}
      className="mb-2 text-white "
    >
      {item}
    </li>

  ))
}

</ul>
      </div>

      <div className="col-span-4 p-10 flex flex-col">
        <div className="flex-1 border rounded-2xl p-5 height-110 overflow-auto">
          <ul>
            {answer.map((item, index) => (
              <div
                key={index}
                className={item.type === "q" ? "flex justify-end" : ""}
              >
                {item.type === "q" ? (
                  <li className="text-right p-1 bg-zinc-700 border-zinc-700 rounded-3xl w-fit">
                    <Answers ans={item.text} />
                  </li>
                ) : Array.isArray(item.text) ? (
                  item.text.map((ansitem, ansindex) => (
                    <li key={ansindex} className="text-left p-2">
                      <Answers ans={ansitem} />
                    </li>
                  ))
                ) : (
                  <li className="text-left p-2">
                    <Answers ans={item.text} />
                  </li>
                )}
              </div>
            ))}
          </ul>
        </div>

        <div className="bg-zinc-800 text-white mt-5 p-2 rounded-full flex items-center">
          <input
            type="text"
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder="Ask anything..."
            className="flex-1 bg-transparent outline-none px-4 py-2"
          />

          <button
            onClick={askQuestion}
            className="bg-white text-black px-5 py-2 rounded-full"
          >
            Ask
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
