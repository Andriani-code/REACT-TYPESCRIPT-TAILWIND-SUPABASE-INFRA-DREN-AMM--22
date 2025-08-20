import { Link } from "react-router-dom";
import type { Etablissement, Batiment, Salle } from "../types/types";

// 1. Définir l'interface pour les props attendues
// C'est le même type que celui utilisé dans la page d'accueil
interface EtablissementWithRelations extends Etablissement {
  batiment: (Batiment & {
    salle: Salle[];
  })[];
}

interface CarteProps {
  etablissement: EtablissementWithRelations;
}

// 2. Modifier le composant pour accepter les props et utiliser la déstructuration
const Carte = ({ etablissement }: CarteProps) => {

  // Calculer les données dynamiques à partir de l'objet etablissement
  const totalBatiments = etablissement.batiment.length;
  const totalSalles = etablissement.batiment.reduce(
    (acc, batiment) => acc + batiment.salle.length,
    0
  );
  const totalSallesDeClasse = etablissement.batiment.reduce(
    (acc, batiment) =>
      acc +
      batiment.salle.filter((salle) => salle.affectationsalle === "classe").length,
    0
  );

  return (
    <div className="card w-96 bg-base-200 card-xl shadow-sm mt-15">
      <div className="card-body">
        {/* 3. Afficher les données dynamiques de la prop 'etablissement' */}
        <h2 className="card-title">{etablissement.nometab}</h2>
        <p className="text-sm">Code établissement : {etablissement.codeetab}</p>
        <p className="text-sm">Nombre des bâtiments : {totalBatiments}</p>
        <p className="text-sm">Nombre total des salles : {totalSalles}</p>
        <p className="text-sm">Nombre de salle de classe : {totalSallesDeClasse}</p>
        {/*
          Vous pouvez également afficher d'autres informations ici, par exemple :
          <p className="text-sm">Effectif des élèves : {etablissement.effectif}</p>
        */}

        <div className="justify-end card-actions">
          {/* Le lien peut être dynamique si vous avez une page de détails par ID */}
          <Link to={`/details/${etablissement.codeetab}`}>
            <button className="btn btn-primary">Plus de détails</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Carte;