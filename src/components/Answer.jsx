const Answers = ({ ans }) => {
  // Heading
  if (ans.includes(":") && !ans.startsWith(":")) {
    const parts = ans.split(":");

    return (
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-yellow-400">{parts[0]}</h1>

        <p className="text-white">{parts.slice(1).join(":")}</p>
      </div>
    );
  }

  return <p className="dark:text-white text-black">{ans}</p>;
};

export default Answers;
