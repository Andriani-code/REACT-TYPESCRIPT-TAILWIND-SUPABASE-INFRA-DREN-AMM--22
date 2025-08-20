import Themes from "./Themes";
import men from "../assets/men.png";
import Burger from "./Burger";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <div className=" flex w- =items-center justify-center bg-base-200 space-x-10 p-4 px-[5%] max-md:justify-between  md:justify-between md:items-center   ">
      <div className="hidden max-md:flex absolute top-7 left-2">
        <Burger isAdmin />
      </div>
      <a className="flex items-center text-xl font-bold md:text-xl">
        <img src={men} className="w-15 mr-4 max-md:ml-6 max-md:mr-2" alt="" />
        INFRA
        <span className="text-emerald-700  ml-2 ">DREN AMORON'I MANIA</span>
      </a>

      <ul className="hidden md:flex space-x-4 ">
        <li>
          <a className="btn btn-md btn-ghost">
            <Link to={"/"}>Accueil</Link>
          </a>
        </li>
        <li>
          <Link to={"/apropos"}>
            {" "}
            <a href="" className="btn btn-md btn-ghost">
              A propos
            </a>
          </Link>
        </li>
      </ul>

      <div className="hidden max-md:flex absolute top-6 right-0">
        <Themes />
      </div>
      <div className="hidden justify-end md:flex items-center">
        <Link to={"/connexion"}>
          <button className="btn btn-accent btn-md mr-2 ">Se connecter</button>
        </Link>
        <Themes />
      </div>
    </div>
  );
}

export default Navbar;
