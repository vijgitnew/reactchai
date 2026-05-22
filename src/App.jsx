import { useEffect, useState, useRef } from "react";
import "./App.css";
import Answers from "./components/Answer";
import RecentSearch from "./components/recentserch";
import QuestionAnswer from "./components/QuestionAnswer";
function App() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState([]);
  const [RecentHistory, setRecentHistory] = useState(
    JSON.parse(localStorage.getItem("history")),
  );
  const [selectedHistory, setSelectedHistory] = useState("");
  const scrolltoAns = useRef();
  const [loader, setloader] = useState(false);

  const askQuestion = async () => {
    if (!question && !selectedHistory) {
      return false;
    }
    if (question) {
      if (localStorage.getItem("history")) {
        let history = JSON.parse(localStorage.getItem("history"));

        history = [question, ...history];

        localStorage.setItem("history", JSON.stringify(history));

        setRecentHistory(history);
      } else {
        localStorage.setItem("history", JSON.stringify([question]));

        setRecentHistory([question]);
      }
    }
    if (!question.trim() && !selectedHistory.trim()) return;

    const payload = {
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: question || selectedHistory,
        },
      ],
    };
    setloader(true);
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
        { type: "q", text: question ? question : selectedHistory },
        { type: "a", text: aiResponse },
      ]);
    } catch (error) {
      console.log(error);
    }
    setQuestion("");
    setTimeout(() => {
      scrolltoAns.current.scrollTop = scrolltoAns.current.scrollHeight;
    }, 500);
      setloader(false);
  };

 
  const isEnter = (event) => {
    console.log(event.key);
    if (event.key === "Enter") {
      askQuestion();
    }
  };
  useEffect(() => {
    console.log(selectedHistory);
    askQuestion();
  }, [selectedHistory]);

  // dark mode feature
const [darkMode, setDarkMode] = useState("dark");

useEffect(() => {

  if (darkMode === "dark") {

    document.documentElement.classList.add("dark");

  } else {

    document.documentElement.classList.remove("dark");

  }

}, [darkMode]);
  return (
    <div className={darkMode?'dark':'light'}>
    <div className="grid grid-cols-5 h-screen">
      <select className="fixed text-white bottom-0" onChange={(event)=> setDarkMode(event.target.value) } >
        <option value="dark">Dark</option>
        <option value="light">Light</option>
      </select>
      <RecentSearch RecentHistory={RecentHistory} setRecentHistory={setRecentHistory}  setSelectedHistory={setSelectedHistory} />

      <div className="col-span-4 p-10 flex flex-col">
        <h4 className="text-4xl bg-clip-text text-transparent mb-5 bg-gradient-to-r from-green-700 to-purple-500 text-center">Hello User, Ask me Anything</h4>
       
     
        <div
          ref={scrolltoAns}
          className=" border rounded-2xl p-5 h-[760px] scrollbar-thin overflow-auto"
        >
            {
        loader?  <div
          className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-[#332d2d] motion-reduce:animate-[spin_1.5s_linear_infinite]"
          role="status"
        >
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
            Loading...
          </span>
        </div>:null
        }
          <ul>
            {answer.map((item, index) => (
             <QuestionAnswer item={item} index={index} />
            ))}
          </ul>
        </div>

        <div className="bg-zinc-800 text-white mt-5 p-2 rounded-full flex items-center">
          <input
            type="text"
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder="Ask anything..."
            onKeyDown={isEnter}
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
    </div>
  );
}

export default App;
