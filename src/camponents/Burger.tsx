import { Link } from "react-router-dom";
import type { NavbarProps } from "../types/types";

const Burger = (isLogedIn: NavbarProps) => {
  return (
    <div className="dropdown">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          className="inline-block h-5 w-5 stroke-current"
        >
          {" "}
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16"
          ></path>{" "}
        </svg>
      </div>
      <ul
        tabIndex={0}
        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
      >
        <li>
          <Link to={'/'}><a >Accueil</a></Link>
        </li>
        <li>
         <Link to={'/apropos'}> <a>A propos</a></Link>
        </li>
        <li>
          <a href="/connexion">{isLogedIn ? "Se connecter" : "Deconnexion"}</a>
        </li>
      </ul>
    </div>
  );
};

export default Burger;
