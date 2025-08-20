import Themes from "../../../camponents/Themes";
import men from "../../../assets/men.png";
import Burger from "../../../camponents/Burger";
import { Link, useNavigate } from "react-router-dom";
import supabase from "../../../helper/SupabaseClient";

const AdminNav = () => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Erreur de déconnexion:", error.message);
      } else {
        navigate("/connexion");
      }
    } catch (error) {
      console.error("Erreur inattendue:", error);
    }
  };

  return (
    <div className=" flex items-center justify-center bg-base-200 space-x-10 p-4 px-[5%] max-md:justify-between  md:justify-between md:items-center   ">
      <div className="hidden max-md:flex absolute top-7 left-2">
        <Burger isAdmin />
      </div>
      <a className="flex items-center text-xl font-bold md:text-xl">
        <img src={men} className="w-15 mr-4 max-md:ml-6 max-md:mr-2" alt="" />
        INFRA
        <span className="text-emerald-700 ml-2  ">DREN AMORON'I MANIA</span>
      </a>

      <ul className="hidden md:flex space-x-4 ">
        <li>
          <Link to={"/admin"}>
            <a className="btn btn-md btn-ghost"> Dashboard</a>
          </Link>
        </li>
        <li>
          <Link to={"/admin/home"}>
            <a className="btn btn-md btn-ghost"> Accueil</a>
          </Link>
        </li>
      </ul>

      <div className="hidden max-md:flex absolute top-6 right-0">
        <Themes />
      </div>
      <div className="hidden justify-end md:flex items-center">
        <button onClick={handleSignOut} className="btn btn-accent btn-md mr-2 ">
          Deconnexion
        </button>
        <Themes />
      </div>
    </div>
  );
};

export default AdminNav;
