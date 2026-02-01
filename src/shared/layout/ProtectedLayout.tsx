/* Layout for authenticated pages with a shared header and their child route. */

import { Outlet } from "react-router-dom";
import Header from "../ui/Header";

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
