import { useState, useEffect, useCallback } from "react";
import Carte from "../camponents/Carte";
import Navbar from "../camponents/Navbar";
import Footer from "../camponents/Footer";

import { Search } from "lucide-react";
import type { Batiment, Etablissement, Salle } from "../types/types";
import supabase from "../helper/SupabaseClient";

// Définir les types des relations
interface EtablissementWithRelations extends Etablissement {
  batiment: (Batiment & {
    salle: Salle[];
  })[];
}

function Home() {
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

  // Fonction pour récupérer les établissements avec les filtres appliqués
  const fetchEtablissements = useCallback(async () => {
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
    }
    setLoading(false);
  }, [codeEtabSearch, selectedDREN, selectedCISCO, selectedZAP]);

  // Déclencher la récupération des données au montage et à chaque changement de filtre
  useEffect(() => {
    fetchEtablissements();
  }, [fetchEtablissements]);

  // Réinitialiser les filtres
  const handleResetFilters = () => {
    setCodeEtabSearch("");
    setSelectedDREN("");
    setSelectedCISCO("");
    setSelectedZAP("");
  };

  return (
    <div>
      <div>
        <Navbar />
      </div>

      <div className="flex items-center flex-wrap  px-[8%] mt-10 space-x-10 max-[1250px]:space-y-5 ">
       
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
            onClick={fetchEtablissements}
          >
            <Search size={16} />
          </button>
        </div>

      
        <button className="btn btn-sm" onClick={handleResetFilters}>
          Tout
        </button>

        <div className="flex items-center space-x-4">
          <p className="font-medium text-sm ">Année Scolaire</p>
          <p className="text text-sm">2024-2025</p>
        </div>

        {/* Filtre DREN */}
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

        {/* Filtre CISCO */}
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

        {/* Filtre ZAP */}
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

      <div className="flex items-center min-h-120 justify-baseline flex-wrap max-md:px-[10%] space-x-15 px-[10%]">
        {loading ? (
          <div className="flex justify-center w-full mt-20">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : error ? (
          <p className="text-center w-full mt-20 text-lg text-error">{error}</p>
        ) : etablissements.length > 0 ? (
          etablissements.map((etablissement) => (
            <Carte key={etablissement.codeetab} etablissement={etablissement} />
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
}

export default Home;
