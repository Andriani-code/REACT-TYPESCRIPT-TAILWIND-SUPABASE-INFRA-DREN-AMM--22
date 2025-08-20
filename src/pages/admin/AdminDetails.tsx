import { Images, MailIcon, Phone } from "lucide-react";
import Footer from "../../camponents/Footer";
import InfoEtab from "../../camponents/InfoEtab";
import AdminNav from "./Camponents/AdminNav";

const AdminDetails = () => {
  return (
    <div className="">
      <AdminNav />
      <div className="flex items-center flex-col gap-8">
        <div className="w-full text-center ">
          <h1 className="text-3xl font-bold mt-10">
            LYCEE RAKOTOARISOA AMBOSITRA
          </h1>
        </div>
        <div className="font-bold">
          <h1>Code etablissement : 548541685486</h1>
        </div>
        <div className="flex items-center flex-col gap-5">
          <h3 className="font-bold text-2xl text-center text-green-800">
            ETABLISSEMENT PUBLIC
          </h3>
          <p className="font-bold text-black">Annee Scolaire 2024-2025</p>
        </div>
      </div>

      {/* Statistique de l'etablissement */}
      <div className="flex items-center flex-wrap justify-center gap-7 mt-15 px-[3%]  ">
        <div className="stats shadow ">
          <div className="stat">
            <div className="stat-title text-xl font-bold">Total des eleves</div>
            <div className="stat-value">1258 </div>
            <div className="stat-desc">21% moins que l'annee derniere </div>
          </div>
        </div>
        <div className="stats shadow">
          <div className="stat">
            <div className="stat-title text-xl font-bold">
              Total des enseignants
            </div>
            <div className="stat-value">89 </div>
            <div className="stat-desc">21% more than last month</div>
          </div>
        </div>
        <div className="stats shadow">
          <div className="stat">
            <div className="stat-title text-xl font-bold">Batiments</div>
            <div className="stat-value">7</div>
            <div className="stat-desc">7/7 en bon etat</div>
          </div>
        </div>
        <div className="stats shadow">
          <div className="stat">
            <div className="stat-title text-xl font-bold">Salles</div>
            <div className="stat-value">28</div>
            <div className="stat-desc">25/28 en bon etat</div>
          </div>
        </div>
        <div className="stats shadow">
          <div className="stat">
            <div className="stat-title text-xl font-bold">Salles de classe</div>
            <div className="stat-value">15</div>
            <div className="stat-desc">14/15 en bon etat</div>
          </div>
        </div>
        <div className="stats shadow">
          <div className="stat">
            <div className="stat-title text-xl text-wrap font-bold">
              Dim moyenne des salles de classe
            </div>
            <div className="stat-value">7 x 8</div>
            <div className="stat-desc">14/15 en bon etat</div>
          </div>
        </div>
      </div>
      <div className="flex mt-10 gap-20 items-center  px-[3%]">
        <div className="flex items-center gap-5">
          <Images size={34} />
          <button
            className="btn btn-info"
            onClick={() => document.getElementById("my_modal_2").showModal()}
          >
            Galerie
          </button>
          <dialog id="my_modal_2" className="modal">
            <div className="modal-box w-11/12 h-150 max-w-5xl">
              <h3 className="font-bold text-lg">Hello!</h3>

              <div className="modal-action absolute top-0 right-4 ">
                <form method="dialog">
                  {/* if there is a button, it will close the modal */}
                  <button className="btn">Fermer</button>
                </form>
              </div>
            </div>
          </dialog>{" "}
        </div>
        <div className="flex  items-center gap-5">
          <Phone />
          <p className="text text-2xl font-semibold">0389417013</p>
        </div>
        <div className="flex  items-center gap-5">
          <MailIcon/>
          <p className="text text-2xl font-semibold">directeur@gmail.com</p>
        </div>
      </div>

      <InfoEtab />

      <Footer />
    </div>
  );
};

export default AdminDetails;
