import { Link } from "react-router-dom";
import type { Batiment, Etablissement, Salle } from "../../../types/types";
// Importer les types pour les bâtiments et les salles

// Type d'établissement étendu avec les relations
interface EtablissementWithRelations extends Etablissement {
  batiment: (Batiment & {
    salle: Salle[];
  })[];
}

// L'interface pour les props a été mise à jour
interface AdminCardProps {
  etablissement: EtablissementWithRelations;
}

const AdminCard: React.FC<AdminCardProps> = ({ etablissement }) => {
  // Calcul du nombre total de salles et de bâtiments
  const nbBatiments = etablissement.batiment.length;
  // Utiliser flatMap pour obtenir un tableau plat de toutes les salles
  const toutesLesSalles = etablissement.batiment.flatMap((b) => b.salle);
  const nbSalles = toutesLesSalles.length;
  // Filtrer les salles de classe
  const nbSallesDeClasse = toutesLesSalles.filter(
    (s) => s.affectationsalle === "Classe"
  ).length;
  // Calculer l'effectif des élèves (si ces données sont disponibles dans la table salle)
  const effectifEleves = toutesLesSalles.reduce(
    (total, salle) => total + (salle.nbeleveg ?? 0) + (salle.nbelevef ?? 0),
    0
  );

  return (
    <div className="card w-96 bg-base-200 card-xl shadow-sm mt-15">
      <div className="card-body">
        <h2 className="card-title">{etablissement.nometab}</h2>
        <p className="text-sm">Code établissement : {etablissement.codeetab}</p>
        <p className="text-sm">Nombre de bâtiments : {nbBatiments}</p>
        <p className="text-sm">Nombre total de salles : {nbSalles}</p>
        <p className="text-sm">
          Nombre de salles de classe : {nbSallesDeClasse}
        </p>
        <p className="text-sm">Dimensions moyenne de salle de classe : N/A</p>{" "}
        {/* Logique de calcul à implémenter si nécessaire */}
        <p className="text-sm">Effectif des élèves : {effectifEleves}</p>
        <div className="flex flex-wrap items-center gap-4 mt-3 mr-1">
          <div className="justify-between card-actions">
            <Link to={`/admin/edit/${etablissement.codeetab}`}>
              <button className="btn btn-ghost btn-md">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="feather feather-edit"
                >
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
              </button>
            </Link>
          </div>
          <div className="justify-end card-actions">
            <Link to={`/details/${etablissement.codeetab}`}>
              <button className="btn btn-primary">Plus de détails</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCard;
