import { Brain } from "lucide-react";

const Navbar = ({ onClearReview }) => {
  return (
    <nav className="fixed top-0 left-0 w-full h-16 flex justify-between items-center px-8 bg-white/5 backdrop-blur z-50">
      <div className="flex items-center gap-2">
        <Brain className="text-cyan-400" />
        <h1 className="text-cyan-400 font-semibold text-xl">
          Revivr<span className="text-white">.AI</span>
        </h1>
      </div>

      <button
        onClick={onClearReview}
        className="bg-red-500 hover:bg-red-400 px-4 py-2 rounded text-white font-semibold"
      >
        Clear
      </button>
    </nav>
  );
};

export default Navbar;
