import { useSearchParams, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function ResetPassword() {
  const [params] = useSearchParams();
  const token = params.get("token");
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleReset() {
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, newPassword: password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.message);
      return;
    }

    navigate("/login");
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-96 space-y-4">
        <h2 className="text-2xl font-semibold text-center">New Password</h2>

        <input
          type="password"
          className="w-full border rounded px-3 py-2"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          onClick={handleReset}
          className="w-full py-2 rounded bg-black text-white"
        >
          Reset Password
        </button>
      </div>
    </div>
  );
}
