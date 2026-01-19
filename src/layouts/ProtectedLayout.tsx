import { Outlet } from "react-router-dom";
import Header from "../components/Header";

export default function ProtectedLayout() {
  return (
      <div className="min-h-screen">
        <Header />
        <main className="p-6">
          <Outlet />
        </main>
      </div>
  );
}
