import React, { useEffect, useRef, useState } from "react";
import type { Salle } from "../../types/types";
import AdminNav from "./Camponents/AdminNav";
import { Edit, PlusCircleIcon, Trash } from "lucide-react";
import supabase from "../../helper/SupabaseClient";
import FormField from "./Camponents/FormField";
import { useParams } from "react-router-dom";



function SalleDetails() {
  const { idBat } = useParams<{ idBat: string }>();

  const id = idBat ? Number(idBat) : null;
 

  const [salles, setSalles] = useState<Salle[]>([]);
  const [selectedSalle, setSelectedSalle] = useState<Salle | null>(null);
  const [formSalle, setFormSalle] = useState<Salle>({
    siglesalle: "",
    niveausalle: null,
    affectationsalle: "",
    estoperartionnel: null,
    estelectrifier: null,
    etatsalle: "",
    longueurint: null,
    hauteursp: null,
    nbelevef: null,
    nbeleveg: null,
    idbat: id,
  });

  const modalRef = useRef<HTMLDialogElement | null>(null);

  // Modal suppression
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteSalleId, setDeleteSalleId] = useState<number | null>(null);

  useEffect(() => {
    if (id) fetchSalles();
  }, [id]);

  const fetchSalles = async () => {
    const { data, error } = await supabase
      .from("salle")
      .select("*")
      .eq("idbat", id);
    if (error) console.log("Error while fetching salles:", error);
    else setSalles(data as Salle[]);
  };

  const openModal = (salle?: Salle) => {
    if (salle) {
      setSelectedSalle(salle);
      setFormSalle(salle);
    } else {
      setSelectedSalle(null);
      setFormSalle({
        siglesalle: "",
        niveausalle: null,
        affectationsalle: "",
        estoperartionnel: null,
        estelectrifier: null,
        etatsalle: "",
        longueurint: null,
        hauteursp: null,
        nbelevef: null,
        nbeleveg: null,
        surface:null,
        idbat: id,
      });
    }
    modalRef.current?.showModal();
  };

  const handleSave = async () => {
    if (selectedSalle && selectedSalle.idsalle !== undefined) {
      // update
      const { error } = await supabase
        .from("salle")
        .update(formSalle)
        .eq("idsalle", selectedSalle.idsalle); // bien correspondre au nom de la colonne
      if (error) console.error("Erreur update:", error);
    } else {
      // insert
      const { error } = await supabase.from("salle").insert([formSalle]);
      if (error) console.error("Erreur insert:", error);
    }

    fetchSalles(); // refresh après insert/update
    modalRef.current?.close();
  };
  const openDeleteModal = (idsalle: number) => {
    setDeleteSalleId(idsalle);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirmed = async () => {
    if (deleteSalleId !== null) {
      const { error } = await supabase
        .from("salle")
        .delete()
        .eq("idsalle", deleteSalleId);
      if (error) console.error("Erreur delete:", error);
      else fetchSalles();
    }
    setShowDeleteModal(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormSalle((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : type === "number"
          ? value === ""
            ? null
            : Number(value)
          : value,
    }));
  };

  if (!id) return <p className="text-center text-2xl">❌ ID du bâtiment invalide</p>;

  return (
    <div>
      <AdminNav />

      <div className="flex mt-10 ">
        <div className="overflow-x-auto mx-auto rounded-box border border-base-content/5 bg-base-100">
          <table className="table">
            <thead>
              <tr>
                <th>Sigle</th>
                <th>Niveau</th>
                <th>Affectation</th>
                <th>Etat</th>
                <th>Operationnel</th>
                <th>Electrifier</th>
                <th>longueur interieur(m)</th>
                <th>Surface(m2)</th>

                <th>
                  Hauteur Sous <br />
                  Plafond(m)
                </th>
                <th>
                  Nombre des <br /> eleves filles
                </th>
                <th>
                  Nombre des <br /> eleves garçons
                </th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {salles.map((salle) => (
                <tr key={salle.idsalle}>
                  <th>{salle.siglesalle}</th>
                  <td>{salle.niveausalle}</td>
                  <td>{salle.affectationsalle}</td>
                  <td>{salle.etatsalle}</td>
                  <td>{salle.estoperartionnel ? "Oui" : "Non"}</td>
                  <td>{salle.estelectrifier ? "Oui" : "Non"}</td>
                  <td>{salle.longueurint}</td>
                  <td>{salle.hauteursp}</td>
                  <td>{salle.nbelevef}</td>
                  <td>{salle.nbeleveg}</td>
                  <td>{salle.surface}</td>
                  <td className="flex gap-4">
                    <button
                      onClick={() => openModal(salle)}
                      className="btn btn-sm btn-primary"
                    >
                      <Edit size={20} />
                    </button>
                    <button
                      onClick={() => openDeleteModal(salle.idsalle!)}
                      className="btn btn-sm btn-error"
                    >
                      <Trash size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="px-[5%] py-5">
        <button className="btn btn-ghost" onClick={() => openModal()}>
          <PlusCircleIcon /> Ajouter un salle
        </button>
      </div>

      {/* Modal Formulaire */}
      <dialog id="my_modal_4" className="modal" ref={modalRef}>
        <div className="modal-box w-12/12 max-w-7xl">
          <div className="flex flex-col gap-5">
            <FormField
              type="text"
              label="Sigle de la salle"
              value={formSalle.siglesalle}
              name="siglesalle"
              onChange={handleChange}
            />
            <FormField
              type="number"
              label="Niveau de la salle"
              value={formSalle.niveausalle ?? ""}
              name="niveausalle"
              onChange={handleChange}
            />
            <FormField
              type="text"
              label="Affectation de la salle"
              value={formSalle.affectationsalle}
              name="affectationsalle"
              onChange={handleChange}
            />
            <FormField
              type="text"
              label="État de la salle"
              value={formSalle.etatsalle}
              name="etatsalle"
              onChange={handleChange}
            />
            <FormField
              type="checkbox"
              label="Salle opérationnelle"
              name="estoperartionnel"
              checked={formSalle.estoperartionnel ?? false}
              onChange={handleChange}
            />
            <FormField
              type="checkbox"
              label="Salle electrifier"
              name="estelectrifier"
              checked={formSalle.estelectrifier ?? false}
              onChange={handleChange}
            />
            <FormField
              type="number"
              label="Longueur intérieure (m)"
              value={formSalle.longueurint ?? ""}
              name="longueurint"
              onChange={handleChange}
            />
            <FormField
              type="number"
              label="Hauteur sous plafond (m)"
              value={formSalle.hauteursp ?? ""}
              name="hauteursp"
              onChange={handleChange}
            />
            <FormField
              type="number"
              label="Nombre d'élèves filles"
              value={formSalle.nbelevef ?? ""}
              name="nbelevef"
              onChange={handleChange}
            />
            <FormField
              type="number"
              label="Nombre d'élèves garçons"
              value={formSalle.nbeleveg ?? ""}
              name="nbeleveg"
              onChange={handleChange}
            />
            <FormField
              type="number"
              label="Surface"
              value={formSalle.surface ?? ""}
              name="surface"
              onChange={handleChange}
            />
          </div>

          <div className="modal-action">
            <button className="btn" onClick={() => modalRef.current?.close()}>
              Annuler
            </button>
            <button className="btn btn-primary" onClick={handleSave}>
              {selectedSalle ? "Enregistrer" : "Ajouter"}
            </button>
          </div>
        </div>
      </dialog>

      {/* Modal DaisyUI suppression */}
      {showDeleteModal && (
        <dialog className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Confirmer la suppression</h3>
            <p className="py-4">Voulez-vous vraiment supprimer cette salle ?</p>
            <div className="modal-action">
              <button className="btn" onClick={() => setShowDeleteModal(false)}>
                Annuler
              </button>
              <button className="btn btn-error" onClick={handleDeleteConfirmed}>
                Supprimer
              </button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
}

export default SalleDetails;
