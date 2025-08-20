import { Link } from "react-router-dom";

import { MailCheck, Phone } from "lucide-react";
import Navbar from "../camponents/Navbar";
import Footer from "../camponents/Footer";


function Apropos() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-1 flex flex-col justify-center items-center py-10 px-4 sm:px-10 gap-8">
        <div className="max-w-3xl text-center space-y-6">
          <h1 className="text-3xl font-bold text-gray-800">
            À propos de notre plateforme
          </h1>
          <p className="text-gray-600 leading-relaxed">
            Notre plateforme a été conçue dans le but de representer de manière
            précise les infrastructures scolaires au sein de la **DREN Amoron'i Mania**.
            L'objectif est de fournir des données claires et détaillées sur l'état
            des bâtiments, des salles de classe et des ressources disponibles,
            afin de faciliter la prise de décision et d'améliorer les conditions
            d'apprentissage pour les élèves.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Nous tenons à exprimer notre profonde gratitude à la direction de la
            **DREN Amoron'i Mania**, et plus particulièrement à **Monsieur MIHARIMANANIRINA AINA GERALD**,
            pour leur soutien précieux et leur collaboration indispensable à la
            réalisation de ce projet.
          </p>
        </div>
        
        <div className="w-full max-w-sm border-t-2 border-gray-200 mt-8 pt-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Contacts de l'Administrateur</h2>
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-3 text-gray-700">
              <MailCheck size={24} />
              <a href="mailto:miharimananirina@gmail.com" className="text-lg hover:underline transition-colors duration-200">
                miharimananirina@gmail.com
              </a>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <Phone size={24} />
              <p className="text-lg">034 64 034 28</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Apropos;