import { Mail, Phone } from "lucide-react";
import Navbar from "../camponents/Navbar";
import Footer from "../camponents/Footer";
import { Link, useParams } from "react-router-dom";
import type { Etablissement, Batiment, Salle } from "../types/types";
import { useEffect, useState } from "react";
import supabase from "../helper/SupabaseClient";

const Details = () => {
  const { code } = useParams<{ code: string }>();
  const codeInt = code ? parseInt(code, 10) : null;

  const [messageError, setMessageError] = useState("");
  const [etab, setEtab] = useState<Etablissement | null>(null);
  const [batiments, setBatiments] = useState<Batiment[]>([]);
  const [salles, setSalles] = useState<Salle[]>([]);

  // ---------- Fetch données ----------
  useEffect(() => {
    if (!codeInt) return;

    const fetchData = async () => {
      try {
        // Etablissement
        const { data: etabData, error: etabError } = await supabase
          .from("etablissement")
          .select("*")
          .eq("codeetab", codeInt)
          .single();

        if (etabError) throw etabError;
        setEtab(etabData);

        // Batiments
        const { data: batData, error: batError } = await supabase
          .from("batiment")
          .select("*")
          .eq("codeetab", codeInt);

        if (batError) throw batError;
        setBatiments(batData || []);

        // Salles liées aux bâtiments
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

  // ---------- Besoin en infrastructures ----------
  const besoinWC = Math.ceil(totalEleves / 50);
  const besoinSurface = (totalEleves * 1.12).toFixed(2);

  if (messageError) return <div>{messageError}</div>;
  if (!etab) return <div>Chargement...</div>;

  return (
    <div className="bg-base-200">
      <Navbar />

      {/* Infos établissement */}
      <div className="flex items-center justify-center gap-20 mt-20 ">
        <h2 className="font-bold text text-xl">CODE : {etab.codeetab} </h2>
        <h2 className="font-bold text text-xl text-green-700">
          {etab.nometab}
        </h2>
      </div>

      {/* Directeur */}
      <div className="flex flex-col items-center mt-20 gap-8 mx-[20%] p-8 bg-base-100 rounded-3xl shadow-lg">
        <div className="text-center font-bold">
          INFORMATIONS SUR LE DIRECTEUR
        </div>
        <div className="flex gap-4">
          <p>NOM :</p>
          <p>{etab.directeur?.nomdirecteur}</p>
        </div>
        <div className="flex gap-4">
          <p>PRENOM :</p>
          <p>{etab.directeur?.prendr}</p>
        </div>
        <div className="flex">
          <div className="flex gap-10 items center ">
            <div className="flex gap-3">
              <Phone size={20} />
              <p className="text-sm font-bold">{etab.directeur?.teldr}</p>
            </div>
            <div className="flex gap-3">
              <Mail size={20} />
              <a
                href={`mailto:${etab.directeur?.emaildr}`}
                className="text-sm font-bold"
              >
                {etab.directeur?.emaildr}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="text-center m-20">
        <div className="stats shadow px-[3%] gap-10 ">
          <div className="stat">
            <div className="stat-title">Effectif des élèves</div>
            <div className="stat-value text-primary">{totalEleves}</div>
          </div>
          <div className="stat">
            <div className="stat-title">Nombre des bâtiments</div>
            <div className="stat-value text-secondary">{totalBatiments}</div>
          </div>
          <div className="stat">
            <div className="stat-title">Totale salle</div>
            <div className="stat-value text-secondary">{totalSalles}</div>
          </div>
          <div className="stat">
            <div className="stat-title">Nombre de salle de classe</div>
            <div className="stat-value text-secondary">{nbSallesClasse}</div>
          </div>
          <div className="stat">
            <div className="stat-title">Salle opérationnelle</div>
            <div className="stat-value text-secondary">{nbSallesOp}</div>
          </div>
          <div className="stat">
            <div className="stat-title">Surface totale (m²)</div>
            <div className="stat-value text-secondary">{totalSurface}</div>
          </div>
        </div>
      </div>

      {/* Infos établissement */}
      <div className="flex px[2%]">
        <div className="flex flex-col items-center mt-20 gap-8 mx-auto p-8 bg-base-100 rounded-3xl shadow-lg">
          <div className="flex text-center">
            <h2 className="text mb-5 text-2xl font-medium">
              INFORMATIONS SUR L'ETABLISSEMENT
            </h2>
          </div>
          <div className="flex gap-10 items-center">
            <div className="flex flex-col gap-5">
              <p className="label font-bold label-sm">CISCO : {etab.cisco}</p>
              <p className="label font-bold label-sm">ZAP : {etab.zap}</p>
              <p className="label font-bold label-sm">
                COMMUNE : {etab.commune}
              </p>
              <p className="label font-bold label-sm">
                FOKONTANY : {etab.fokontany}
              </p>
            </div>
            <div className="flex flex-col gap-5">
              <p className="label font-bold label-sm">
                COUVERTURE TELEPHONIQUE : {etab.couvtelephonique}
              </p>
              <p className="label font-bold label-sm">
                COUVERTURE INTERNET : {etab.couvinternet}
              </p>
              <p className="label font-bold label-sm">
                ENSEIGNANTS HOMMES : {etab.nbenseignantg}
              </p>
              <p className="label font-bold label-sm">
                ENSEIGNANTS FEMMES : {etab.nbenseignantf}
              </p>
              <p className="label font-bold label-sm">
                NOMBRE DES SECTIONS : {etab.nbsection}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Infos Bâtiments */}
      <div className="m-10">
        <h2 className="text-xl font-bold text-center mb-5">BÂTIMENTS</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {batiments.map((bat) => (
            <div
              key={bat.idbat}
              className="p-6 bg-base-100 rounded-2xl shadow-md"
            >
              <p className="font-bold">Sigle : {bat.siglebat}</p>
              <p>Niveaux : {bat.nbniveau}</p>
              <p>Année construction : {bat.annrecprovc}</p>
              <p>Année réhabilitation : {bat.anneer}</p>
              <p>Agence construction : {bat.agencec}</p>
              <p>Agence réhabilitation : {bat.agencer}</p>
              <p>
                Dispositif accessibilité : {bat.dispositiveac ? "Oui" : "Non"}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Infos Salles */}
      <div className="m-10">
        <h2 className="text-xl font-bold text-center mb-5">SALLES</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {salles.map((salle) => (
            <div
              key={salle.idsalle}
              className="p-6 bg-base-100 rounded-2xl shadow-md"
            >
              <p className="font-bold">Sigle : {salle.siglesalle}</p>
              <p>Affectation : {salle.affectationsalle}</p>
              <p>État : {salle.etatsalle}</p>
              <p>Opérationnelle : {salle.estoperartionnel ? "Oui" : "Non"}</p>
              <p>Électrifiée : {salle.estelectrifier ? "Oui" : "Non"}</p>
              <p>Élèves F : {salle.nbelevef}</p>
              <p>Élèves G : {salle.nbeleveg}</p>
              <p>Surface : {salle.surface} m²</p>
            </div>
          ))}
        </div>
      </div>

      {/* Besoin en infrastructures */}
      <div className="m-10">
        <h2 className="text-xl font-bold text-center mb-5">
          BESOINS EN INFRASTRUCTURES
        </h2>
        <div className="stats shadow px-[3%] gap-10 justify-center">
          <div className="stat">
            <div className="stat-title">Besoin en WC</div>
            <div className="stat-value text-primary">{besoinWC}</div>
          </div>
          <div className="stat">
            <div className="stat-title">Besoin en Surface (m²)</div>
            <div className="stat-value text-secondary">{besoinSurface}</div>
          </div>
        </div>
      </div>
      <div className="btn btn-md rounded btn-primary absolute top-30 right-25">
        <Link to={`/print/${code}`}>
          <button>Imprimer</button>
        </Link>
      </div>
      <Footer />
    </div>
  );
};

export default Details;
