"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/supbaseClient";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      if (data?.session?.access_token) {
        localStorage.setItem("token", data.session.access_token);
        localStorage.setItem("userId", data.user.id);
      }

      router.push("/");
    }

    setLoading(false);
  };

  return (
    <div className="container d-flex justify-content-center align-items-center mt-3">
      <div
        className="border rounded p-5 shadow"
        style={{ width: "100%", maxWidth: "400px" }}
      >
        <h3 className="text-center mb-4 text-success">Login</h3>

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label">Email address</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="mb-3 position-relative">
            <label className="form-label">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
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

          {error && <div className="alert alert-danger">{error}</div>}

          <button
            type="submit"
            className="btn btn-success w-100"
            disabled={loading}
          >
            {loading ? "Loading..." : "Login"}
          </button>
        </form>

        <p className="mt-3 text-center">
          Do not have an account? <a href="/register">Register</a>
        </p>
      </div>
    </div>
  );
}
