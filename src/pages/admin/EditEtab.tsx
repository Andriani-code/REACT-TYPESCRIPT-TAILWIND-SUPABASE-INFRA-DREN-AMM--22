import { useForm } from "react-hook-form";
import supabase from "../../helper/SupabaseClient";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import type { Etablissement } from "../../types/types";

export default function EtablissementForm() {
  const { register, handleSubmit, setValue } = useForm<Etablissement>();
  const navigate = useNavigate();
  const { code } = useParams<{ code: string }>();

  const onSubmit = async (data: Etablissement) => {
    if (code) {
      // UPDATE
      await supabase
        .from("etablissement")
        .update(data)
        .eq("codeEtab", Number(code));
    } else {
      // CREATE
      await supabase.from("etablissement").insert(data);
    }
    navigate("/admin/home");
  };

  useEffect(() => {
    if (code) {
      supabase
        .from("etablissement")
        .select("*")
        .eq("codeetab", Number(code))
        .single()
        .then(({ data }) => {
          if (data) {
            Object.keys(data).forEach((key) => {
              setValue(key as keyof Etablissement, data[key]);
            });
          }
        });
    }
  }, [code, setValue]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="p-4 max-w-lg mx-auto space-y-4"
    >
      <input
        type="number"
        {...register("codeetab", { required: true })}
        placeholder="Code établissement"
        className="input input-bordered w-full"
      />
      <input
        type="text"
        {...register("nometab", { required: true })}
        placeholder="Nom établissement"
        className="input input-bordered w-full"
      />
      <input
        type="text"
        {...register("dren")}
        placeholder="DREN"
        className="input input-bordered w-full"
      />
      {/* Ajoute les autres champs ici */}
      <button type="submit" className="btn btn-primary w-full">
        Enregistrer
      </button>
    </form>
  );
}
