import { Link } from "react-router-dom";
import LogoutButton from "./LogoutButton";

export default function Header() {

  return (
    <header className="w-full border-b bg-white">
      {/* =======================
          TOP SECTION
         ======================= */}
      <div className="flex items-center justify-between px-6 py-4">
        {/* App Name */}
        <h1 className="text-xl font-bold">Load Tracker</h1>

        {/* User / Account Actions */}
        <div className="flex items-center gap-4">
          <Link
            to="/settings"
            className="text-sm px-3 py-2 rounded hover:bg-gray-100"
          >
            Account Settings
          </Link>
          <LogoutButton />
        </div>
      </div>

      {/* =======================
          BOTTOM NAV
         ======================= */}
      <nav className="flex items-center gap-6 px-6 py-3 border-t text-sm">
        <Link to="/dashboard" className="hover:underline">
          Dashboard
        </Link>
        <Link to="/sessions/log" className="hover:underline">
          Log New Session
        </Link>
        <Link to="/sessions/history" className="hover:underline">
          Session History
        </Link>
        <Link to="/wellness/log" className="hover:underline">
          Log New Wellness Scores
        </Link>
        <Link to="/wellness/history" className="hover:underline">
          Wellness History
        </Link>
      </nav>
    </header>
  );
}
