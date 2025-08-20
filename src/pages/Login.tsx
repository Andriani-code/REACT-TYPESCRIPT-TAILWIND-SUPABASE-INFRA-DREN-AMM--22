import React, { useState } from "react";
import supabase from "../helper/SupabaseClient";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../camponents/Navbar";
import Footer from "../camponents/Footer";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (error.message.includes("Invalid login credentials")) {
        setErrorMsg("Email non trouvé ou mot de passe incorrect");
      } else {
        setErrorMsg(error.message);
      }
    } else if (data.user) {
      setErrorMsg("");
      navigate("/admin/home");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="flex justify-center">
        <div className="w-3xl h-200 mx-[10%] px-[5%] mt-20 p-6  rounded-lg shadow-lg bg-base-100">
          <h2 className="text-3xl font-bold mb-6 text-center">Connexion</h2>

          <form onSubmit={handleLogin} className="flex flex-col gap-6">
            
            <label className="form-control w-full">
              <span className="label-text">Email</span>
              <input
                type="email"
                placeholder="Votre email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input input-bordered w-full"
              />
            </label>

            
            <label className="form-control w-full relative ">
              <span className="label-text">Mot de passe</span>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="input input-bordered w-full pr-10"
              />
              <button
                type="button"
                className="absolute right-2 top-[30px] btn btn-ghost btn-sm rounded-md"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                aria-label={
                  showPassword
                    ? "Masquer mot de passe"
                    : "Afficher mot de passe"
                }
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </label>

            {/* Message d'erreur */}
            {errorMsg && (
              <div className="alert alert-error">
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

            <button type="submit" className="btn btn-primary w-full">
              Se connecter
            </button>

            
            <p className="text-center mt-2 text-sm">
              <Link to={"/reset-password"}><a  className="link link-primary">
                Mot de passe oublié ?
              </a></Link>
            </p>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}
