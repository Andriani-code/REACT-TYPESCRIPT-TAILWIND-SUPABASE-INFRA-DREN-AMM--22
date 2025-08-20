import React, { useState } from "react";
import supabase from "../helper/SupabaseClient";
import Navbar from "../camponents/Navbar";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setErrorMsg("");

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "http://localhost:5173/new-password", // ta page nouvelle mdp
    });

    if (error) {
      setErrorMsg(error.message);
    } else {
      setMessage("Un email de réinitialisation a été envoyé.");
    }
  };

  return (
    <div>
      <Navbar/>
      <div className="max-w-md mx-auto mt-20 p-6 absolute top-[30%] right-[40%] rounded-lg shadow-lg bg-base-100">
      <h2 className="text-3xl font-bold mb-6 text-center">
        Réinitialiser le mot de passe
      </h2>

      <form onSubmit={handleReset}>
        <div className="form-control mb-4">
          <label className="label">
            <span className="label-text">Email</span>
          </label>
          <input
            type="email"
            placeholder="Votre email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input input-bordered w-full"
          />
        </div>

        {errorMsg && (
          <div className="alert alert-error mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2v6m0-10a4 4 0 110 8 4 4 0 010-8z"
              />
            </svg>
            <span>{errorMsg}</span>
          </div>
        )}

        {message && (
          <div className="alert alert-success mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span>{message}</span>
          </div>
        )}

        <button type="submit" className="btn btn-primary w-full">
          Envoyer le mail
        </button>
      </form>
    </div>
    </div>
  );
}
