import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

export default function Login(){
  const { signIn, signUp } = useAuth();
  const nav = useNavigate();
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [mode,setMode]=useState<"login"|"signup">("login");
  const [err,setErr]=useState<string | null>(null);
  const [loading,setLoading]=useState(false);

  async function submit(e: React.FormEvent){
    e.preventDefault(); setErr(null); setLoading(true);
    const fn = mode==="login" ? signIn : signUp;
    const { error } = await fn(email, password);
    setLoading(false);
    if(error) setErr(error.message);
    else {
      if(mode==="signup") setErr("Check your email to confirm, then login.");
      else nav("/");
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>{mode==="login" ? "Welcome back" : "Create account"}</h1>
        <p>ClientArc — {mode==="login" ? "sign in to continue" : "sign up free"}</p>
        <form onSubmit={submit}>
          <label>Email<input type="email" value={email} onChange={e=>setEmail(e.target.value)} required placeholder="you@email.com" /></label>
          <label>Password<input type="password" value={password} onChange={e=>setPassword(e.target.value)} required placeholder="••••••••" minLength={6} /></label>
          {err && <div className="login-error">{err}</div>}
          <button type="submit" className="btn-primary" disabled={loading}>{loading ? "..." : mode==="login" ? "Sign In" : "Sign Up"}</button>
        </form>
        <button className="btn-ghost" onClick={()=>setMode(mode==="login"?"signup":"login")}>
          {mode==="login" ? "Need an account? Sign up" : "Have an account? Sign in"}
        </button>
        <Link to="/" className="back-link">← Back to app (dev)</Link>
      </div>
    </div>
  );
}
