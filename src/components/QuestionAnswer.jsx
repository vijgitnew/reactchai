import Answers from "./Answer";
const QuestionAnswer = ({item, index}) =>{
return (
 <div
                key={index}
                className={item.type === "q" ? "flex justify-end" : ""}
              >
                {item.type === "q" ? (
                  <li className="bg-zinc-700 text-white m p-2 rounded-full w-fit">
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

)

}


export default QuestionAnswer;