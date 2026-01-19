import { Link } from "react-router-dom";

export default function Entry() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6">
      <h1 className="text-4xl font-bold">LOAD TRACKER</h1>
      <p className="text-gray-500">Build. Track. Progress.</p>

      <div className="flex gap-4">
        <Link to="/login" className="px-6 py-2 rounded-xl bg-black text-white">
          Login
        </Link>
        </div>
        <div className="flex gap-4">
        <Link to="/signup" className="px-6 py-2 rounded-xl">
          Sign Up
        </Link>
      </div>
    </div>
  );
}
