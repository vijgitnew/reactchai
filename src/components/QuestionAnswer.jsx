import Answers from "./Answer";
const QuestionAnswer = ({item, index}) =>{
return (
 <div
                key={index}
                className={item.type === "q" ? "flex justify-end" : ""}
              >
                {item.type === "q" ? (
                  <li className=" bg-white
    dark:bg-zinc-800
    text-black
    dark:text-zinc-100
    px-5
    py-4
    rounded-2xl
    shadow-sm
    border
    border-zinc-200
    dark:border-zinc-700
    mb-4
    leading-7">
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