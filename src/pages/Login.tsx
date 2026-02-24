import React, { useMemo, useState } from "react";
import supabase from "../helper/SupabaseClient";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../camponents/Navbar";
import Footer from "../camponents/Footer";

export default function Login() {
  // Lisibilité / Maintenabilité :
  // email et password sont des états simples, mais on garde un typage clair sur errorMsg (null = pas d'erreur).
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Lisibilité :
  // null est plus clair qu'une chaîne vide pour représenter "aucune erreur".
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // UX / Lisibilité :
  // état pour afficher/masquer le mot de passe.
  const [showPassword, setShowPassword] = useState(false);

  // Fiabilité :
  // empêche les doubles clics (plusieurs requêtes simultanées).
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  // Fiabilité :
  // on normalise l'email (trim + lowercase) pour éviter des erreurs dues aux espaces/majuscules.
  // Maintenabilité :
  // useMemo évite de recalculer à chaque render sans raison.
  const normalizedEmail = useMemo(() => email.trim().toLowerCase(), [email]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Fiabilité :
    // si une connexion est déjà en cours, on ne relance pas une seconde requête.
    if (isSubmitting) return;

    setErrorMsg(null);
    setIsSubmitting(true);

    try {
      // Fiabilité :
      // appel Supabase dans un try/catch pour gérer aussi les erreurs réseau (pas seulement error retourné).
      const { data, error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      });

      // Sécurité / UX :
      // on évite d'afficher directement error.message du backend (peut contenir des infos techniques).
      // On donne plutôt un message utilisateur générique.
      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          setErrorMsg("Email non trouvé ou mot de passe incorrect.");
        } else {
          setErrorMsg("Une erreur est survenue. Veuillez réessayer.");
        }
        return;
      }

      // Fiabilité :
      // on vérifie data.user avant de naviguer.
      if (data.user) {
        // UX / Fiabilité :
        // replace: true empêche de revenir sur la page login avec le bouton retour.
        navigate("/admin/home", { replace: true });
      } else {
        setErrorMsg("Connexion impossible. Veuillez réessayer.");
      }
    } catch (err) {
      // Fiabilité :
      // couvre les cas où la requête échoue (internet coupé, timeout, etc.).
      console.error("Erreur de connexion :", err);
      setErrorMsg("Erreur réseau. Vérifiez votre connexion internet.");
    } finally {
      // Fiabilité :
      // garantit que le bouton redevient cliquable même si une erreur arrive.
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <Navbar />

      <div className="flex justify-center">
        <div className="w-3xl h-200 mx-[10%] px-[5%] mt-20 p-6 rounded-lg shadow-lg bg-base-100">
          <h2 className="text-3xl font-bold mb-6 text-center">Connexion</h2>

          <form onSubmit={handleLogin} className="flex flex-col gap-6">
            <label className="form-control w-full">
              <span className="label-text">Email</span>

              {/* Fiabilité / UX :
                  autoComplete aide le navigateur à remplir correctement l'email. */}
              <input
                type="email"
                placeholder="Votre email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="input input-bordered w-full"
              />
            </label>

            <label className="form-control w-full relative">
              <span className="label-text">Mot de passe</span>

              {/* Fiabilité / UX :
                  autoComplete="current-password" aide à gérer les mots de passe enregistrés. */}
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="input input-bordered w-full pr-10"
              />

              {/* Lisibilité / Fiabilité :
                  on utilise setShowPassword(v => !v) pour éviter les états obsolètes. */}
              <button
                type="button"
                className="absolute right-2 top-[30px] btn btn-ghost btn-sm rounded-md"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Masquer mot de passe" : "Afficher mot de passe"}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </label>

            {/* Fiabilité :
                on affiche le message seulement s'il existe */}
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

            {/* Fiabilité :
                disabled pendant l’envoi pour éviter double requête */}
            <button type="submit" className="btn btn-primary w-full" disabled={isSubmitting}>
              {isSubmitting ? "Connexion..." : "Se connecter"}
            </button>

            {/* Maintenabilité :
                Link ne doit pas contenir un <a> à l’intérieur */}
            <p className="text-center mt-2 text-sm">
              <Link to="/reset-password" className="link link-primary">
                Mot de passe oublié ?
              </Link>
            </p>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}
