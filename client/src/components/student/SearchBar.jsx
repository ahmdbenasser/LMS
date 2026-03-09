import { useState } from "react";
import { assets } from "../../assets/assets";
import { useNavigate } from "react-router-dom";
const SearchBar = () => {
  const navigate = useNavigate();
  const [input, setInput] = useState("");

  const onSearchHandler = (e) => {
    e.preventDefault();
    navigate("/course-list/" + input);
  };
  return (
    <form
      onSubmit={onSearchHandler}
      className="max-w-xl w-full md:h-14 h-12 flex items-center bg-white border border-gray-500/20 rounded"
    >
      <img className="md:w-auto w-10 px-3" src={assets.search_icon} alt="" />
      <input
        onChange={(e) => setInput(e.target.value)}
        value={input}
        className="w-full h-full outline-none text-gray-500/80"
        type="text"
        placeholder="Search for courses"
      />
      <button
        className="bg-blue-600 rounded text-white md:px-10 px-7 md:py-3 py-2 mx-1"
        type="submit"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;
