"use client";

import { useState } from "react";
import { supabase } from "@/app/supbaseClient";
import { useRouter } from "next/navigation";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function RegisterPage() {
  const [user, setUser] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const { error } = await supabase.auth.signUp(user);

    if (error) {
      setError(error.message);
    } else {
      setMessage("Success ✅");
      router.push("/login");
    }

    setLoading(false);
  };

  return (
    <div className="container d-flex justify-content-center align-items-center mt-3">
      <div
        className="border rounded  shadow p-5"
        style={{ width: "100%", maxWidth: "400px" }}
      >
        <h2 className="mb-4 text-success text-center">Register</h2>
        <form onSubmit={handleRegister}>
          <div className="mb-3">
            <label className="form-label">Your name</label>
            <input
              type="text"
              className="form-control"
              value={user.name}
              placeholder="your name.."
              onChange={(e) => setUser({ ...user, name: e.target.value })}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Your email</label>
            <input
              type="email"
              className="form-control"
              placeholder="you@example.com"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              required
            />
          </div>
          <div className="mb-3 position-relative">
            <label className="form-label">Parol</label>
            <input
              type={showPassword ? "text" : "password"}
              className="form-control"
              value={user.password}
              placeholder="********"
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              required
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "10px",
                top: "37px",
                cursor: "pointer",
                color: "#6c757d",
              }}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <button
            type="submit"
            className="btn btn-success w-100"
            disabled={loading}
          >
            {loading ? "Loading..." : "SignUp"}
          </button>
        </form>
        {error && <p className="text-danger mt-3">{error}</p>}
        {message && <p className="text-success mt-3">{message}</p>}
        <p className="mt-3 text-center">
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
}
