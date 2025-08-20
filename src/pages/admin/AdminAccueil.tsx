import { Link } from "react-router-dom";
import AdminNav from "./Camponents/AdminNav";
import Footer from "../../camponents/Footer";
import AdminCard from "./Camponents/AdminCard";
import { PlusSquareIcon, Search } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import supabase from "../../helper/SupabaseClient";
import type { Etablissement, Batiment, Salle } from "../../types/types";

// Définir les types des relations
interface EtablissementWithRelations extends Etablissement {
  batiment: (Batiment & {
    salle: Salle[];
  })[];
}

const AdminAccueil = () => {
  const [etablissements, setEtablissements] = useState<
    EtablissementWithRelations[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // États pour les filtres et la recherche
  const [codeEtabSearch, setCodeEtabSearch] = useState<string>("");
  const [selectedDREN, setSelectedDREN] = useState<string>("");
  const [selectedCISCO, setSelectedCISCO] = useState<string>("");
  const [selectedZAP, setSelectedZAP] = useState<string>("");

  const fetchEtablissementsWithDetails = useCallback(async () => {
    setLoading(true);
    setError(null);

    let query = supabase.from("etablissement").select(
      `
      codeetab,
      nometab,
      dren,
      cisco,
      commune,
      zap,
      fokontany,
      quartier,
      couvtelephonique,
      couvinternet,
      nbenseignantg,
      nbenseignantf,
      nbsection,
      directeur,
      batiment(
        *,
        salle(*)
      )
      `
    );

    if (codeEtabSearch) {
      const code = parseInt(codeEtabSearch, 10);
      if (!isNaN(code)) {
        query = query.eq("codeetab", code);
      } else {
        setError("Le code établissement doit être un nombre valide.");
        setLoading(false);
        return;
      }
    }

    if (selectedDREN) {
      query = query.eq("dren", selectedDREN);
    }
    if (selectedCISCO) {
      query = query.eq("cisco", selectedCISCO);
    }
    if (selectedZAP) {
      query = query.eq("zap", selectedZAP);
    }

    const { data, error: supaError } = await query;

    if (supaError) {
      console.error("Erreur lors du chargement des données:", supaError);
      setError("Impossible de charger les données des établissements.");
    } else {
      setEtablissements(data as EtablissementWithRelations[]);
      setError(null);
    }
    setLoading(false);
  }, [codeEtabSearch, selectedDREN, selectedCISCO, selectedZAP]);

  useEffect(() => {
    fetchEtablissementsWithDetails();
  }, [fetchEtablissementsWithDetails]);

  const handleResetFilters = () => {
    setCodeEtabSearch("");
    setSelectedDREN("");
    setSelectedCISCO("");
    setSelectedZAP("");
  };

  // On retire les blocs de rendu conditionnel pour 'loading' et 'error' de haut niveau
  // et on les gère directement dans le JSX principal.
  return (
    <div>
      <div>
        <AdminNav />
      </div>
      <div className="px-[1%] mt-3 flex justify-center">
        <Link to={"/admin/new"}>
          <button className="btn btn-neutral btn-outline mt-6 w-auto mx-10">
            <PlusSquareIcon />
            Nouvel Etablissement
          </button>
        </Link>
      </div>
      <div className="flex items-center flex-wrap px-[5%] mt-10 space-x-10 max-[1250px]:space-y-5 px-[10%]">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Code établissement"
            className="input input-md"
            value={codeEtabSearch}
            onChange={(e) => setCodeEtabSearch(e.target.value)}
          />
          <button
            className="btn btn-sm btn-primary"
            onClick={fetchEtablissementsWithDetails}
          >
            <Search size={16} />
          </button>
        </div>
        <button className="btn btn-sm" onClick={handleResetFilters}>
          Tous
        </button>
        <div className="flex items-center space-x-4">
          <p className="font-medium text-sm ">DREN</p>
          <select
            className="select w-full"
            value={selectedDREN}
            onChange={(e) => setSelectedDREN(e.target.value)}
          >
            <option value="">CHOISISSEZ UN DREN</option>
            <option>AMORON'I MANIA</option>
          </select>
        </div>
        <div className="flex items-center space-x-4">
          <p className="font-medium text-sm">CISCO</p>
          <select
            className="select w-full"
            value={selectedCISCO}
            onChange={(e) => setSelectedCISCO(e.target.value)}
          >
            <option value="">CHOISISSEZ UN CISCO</option>
            <option>AMBOSITRA</option>
            <option>MANANDRIANA</option>
            <option>FANDRIANA</option>
            <option>AMBATOFINANDRAHANA</option>
          </select>
        </div>
        <div className="flex items-center space-x-4">
          <p className="font-medium text-sm">ZAP</p>
          <select
            className="select w-full"
            value={selectedZAP}
            onChange={(e) => setSelectedZAP(e.target.value)}
          >
            <option value="">CHOISISSEZ UN ZAP</option>
            <option>AMBOSITRA</option>
          </select>
        </div>
      </div>

      {/* Affichage des cartes dynamiques - Rendu conditionnel ici */}
      <div className="flex items-center min-h-100 justify-baseline flex-wrap max-md:px-[10%] space-x-15 px-[10%]">
        {loading ? (
          <div className="flex justify-center w-full mt-20">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : error ? (
          <p className="text-center w-full mt-20 text-lg text-error">{error}</p>
        ) : etablissements.length > 0 ? (
          etablissements.map((etablissement) => (
            <AdminCard
              key={etablissement.codeetab}
              etablissement={etablissement}
            />
          ))
        ) : (
          <p className="text-center w-full mt-20 text-lg">
            Aucun établissement trouvé avec les filtres actuels.
          </p>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default AdminAccueil;
