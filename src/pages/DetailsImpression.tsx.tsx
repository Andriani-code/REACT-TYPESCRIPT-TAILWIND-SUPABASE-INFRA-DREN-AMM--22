
import Navbar from "../camponents/Navbar";
import Footer from "../camponents/Footer";
import { useParams } from "react-router-dom";
import type { Etablissement, Batiment, Salle } from "../types/types";
import { useEffect, useState } from "react";
import supabase from "../helper/SupabaseClient";

const DetailsImpression = () => {
  const { code } = useParams<{ code: string }>();
  const codeInt = code ? parseInt(code, 10) : null;

  const [messageError, setMessageError] = useState("");
  const [etab, setEtab] = useState<Etablissement | null>(null);
  const [batiments, setBatiments] = useState<Batiment[]>([]);
  const [salles, setSalles] = useState<Salle[]>([]);

 
  useEffect(() => {
    if (!codeInt) return;

    const fetchData = async () => {
      try {
        const { data: etabData, error: etabError } = await supabase
          .from("etablissement")
          .select("*")
          .eq("codeetab", codeInt)
          .single();

        if (etabError) throw etabError;
        setEtab(etabData);

        const { data: batData, error: batError } = await supabase
          .from("batiment")
          .select("*")
          .eq("codeetab", codeInt);

        if (batError) throw batError;
        setBatiments(batData || []);

        const batIds = (batData || []).map((b: Batiment) => b.idbat);
        if (batIds.length > 0) {
          const { data: salleData, error: salleError } = await supabase
            .from("salle")
            .select("*")
            .in("idbat", batIds);

          if (salleError) throw salleError;
          setSalles(salleData || []);
        }
      } catch (error) {
        console.error("Erreur fetchData :", error);
        setMessageError("Erreur pendant la récupération des données");
      }
    };

    fetchData();
  }, [codeInt]);

  // ---------- Stats dynamiques ----------
  const totalEleves = salles.reduce(
    (acc, s) => acc + (s.nbeleveg || 0) + (s.nbelevef || 0),
    0
  );
  const totalBatiments = batiments.length;
  const totalSalles = salles.length;
  const nbSallesClasse = salles.filter(
    (s) => s.affectationsalle?.toLowerCase() === "classe"
  ).length;
  const nbSallesOp = salles.filter((s) => s.estoperartionnel).length;
  const totalSurface = salles.reduce((acc, s) => acc + (s.surface || 0), 0);

  const besoinWC = Math.ceil(totalEleves / 50);
  const besoinSurface = (totalEleves * 1.12).toFixed(2);

  if (messageError) return <div>{messageError}</div>;
  if (!etab) return <div>Chargement...</div>;

  return (
    <div className="bg-base-200 text-center">
     <div className="no-print">
         <Navbar />
     </div>

      {/* BOUTON IMPRIMER */}
      <div className="text-center my-5 no-print">
        <button
          onClick={() => window.print()}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow"
        >
          Imprimer
        </button>
      </div>

      <div className="print-container p-5 mx-[35%]">
        {/* Infos établissement */}
        <h2>CODE : {etab.codeetab} — {etab.nometab}</h2>

        {/* Directeur */}
        <h3 className="font-bold m-10">INFORMATIONS SUR LE DIRECTEUR</h3>
        <table className="table">
          <tbody>
            <tr><td>Nom</td><td>{etab.directeur?.nomdirecteur}</td></tr>
            <tr><td>Prénom</td><td>{etab.directeur?.prendr}</td></tr>
            <tr><td>Téléphone</td><td>{etab.directeur?.teldr}</td></tr>
            <tr><td>Email</td><td>{etab.directeur?.emaildr}</td></tr>
          </tbody>
        </table>

        {/* Stats */}
        <h3 className="font-bold m-10">STATISTIQUES</h3>
        <table className="table">
          <tbody>
            <tr><td>Effectif des élèves</td><td>{totalEleves}</td></tr>
            <tr><td>Nombre de bâtiments</td><td>{totalBatiments}</td></tr>
            <tr><td>Nombre de salles</td><td>{totalSalles}</td></tr>
            <tr><td>Salles de classe</td><td>{nbSallesClasse}</td></tr>
            <tr><td>Salles opérationnelles</td><td>{nbSallesOp}</td></tr>
            <tr><td>Surface totale des salles (m²)</td><td>{totalSurface}</td></tr>
          </tbody>
        </table>

        {/* Infos établissement */}
        <h3 className="font-bold m-10">INFORMATIONS SUR L'ÉTABLISSEMENT</h3>
        <table className="table">
          <tbody>
            <tr><td>CISCO</td><td>{etab.cisco}</td></tr>
            <tr><td>ZAP</td><td>{etab.zap}</td></tr>
            <tr><td>Commune</td><td>{etab.commune}</td></tr>
            <tr><td>Fokontany</td><td>{etab.fokontany}</td></tr>
            <tr><td>Couverture téléphonique</td><td>{etab.couvtelephonique}</td></tr>
            <tr><td>Couverture internet</td><td>{etab.couvinternet}</td></tr>
            <tr><td>Enseignants H</td><td>{etab.nbenseignantg}</td></tr>
            <tr><td>Enseignants F</td><td>{etab.nbenseignantf}</td></tr>
            <tr><td>Nombre de sections</td><td>{etab.nbsection}</td></tr>
          </tbody>
        </table>

        {/* Bâtiments */}
        <div className="page-break"></div>
        <h3 className="font-bold m-10">BÂTIMENTS</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Sigle</th><th>Niveaux</th><th>Année constr.</th><th>Année réhab.</th><th>Agence constr.</th><th>Agence réhab.</th><th>Accessibilité</th>
            </tr>
          </thead>
          <tbody>
            {batiments.map((bat) => (
              <tr key={bat.idbat}>
                <td>{bat.siglebat}</td>
                <td>{bat.nbniveau}</td>
                <td>{bat.annrecprovc}</td>
                <td>{bat.anneer}</td>
                <td>{bat.agencec}</td>
                <td>{bat.agencer}</td>
                <td>{bat.dispositiveac ? "Oui" : "Non"}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Salles */}
        <div className="page-break"></div>
        <h3 className="font-bold m-10">SALLES</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Sigle</th><th>Affectation</th><th>État</th><th>Opérat.</th><th>Électrifiée</th><th>Élèves F</th><th>Élèves G</th><th>Surface</th>
            </tr>
          </thead>
          <tbody>
            {salles.map((salle) => (
              <tr key={salle.idsalle}>
                <td>{salle.siglesalle}</td>
                <td>{salle.affectationsalle}</td>
                <td>{salle.etatsalle}</td>
                <td>{salle.estoperartionnel ? "Oui" : "Non"}</td>
                <td>{salle.estelectrifier ? "Oui" : "Non"}</td>
                <td>{salle.nbelevef}</td>
                <td>{salle.nbeleveg}</td>
                <td>{salle.surface} m²</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Besoins */}
        <div className="page-break"></div>
        <h3 className="font-bold m-10">BESOINS EN INFRASTRUCTURES</h3>
        <table className="table">
          <tbody>
            <tr><td>Besoin en WC</td><td>{besoinWC}</td></tr>
            <tr><td>Besoin en surface (m²)</td><td>{besoinSurface}</td></tr>
          </tbody>
        </table>
      </div>

     <div className="no-print"> <Footer /></div>

      {/* STYLES PRINT */}
      <style>
        {`
          @media print {
            body {
              -webkit-print-color-adjust: exact;
              margin: 0;
              padding: 0;
            }
            .no-print {
              display: none !important;
            }
            .print-container {
              font-family: Arial, sans-serif;
              font-size: 11pt;
              margin: 0;
              padding: 15mm;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 15px;
            }
            th, td {
              border: 1px solid #000;
              padding: 4px 8px;
              text-align: left;
            }
            th {
              background: #fff;
            }
            h2, h3 {
              margin-top: 20px;
              margin-bottom: 10px;
            }
            .page-break {
              page-break-before: always;
            }
            @page {
              size: A4;
              margin: 15mm;
            }
          }
        `}
      </style>
    </div>
  );
};

export default DetailsImpression;
