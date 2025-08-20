import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient"; // Ton client Supabase configuré
import AdminCard from "./AdminCard";

interface EtablissementData {
  codeetab: string;
  nometab: string;
  nbBatiments: number;
  nbSallesTotal: number;
  nbSallesClasse: number;
  dimensionsMoyennes: string;
  effectifEleves: number;
}

const AdminDashboard = () => {
  const [etablissements, setEtablissements] = useState<EtablissementData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEtablissements = async () => {
      setLoading(true);

      // 1️⃣ Récupère les infos de l'établissement
      const { data: etabs, error: etabError } = await supabase
        .from("etablissement")
        .select(`
          codeetab,
          nometab,
          batiment:batiment(idbat),
          salle:salle(idsalle, affectationsalle, longueurint, hauteursp, nbeleveg, nbelevef)
        `);

      if (etabError) {
        console.error("Erreur lors du fetch:", etabError);
        setLoading(false);
        return;
      }

      // 2️⃣ Formater les données
      const formattedData: EtablissementData[] =
        etabs?.map((etab: any) => {
          const nbBatiments = etab.batiment?.length || 0;
          const nbSallesTotal = etab.salle?.length || 0;
          const sallesClasse = etab.salle?.filter(
            (s: any) =>
              s.affectationsalle?.toLowerCase().includes("classe")
          ) || [];
          const nbSallesClasse = sallesClasse.length;

          // Calcul dimensions moyennes
          let dimensionsMoyennes = "N/A";
          if (nbSallesClasse > 0) {
            const moyLongueur =
              sallesClasse.reduce((sum: number, s: any) => sum + (s.longueurint || 0), 0) /
              nbSallesClasse;
            const moyHauteur =
              sallesClasse.reduce((sum: number, s: any) => sum + (s.hauteursp || 0), 0) /
              nbSallesClasse;
            dimensionsMoyennes = `${moyLongueur.toFixed(1)}x${moyHauteur.toFixed(1)}`;
          }

          // Effectif total élèves
          const effectifEleves =
            etab.salle?.reduce(
              (sum: number, s: any) => sum + (s.nbeleveg || 0) + (s.nbelevef || 0),
              0
            ) || 0;

          return {
            codeetab: etab.codeetab,
            nometab: etab.nometab,
            nbBatiments,
            nbSallesTotal,
            nbSallesClasse,
            dimensionsMoyennes,
            effectifEleves,
          };
        }) || [];

      setEtablissements(formattedData);
      setLoading(false);
    };

    fetchEtablissements();
  }, []);

  if (loading) {
    return <p className="text-center mt-5">Chargement...</p>;
  }

  return (
    <div className="flex flex-wrap gap-6 p-6">
      {etablissements.map((etab) => (
        <AdminCard
          key={etab.codeetab}
          nomEtab={etab.nometab}
          codeEtab={etab.codeetab}
          nbBatiments={etab.nbBatiments}
          nbSallesTotal={etab.nbSallesTotal}
          nbSallesClasse={etab.nbSallesClasse}
          dimensionsMoyennes={etab.dimensionsMoyennes}
          effectifEleves={etab.effectifEleves}
          editLink={`/admin/edit/${etab.codeetab}`}
          detailsLink={`/admin/details/${etab.codeetab}`}
        />
      ))}
    </div>
  );
};

export default AdminDashboard;
