import React, { useEffect, useState } from "react";
import supabase from "../helper/SupabaseClient";
import type { Etablissement } from "../types/types";
import AdminNav from "./admin/Camponents/AdminNav";
import Footer from "../camponents/Footer";
import DomaineScolaire from "./admin/DomaineScolaire";
import { X } from "lucide-react";
import FormField from "./admin/Camponents/FormField";
import { useParams, useNavigate } from "react-router-dom";
import BatimentForm from "./admin/BatimentForm";

const NewEtablissement: React.FC = () => {
  const { codeetab } = useParams<{ codeetab?: string }>();
  const isEditing = !!codeetab;
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [domaine, setDomaine] = useState(false);
  const [showBatimentForm, setShowBatimentForm] = useState(false);
  const [showError, setShowError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [initialLoading, setInitialLoading] = useState(true);
  const handleDelete = async () => {
    if (!form.codeetab) return;
    const { error } = await supabase
      .from("etablissement")
      .delete()
      .eq("codeetab", form.codeetab);

    if (error) {
      setErrorMsg("Erreur lors de la suppression : " + error.message);
    } else {
      navigate("/admin"); // Retour à la liste après suppression
    }
  };
  const [form, setForm] = useState<
    Omit<Etablissement, "images"> & { codeetab: number | null }
  >({
    codeetab: null,
    nometab: "",
    dren: "AMORON'I MANIA",
    cisco: "",
    commune: "",
    zap: "",
    fokontany: "",
    quartier: "",
    couvtelephonique: "",
    couvinternet: "",
    nbenseignantg: null,
    nbenseignantf: null,
    nbsection: null,

    totalcompartimentWc: null,
    pointdeau: "",

    directeur: {
      nomdirecteur: "",
      prendr: "",
      emaildr: "",
      teldr: "",
    },
  });

  // useEffect pour charger l'établissement si c'est une modification
  useEffect(() => {
    if (isEditing && codeetab) {
      const fetchEtablissement = async () => {
        setInitialLoading(true);
        const { data, error } = await supabase
          .from("etablissement")
          .select("*")
          .eq("codeetab", parseInt(codeetab))
          .single();

        if (error) {
          setErrorMsg("Établissement non trouvé ou erreur de chargement.");
        } else {
          setForm(data);
        }
        setInitialLoading(false);
      };
      fetchEtablissement();
    } else {
      setInitialLoading(false);
    }
  }, [codeetab, isEditing]);

  const toggleDomaine = () => {
    if (form.codeetab === null) {
      setShowError(true);
    } else {
      setDomaine(!domaine);
      setShowError(false);
    }
  };
  const toggleBatiment = () => {
    if (form.codeetab === null) {
      setShowError(true);
    } else {
      setShowBatimentForm(!showBatimentForm);
      setShowError(false);
    }
  };

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    const numberFields = [
      "nbenseignantg",
      "nbenseignantf",
      "nbsection",
      "codeetab",
      "totalcompartimentWc",
    ];

    if (name.startsWith("directeur.")) {
      const key = name.split(".")[1] as
        | "nomdirecteur"
        | "prendr"
        | "emaildr"
        | "teldr";
      setForm((prev) => ({
        ...prev,
        directeur: {
          ...prev.directeur,
          [key]: value,
        },
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: numberFields.includes(name)
          ? value === ""
            ? null
            : Number(value)
          : value,
      }));
    }
  }

  function validate() {
    if (form.codeetab === null) return "Le code établissement est requis.";
    if (!form.nometab) return "Le nom de l'établissement est requis.";
    if (!form.dren) return "Le DREN est requis.";
    if (!form.directeur || !form.directeur.nomdirecteur)
      return "Nom du directeur requis.";
    if (!form.directeur || !form.directeur.teldr)
      return "Contact du directeur requis.";
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const validationError = validate();
    if (validationError) {
      setErrorMsg(validationError);
      return;
    }

    setLoading(true);

    let supaError = null;

    if (isEditing) {
      const { error } = await supabase
        .from("etablissement")
        .update(form)
        .eq("codeetab", Number(codeetab));
      supaError = error;
    } else {
      const { error } = await supabase
        .from("etablissement")
        .insert([{ ...form }]);
      supaError = error;
    }

    setLoading(false);

    if (supaError) {
      setErrorMsg(supaError.message);
    } else {
      setSuccessMsg(
        `Établissement ${isEditing ? "mis à jour" : "créé"} avec succès !`
      );
      if (!isEditing) {
        setForm({
          codeetab: null,
          nometab: "",
          dren: "AMORON'I MANIA",
          cisco: "",
          commune: "",
          zap: "",
          fokontany: "",
          quartier: "",
          couvtelephonique: "",
          couvinternet: "",
          nbenseignantg: null,
          nbenseignantf: null,
          nbsection: null,
          totalcompartimentWc: null,
          pointdeau: null,
          directeur: {
            nomdirecteur: "",
            prendr: "",
            emaildr: "",
            teldr: "",
          },
        });
      }
    }
  }

  if (initialLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (isEditing && !form.codeetab) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-3xl text-error">Établissement non trouvé.</h1>
        <button
          onClick={() => navigate("/admin")}
          className="btn btn-primary mt-4"
        >
          Retour à la liste
        </button>
      </div>
    );
  }

  return (
    <div>
      {showError && (
        <div className="toast toast-top z-1000 toast-center">
          <div className="alert alert-error">
            <span>Remplir le code établissement d'abord.</span>
            <span onClick={() => setShowError(false)}>
              <X />
            </span>
          </div>
        </div>
      )}
      <div>
        <AdminNav />
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="flex justify-between rounded-3xl flex-wrap gap-20 px-[3%] py-[3%] bg-base-200">
          <div className="w-[50%] p-8 bg-base-100 rounded-3xl shadow-lg mt-15">
            <h2 className="text-2xl font-bold mb-6 text-center">
              ETABLISSEMENT
            </h2>
            <div className="flex flex-col gap-5">
              <FormField
                label="Code établissement *"
                name="codeetab"
                type="number"
                value={form.codeetab}
                onChange={handleChange}
                required
              />
              <FormField
                label="Nom de l'établissement *"
                name="nometab"
                value={form.nometab ?? ""}
                onChange={handleChange}
                required
              />
              <FormField
                label="DREN *"
                name="dren"
                value={form.dren ?? ""}
                onChange={handleChange}
                required
                disabled
              />
              <label className="form-control">
                <div className="md:flex md:items-center md:justify-between">
                  <span className="label-text font-semibold">CISCO</span>
                  <select
                    name="cisco"
                    className="select"
                    onChange={handleChange}
                    value={form.cisco ?? ""}
                  >
                    <option value="" disabled>
                      CHOISISSEZ UN CISCO
                    </option>
                    <option>AMBOSITRA</option>
                    <option>MANANDRIANA</option>
                    <option>FANDRIANA</option>
                    <option>AMBATOFINANDRAHANA</option>
                  </select>
                </div>
              </label>
              <FormField
                label="Commune"
                name="commune"
                value={form.commune ?? ""}
                onChange={handleChange}
              />
              <FormField
                label="ZAP"
                name="zap"
                value={form.zap ?? ""}
                onChange={handleChange}
              />
              <FormField
                label="Fokontany"
                name="fokontany"
                value={form.fokontany ?? ""}
                onChange={handleChange}
              />
              <FormField
                label="Quartier"
                name="quartier"
                value={form.quartier ?? ""}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="w-[40%] p-8 bg-base-100 rounded-3xl shadow-lg mt-15">
            <h2 className="text-2xl font-bold mb-6 text-center">DIRECTEUR</h2>
            <div className="flex flex-col gap-5">
              <FormField
                label="Nom *"
                name="directeur.nomdirecteur"
                value={form.directeur?.nomdirecteur ?? ""}
                onChange={handleChange}
                required
              />
              <FormField
                label="Prénom"
                name="directeur.prendr"
                value={form.directeur?.prendr ?? ""}
                onChange={handleChange}
              />
              <FormField
                label="Email"
                name="directeur.emaildr"
                type="email"
                value={form.directeur?.emaildr ?? ""}
                onChange={handleChange}
              />
              <FormField
                label="Téléphone *"
                name="directeur.teldr"
                value={form.directeur?.teldr ?? ""}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="w-[50%]  p-8 bg-base-100 rounded-3xl shadow-lg">
            <div className="flex flex-col gap-5">
              <label className="form-control">
                <div className="md:flex md:items-center md:justify-between">
                  <span className="label-text font-semibold">
                    Couverture téléphonique
                  </span>
                  <select
                    name="couvtelephonique"
                    className="select"
                    onChange={handleChange}
                    value={form.couvtelephonique ?? ""}
                  >
                    <option>TELMA</option>
                    <option>AIRTEL</option>
                    <option>ORANGE</option>
                  </select>
                </div>
              </label>
              <label className="form-control">
                <div className="md:flex md:items-center md:justify-between">
                  <span className="label-text font-semibold">
                    Couverture internet
                  </span>
                  <select
                    name="couvinternet"
                    className="select"
                    onChange={handleChange}
                    value={form.couvinternet ?? ""}
                  >
                    <option>TELMA</option>
                    <option>AIRTEL</option>
                    <option>ORANGE</option>
                    <option>STARLINK</option>
                  </select>
                </div>
              </label>
              <FormField
                label="Nombre d'enseignants Hommes"
                name="nbenseignantg"
                type="number"
                value={form.nbenseignantg ?? ""}
                onChange={handleChange}
              />
              <FormField
                label="Nombre d'enseignants Femmes"
                name="nbenseignantf"
                type="number"
                value={form.nbenseignantf ?? ""}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="w-[40%]  p-8 bg-base-100 rounded-3xl shadow-lg">
            <div className="flex flex-col gap-5">
              <FormField
                label="Nombre total des compartiments du WC"
                name="totalcompartimentWc"
                type="number"
                value={form.totalcompartimentWc ?? ""}
                onChange={handleChange}
              />
              <label className="form-control">
                <div className="md:flex md:items-center md:justify-between">
                  <span className="label-text font-semibold">Point D'eau</span>
                  <select
                    name="pointdeau"
                    className="select"
                    onChange={handleChange}
                    value={form.pointdeau ?? ""}
                  >
                    <option>JIRAMA</option>
                    <option>PUITS</option>
                    <option>Autres</option>
                  </select>
                </div>
              </label>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-6 items-center justify-center w-full max-w-md mx-auto">
  {/* Alertes */}
  {errorMsg && (
    <div className="alert alert-error w-full shadow-lg">
      <svg xmlns="http://www.w3.org/2000/svg" 
           className="stroke-current shrink-0 h-6 w-6" fill="none" 
           viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
              d="M12 9v2m0 4h.01M12 5.5a6.5 6.5 0 100 13 
              6.5 6.5 0 000-13z" />
      </svg>
      <span>{errorMsg}</span>
    </div>
  )}
  {successMsg && (
    <div className="alert alert-success w-full shadow-lg">
      <svg xmlns="http://www.w3.org/2000/svg" 
           className="stroke-current shrink-0 h-6 w-6" fill="none" 
           viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
              d="M5 13l4 4L19 7" />
      </svg>
      <span>{successMsg}</span>
    </div>
  )}

  {/* Bouton principal */}
  <button
    type="submit"
    className={`btn btn-primary w-full h-12 ${loading ? "loading" : ""}`}
    disabled={loading}
  >
    {loading
      ? "Enregistrement..."
      : isEditing
      ? "Mettre à jour"
      : "Créer l'établissement"}
  </button>

  {/* Suppression si édition */}
  {isEditing && (
    <>
      <button
        className="btn btn-outline btn-error w-full h-12"
        onClick={() => setShowDeleteModal(true)}
      >
        Supprimer l'établissement
      </button>

      {/* Modal DaisyUI */}
      <input
        type="checkbox"
        id="delete-modal"
        className="modal-toggle"
        checked={showDeleteModal}
        readOnly
      />
      <div className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg text-error">
            Confirmer la suppression ?
          </h3>
          <p className="py-4 text-sm">
            ⚠️ Cette action est <span className="font-bold">irréversible</span>. 
            Voulez-vous vraiment continuer ?
          </p>
          <div className="modal-action">
            <button className="btn btn-error" onClick={handleDelete}>
              Oui, supprimer
            </button>
            <button
              className="btn btn-ghost"
              onClick={() => setShowDeleteModal(false)}
            >
              Annuler
            </button>
          </div>
        </div>
      </div>
    </>
  )}
</div>

      </form>
      <div className="flex flex-col gap-5"></div>
      {!showBatimentForm && (
        <button
          className="btn btn-primary px-[3%] m-15"
          onClick={toggleBatiment}
        >
          BATIMENT
        </button>
      )}
      {showBatimentForm && (
        <div>
          <button
            className="btn btn-primary px-[3%] m-15"
            onClick={toggleBatiment}
          >
            FERMER
          </button>
          <BatimentForm codeetab={form.codeetab} />
        </div>
      )}
      {!domaine && (
        <button
          className="btn btn-primary px-[3%] m-15"
          onClick={toggleDomaine}
        >
          DOMAINE SCOLAIRE
        </button>
      )}
      {domaine && (
        <div>
          <button
            className="btn btn-primary px-[3%] m-15"
            onClick={toggleDomaine}
          >
            FERMER
          </button>
          <DomaineScolaire codeetab={form.codeetab} />
        </div>
      )}
      <Footer />
    </div>
  );
};

export default NewEtablissement;
