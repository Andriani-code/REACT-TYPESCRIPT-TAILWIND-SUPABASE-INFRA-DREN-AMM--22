import { useEffect, useMemo, useState } from "react";
import { type Designation, type Etablissement } from "../../types/types";
import supabase from "../../helper/SupabaseClient";

type DesignationType =
  | "TERRAIN BATI"
  | "COUR"
  | "TERRAIN DE SPORT"
  | "JARDIN POTAGER SCOLAIRE"
  | "TERRAIN DE REBOISEMENT"
  | "TERRAIN LIBRE"
  | "AUTRES";

interface SectionProps {
  title: DesignationType;
  form: Designation;
  setForm: (form: Designation) => void;
}

const DesignationSection = ({ title, form, setForm }: SectionProps) => {
  const titre = form.esttitre ?? false;

  const setField = <K extends keyof Designation>(key: K, value: Designation[K]) => {
    setForm({ ...form, [key]: value });
  };

  const setTerrainOwner = (val: "domanial" | "communal" | "autres") => {
    setForm({
      ...form,
      estdomanial: val === "domanial",
      estcommunal: val === "communal",
      autres: val === "autres",
    });
  };

  const setTitreOwner = (val: "men" | "prive" | "autres") => {
    setForm({
      ...form,
      estmen: val === "men",
      estprive: val === "prive",
      autres: val === "autres",
    });
  };

  return (
    <div className="w-[40%] ml-5 p-8 bg-base-100 rounded-lg shadow-lg mt-20">
      <h2 className="text-xl font-bold mb-6 text-center">DESIGNATION : {title}</h2>

      <form className="flex flex-col gap-5">
        <label className="form-control">
          <div className="md:flex md:items-center md:justify-between">
            <span className="label-text font-semibold">
              DANS L&apos;ENCEINTE DE L&apos;ETABLISSEMENT
            </span>
            <input
              type="checkbox"
              checked={form.estenceinte_etab ?? false}
              onChange={(e) => setField("estenceinte_etab", e.target.checked)}
            />
          </div>
        </label>

        <div className="flex justify-between">
          <p>{titre ? "TERRAIN TITRE" : "TERRAIN NON TITRE"}</p>
          <input
            type="checkbox"
            checked={titre}
            onChange={() => setField("esttitre", !titre)}
          />
        </div>

        {titre ? (
          <div className="flex flex-col gap-5">
            <RadioOption
              label="MEN"
              name={`titre-${title}`}
              checked={form.estmen ?? false}
              onChange={() => setTitreOwner("men")}
            />
            <RadioOption
              label="TIERCE PERSONNE OU ORGANISME PRIVE"
              name={`titre-${title}`}
              checked={form.estprive ?? false}
              onChange={() => setTitreOwner("prive")}
            />
            <RadioOption
              label="Autres"
              name={`titre-${title}`}
              checked={form.autres ?? false}
              onChange={() => setTitreOwner("autres")}
            />
            <NumberInput
              label="Numero cadastre"
              value={form.numcadastre ?? 0}
              onChange={(val) => setField("numcadastre", val)}
            />
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            <RadioOption
              label="TERRAIN DOMANIAL"
              name={`terrain-${title}`}
              checked={form.estdomanial ?? false}
              onChange={() => setTerrainOwner("domanial")}
            />
            <RadioOption
              label="TERRAIN COMMUNAL"
              name={`terrain-${title}`}
              checked={form.estcommunal ?? false}
              onChange={() => setTerrainOwner("communal")}
            />
            <RadioOption
              label="Autres"
              name={`terrain-${title}`}
              checked={form.autres ?? false}
              onChange={() => setTerrainOwner("autres")}
            />
          </div>
        )}

        <NumberInput
          label="Superficie"
          value={form.superficiedesign ?? 0}
          onChange={(val) => setField("superficiedesign", val)}
        />

        <SelectInput
          label="Litigieux"
          value={form.litigieux ?? "Non"}
          options={["Une partie", "En totalité", "Non"]}
          onChange={(val) => setField("litigieux", val)}
        />
      </form>
    </div>
  );
};

const RadioOption = ({
  label,
  name,
  checked,
  onChange,
}: {
  label: string;
  name: string;
  checked: boolean;
  onChange: () => void;
}) => (
  <div className="md:flex md:items-center md:justify-between px-[8%]">
    <span className="label-text font-semibold">{label}</span>
    <input type="radio" name={name} checked={checked} onChange={onChange} />
  </div>
);

const NumberInput = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (val: number) => void;
}) => (
  <label className="form-control">
    <div className="md:flex md:items-center md:justify-between">
      <span className="label-text font-semibold">{label}</span>
      <input
        type="number"
        min={0}
        className="input input-bordered"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  </label>
);

const SelectInput = ({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (val: string) => void;
}) => (
  <label className="form-control">
    <div className="md:flex md:items-center md:justify-between">
      <span className="label-text font-semibold">{label}</span>
      <select className="select" value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((opt) => (
          <option key={opt} value={opt} className="text-sm">
            {opt}
          </option>
        ))}
      </select>
    </div>
  </label>
);

export default function DomaineScolaire({ codeetab }: Etablissement) {
  const [sectionsData, setSectionsData] = useState<Designation[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const sections: DesignationType[] = [
    "TERRAIN BATI",
    "COUR",
    "TERRAIN DE SPORT",
    "JARDIN POTAGER SCOLAIRE",
    "TERRAIN DE REBOISEMENT",
    "TERRAIN LIBRE",
    "AUTRES",
  ];

  const fetchDesignations = async () => {
    setLoading(true);
    setMessage(null);

    const { data, error } = await supabase
      .from("designation")
      .select("*")
      .eq("codeetab", codeetab);

    if (error) {
      console.error(error);
      setSectionsData([]);
      setMessage("Impossible de charger les données.");
    } else {
      setSectionsData((data ?? []) as Designation[]);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchDesignations();
  }, [codeetab]);

  const designationByName = useMemo(() => {
    const map = new Map<string, Designation>();
    for (const d of sectionsData) map.set(d.nomdesign, d);
    return map;
  }, [sectionsData]);

  const upsertLocalDesignation = (nomdesign: string, updated: Designation) => {
    setSectionsData((prev) => {
      const next = [...prev];
      const index = next.findIndex((d) => d.nomdesign === nomdesign);
      if (index >= 0) next[index] = updated;
      else next.push(updated);
      return next;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    try {
      const tasks = sectionsData.map((d) => {
        if (d.numdesign) {
          return supabase.from("designation").update(d).eq("numdesign", d.numdesign);
        }
        return supabase.from("designation").insert([d]);
      });

      const results = await Promise.all(tasks);
      const firstError = results.find((r) => r.error)?.error;

      if (firstError) {
        console.error(firstError);
        setMessage("Enregistrement partiel ou échoué. Vérifiez les données.");
        return;
      }

      await fetchDesignations();
      setMessage("Enregistrement effectué.");
    } catch (err) {
      console.error(err);
      setMessage("Erreur réseau. Réessayez.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-base-200 rounded-3xl px-[3%] py-[3%]">
      <h2 className="text-center text-2xl text-primary-content font-semibold mt-10">
        DOMAINE SCOLAIRE
      </h2>

      {loading ? (
        <div className="flex justify-center mt-10">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : (
        <div className="flex justify-between flex-wrap gap-20 px-[3%]">
          {sections.map((title) => (
            <DesignationSection
              key={title}
              title={title}
              form={
                designationByName.get(title) ??
                ({
                  nomdesign: title,
                  codeetab,
                } as Designation)
              }
              setForm={(updated) => upsertLocalDesignation(title, updated)}
            />
          ))}
        </div>
      )}

      {message && (
        <p className="text-center mt-8 text-sm font-medium">
          {message}
        </p>
      )}

      <div className="flex justify-center mt-10">
        <button className="btn btn-primary" onClick={handleSave} disabled={saving || loading}>
          {saving ? "Enregistrement..." : "Enregistrer les modifications"}
        </button>
      </div>
    </div>
  );
}
