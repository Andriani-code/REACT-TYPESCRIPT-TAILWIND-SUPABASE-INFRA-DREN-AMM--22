import React, { useEffect, useRef, useState } from "react";
import type { Batiment } from "../../types/types";
import { Edit2, PlusCircle, Trash2 } from "lucide-react";
import FormField from "./Camponents/FormField";
import { FcAbout } from "react-icons/fc";
import supabase from "../../helper/SupabaseClient";
import { Link } from "react-router-dom";

function BatimentForm({ codeetab }: Batiment) {
  const modalRef = useRef<HTMLDialogElement | null>(null);

  const [batiments, setBatiments] = useState<Batiment[]>([]);
  const [selectedBatiment, setSelectedBatiment] = useState<Batiment | null>(
    null
  );

  const [form, setForm] = useState<Batiment>({
    siglebat: "",
    nbniveau: 0,
    annrecprovc: 0,
    anndefc: 0,
    srcfic: "",
    agencec: "",
    anneer: 0,
    srcfir: "",
    agencer: "",
    dispositiveac: false,
    codeetab: codeetab,
  });

  // Charger les bâtiments
  useEffect(() => {
    fetchBatiments();
  }, [codeetab]);

  const fetchBatiments = async () => {
    const { data, error } = await supabase
      .from("batiment")
      .select("*")
      .eq("codeetab", codeetab);

    if (error) {
      console.error("Erreur fetch batiments :", error);
    } else {
      setBatiments(data as Batiment[]);
    }
  };

  const openModal = (batiment?: Batiment) => {
    if (batiment) {
      setSelectedBatiment(batiment);
      setForm({ ...batiment });
    } else {
      setSelectedBatiment(null);
      setForm({
        siglebat: "",
        nbniveau: 0,
        annrecprovc: 0,
        anndefc: 0,
        srcfic: "",
        agencec: "",
        anneer: 0,
        srcfir: "",
        agencer: "",
        dispositiveac: false,
        codeetab: codeetab,
      });
    }
    modalRef.current?.showModal();
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const target = e.target as HTMLInputElement; // cast ici
    const { name, value, type } = target;

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? target.checked
          : type === "number"
          ? Number(value)
          : value,
    }));
  };

  const handleSave = async () => {
    if (selectedBatiment) {
      const { error } = await supabase
        .from("batiment")
        .update(form)
        .eq("idbat", selectedBatiment.idbat);

      if (error) console.error("Erreur update:", error);
    } else {
      const { error } = await supabase.from("batiment").insert([form]);
      if (error) console.error("Erreur insert:", error);
    }

    modalRef.current?.close();
    fetchBatiments();
  };

  const handleDelete = async (idbat: number | null |undefined) => {
    if (!idbat) return;
    if (!confirm("Voulez-vous vraiment supprimer ce bâtiment ?")) return;

    const { error } = await supabase
      .from("batiment")
      .delete()
      .eq("idbat", idbat);
    if (error) {
      console.error("Erreur suppression:", error);
    } else {
      fetchBatiments();
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-center text-accent mb-4">
        BATIMENTS SCOLAIRES ET PARTENARIAT
      </h2>

      {batiments.map((batiment) => (
        <div
          key={batiment.idbat}
          className="flex flex-col m-3 p-[2%] rounded-2xl bg-base-200"
        >
          <div className="flex justify-between items-center w-full">
            <div>
              <h2 className="text-2xl text-primary font-bold">
                Batiment {batiment.siglebat}
              </h2>
              <p className="text-sm">
                Nombre des niveaux : {batiment.nbniveau}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                className="btn btn-active"
                onClick={() => openModal(batiment)}
              >
                <Edit2 size={20} />
              </button>
              <button className="btn btn-primary">
                <FcAbout size={20} />
                <Link to={`/admin/salle/${batiment.idbat}`}>jdwhkj</Link>
              </button>
              <button
                className="btn btn-sm btn-error"
                onClick={() => handleDelete(batiment.idbat)}
              >
                <Trash2 size={18} /> Supprimer
              </button>
            </div>
          </div>

          <div className="mt-4 p-3 bg-base-100 rounded-lg flex flex-col gap-2">
            <h3 className="font-semibold text-lg">Construction :</h3>
            <p>Année réception définitive : {batiment.anndefc}</p>
            <p>Année réception provisoire : {batiment.annrecprovc}</p>
            <p>Source financement : {batiment.srcfic}</p>
            <p>Agence exécution : {batiment.agencec}</p>

            <h3 className="font-semibold text-lg mt-2">
              Dernière réhabilitation :
            </h3>
            <p>Année : {batiment.anneer}</p>
            <p>Source financement : {batiment.srcfir}</p>
            <p>Agence exécution : {batiment.agencer}</p>

            <h3 className="font-semibold text-lg mt-2">
              Informations générales :
            </h3>
            <p>Dispositif AC : {batiment.dispositiveac ? "Oui" : "Non"}</p>
            <p>Code établissement : {batiment.codeetab}</p>
          </div>
        </div>
      ))}

      {/* MODAL */}
      <dialog id="my_modal_4" className="modal" ref={modalRef}>
        <div className="modal-box w-12/12 max-w-7xl">
          <h3 className="font-bold text-lg">
            {selectedBatiment ? "Modifier le batiment" : "Ajouter un batiment"}
          </h3>

          <div className="flex gap-20">
            <div className="flex flex-col gap-3 items-center justify-center">
              <FormField
                label="Sigle du batiment"
                name="siglebat"
                value={form.siglebat}
                onChange={handleChange}
              />
              <FormField
                label="Nombre de niveau"
                type="number"
                name="nbniveau"
                value={form.nbniveau}
                onChange={handleChange}
              />
              {/* Checkbox Dispositif anti-cyclonique */}
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="dispositiveac"
                  checked={form.dispositiveac}
                  onChange={handleChange}
                />
                Dispositif anti-cyclonique
              </label>
            </div>

            <div className="flex flex-col gap-3">
              <h2 className="text text-primary-content">CONSTRUCTION</h2>
              <FormField
                label="Année de réception"
                type="number"
                name="anndefc"
                value={form.anndefc}
                onChange={handleChange}
              />
              <FormField
                label="Année de réception Provisoire"
                type="number"
                name="annrecprovc"
                value={form.annrecprovc}
                onChange={handleChange}
              />
              <FormField
                label="Source de financement"
                name="srcfic"
                value={form.srcfic}
                onChange={handleChange}
              />
              <FormField
                label="Agence d'execution"
                name="agencec"
                value={form.agencec}
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-col gap-3">
              <h2 className="text text-primary-content">
                DERNIERE REHABILITATION
              </h2>
              <FormField
                label="Année"
                type="number"
                name="anneer"
                value={form.anneer}
                onChange={handleChange}
              />
              <FormField
                label="Source de financement"
                name="srcfir"
                value={form.srcfir}
                onChange={handleChange}
              />
              <FormField
                label="Agence d'execution"
                name="agencer"
                value={form.agencer}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="modal-action">
            <button className="btn" onClick={() => modalRef.current?.close()}>
              Annuler
            </button>
            <button className="btn btn-primary" onClick={handleSave}>
              {selectedBatiment ? "Enregistrer" : "Ajouter"}
            </button>
          </div>
        </div>
      </dialog>

      <button
        onClick={() => openModal()}
        className="btn btn-sm btn-secondary ml-20 mt-5"
      >
        <PlusCircle size={20} /> Ajouter un batiment
      </button>
    </div>
  );
}

export default BatimentForm;
