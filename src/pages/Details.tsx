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
      <div className="flex flex-col md:flex-row items-center justify-center gap-8 mt-16">
        <h2 className="text-lg md:text-xl font-semibold text-gray-700 tracking-wide">
          CODE :{" "}
          <span className="font-bold text-indigo-600">{etab.codeetab}</span>
        </h2>
        <h2 className="text-2xl md:text-3xl font-extrabold text-green-700 tracking-tight">
          {etab.nometab}
        </h2>
      </div>

      {/* Directeur */}
      <div className="flex justify-center px-4 py-10">
        <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center gap-6 hover:shadow-2xl transition-shadow">
          {/* Titre */}
          <h2 className="text-2xl font-bold text-gray-800 text-center">
            INFORMATIONS SUR LE DIRECTEUR
          </h2>

          {/* Nom et Prénom */}
          <div className="w-full space-y-3">
            <div className="flex justify-between text-gray-700">
              <span className="font-semibold">NOM :</span>
              <span className="text-gray-500">
                {etab.directeur?.nomdirecteur}
              </span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span className="font-semibold">PRÉNOM :</span>
              <span className="text-gray-500">{etab.directeur?.prendr}</span>
            </div>
          </div>

          {/* Contacts */}
          <div className="w-full flex flex-col sm:flex-row justify-between items-center gap-4 mt-4">
            <div className="flex items-center gap-2 bg-indigo-50 p-3 rounded-lg w-full sm:w-auto justify-center">
              <Phone size={20} className="text-indigo-500" />
              <span className="text-gray-700 font-medium">
                {etab.directeur?.teldr}
              </span>
            </div>
            <div className="flex items-center gap-2 bg-indigo-50 p-3 rounded-lg w-full sm:w-auto justify-center">
              <Mail size={20} className="text-indigo-500" />
              <a
                href={`mailto:${etab.directeur?.emaildr}`}
                className="text-gray-700 font-medium hover:underline"
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
      <div className="flex justify-center px-4 py-10">
        <div className="w-full max-w-6xl grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* Titre principal */}
          <div className="sm:col-span-2 md:col-span-3 lg:col-span-4 text-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800">
              INFORMATIONS SUR L'ÉTABLISSEMENT
            </h2>
            <p className="text-gray-500 mt-2">
              Toutes les données importantes en un coup d'œil
            </p>
          </div>

          {/* Carte individuelle pour chaque info */}
          <div className="bg-white shadow-lg rounded-xl p-5 flex flex-col items-center hover:scale-105 transition-transform">
            <span className="text-indigo-500 text-3xl mb-2">🏫</span>
            <p className="font-semibold text-gray-700">CISCO</p>
            <p className="text-gray-500">{etab.cisco}</p>
          </div>

          <div className="bg-white shadow-lg rounded-xl p-5 flex flex-col items-center hover:scale-105 transition-transform">
            <span className="text-indigo-500 text-3xl mb-2">📍</span>
            <p className="font-semibold text-gray-700">ZAP</p>
            <p className="text-gray-500">{etab.zap}</p>
          </div>

          <div className="bg-white shadow-lg rounded-xl p-5 flex flex-col items-center hover:scale-105 transition-transform">
            <span className="text-indigo-500 text-3xl mb-2">🏘️</span>
            <p className="font-semibold text-gray-700">COMMUNE</p>
            <p className="text-gray-500">{etab.commune}</p>
          </div>

          <div className="bg-white shadow-lg rounded-xl p-5 flex flex-col items-center hover:scale-105 transition-transform">
            <span className="text-indigo-500 text-3xl mb-2">🏠</span>
            <p className="font-semibold text-gray-700">FOKONTANY</p>
            <p className="text-gray-500">{etab.fokontany}</p>
          </div>

          <div className="bg-white shadow-lg rounded-xl p-5 flex flex-col items-center hover:scale-105 transition-transform">
            <span className="text-indigo-500 text-3xl mb-2">📶</span>
            <p className="font-semibold text-gray-700">
              Couverture Téléphonique
            </p>
            <p className="text-gray-500">{etab.couvtelephonique}</p>
          </div>

          <div className="bg-white shadow-lg rounded-xl p-5 flex flex-col items-center hover:scale-105 transition-transform">
            <span className="text-indigo-500 text-3xl mb-2">🌐</span>
            <p className="font-semibold text-gray-700">Couverture Internet</p>
            <p className="text-gray-500">{etab.couvinternet}</p>
          </div>

          <div className="bg-white shadow-lg rounded-xl p-5 flex flex-col items-center hover:scale-105 transition-transform">
            <span className="text-indigo-500 text-3xl mb-2">👨‍🏫</span>
            <p className="font-semibold text-gray-700">Enseignants Hommes</p>
            <p className="text-gray-500">{etab.nbenseignantg}</p>
          </div>

          <div className="bg-white shadow-lg rounded-xl p-5 flex flex-col items-center hover:scale-105 transition-transform">
            <span className="text-indigo-500 text-3xl mb-2">👩‍🏫</span>
            <p className="font-semibold text-gray-700">Enseignants Femmes</p>
            <p className="text-gray-500">{etab.nbenseignantf}</p>
          </div>

          <div className="bg-white shadow-lg rounded-xl p-5 flex flex-col items-center hover:scale-105 transition-transform">
            <span className="text-indigo-500 text-3xl mb-2">📚</span>
            <p className="font-semibold text-gray-700">Nombre de Sections</p>
            <p className="text-gray-500">{etab.nbsection}</p>
          </div>
        </div>
      </div>

      <div className="m-10 text-center">
        <h2 className="text-xl font-bold text-center mb-5">
          BESOINS EN INFRASTRUCTURES
        </h2>
        <div className="stats shadow px-[3%] gap-10 justify-center">
          <div className="stat">
            <div className="stat-title">Besoin en WC</div>
            <div className="stat-value text-primary">{besoinWC}</div>
          </div>
          <div className="stat">
            <div className="stat-title">Besoin en Surface de salle (m²)</div>
            <div className="stat-value text-secondary">{besoinSurface}</div>
          </div>
        </div>
      </div>

      {/* Infos Bâtiments */}
      <div className="px-6 py-10">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          BÂTIMENTS
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {batiments.map((bat) => (
            <div
              key={bat.idbat}
              className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-3 hover:scale-105 transition-transform"
            >
              <p className="text-indigo-600 font-bold text-lg">
                {bat.siglebat}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Niveaux :</span> {bat.nbniveau}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Année construction :</span>{" "}
                {bat.annrecprovc}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Année réhabilitation :</span>{" "}
                {bat.anneer}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Agence construction :</span>{" "}
                {bat.agencec}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Agence réhabilitation :</span>{" "}
                {bat.agencer}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Accessibilité :</span>{" "}
                {bat.dispositiveac ? "✅ Oui" : "❌ Non"}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Infos Salles */}
      <div className="px-6 py-10">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          SALLES
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {salles.map((salle) => (
            <div
              key={salle.idsalle}
              className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-3 hover:scale-105 transition-transform"
            >
              <p className="text-indigo-600 font-bold text-lg">
                {salle.siglesalle}
              </p>

              <p className="text-gray-700">
                <span className="font-semibold">Affectation :</span>{" "}
                {salle.affectationsalle}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">État :</span> {salle.etatsalle}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Opérationnelle :</span>{" "}
                {salle.estoperartionnel ? "✅ Oui" : "❌ Non"}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Électrifiée :</span>{" "}
                {salle.estelectrifier ? "⚡ Oui" : "❌ Non"}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Élèves F :</span>{" "}
                {salle.nbelevef}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Élèves G :</span>{" "}
                {salle.nbeleveg}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Surface :</span> {salle.surface}{" "}
                m²
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Besoin en infrastructures */}

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
