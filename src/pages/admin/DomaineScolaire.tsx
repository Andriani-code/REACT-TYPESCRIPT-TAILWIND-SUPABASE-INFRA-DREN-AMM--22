import { useEffect, useState } from "react";
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
  const [titre, setTitre] = useState(form.esttitre ?? false);

  // Met à jour esttitre dans le form
  useEffect(() => {
    setForm({ ...form, esttitre: titre });
  }, [titre]);

  const handleCheckboxChange = (key: keyof Designation, value: boolean) => {
    setForm({ ...form, [key]: value });
  };

  const handleNumberChange = (key: keyof Designation, value: number) => {
    setForm({ ...form, [key]: value });
  };

  const handleSelectChange = (key: keyof Designation, value: string) => {
    setForm({ ...form, [key]: value });
  };

  // Pour terrains domanial/communal/autres
  const handleTerrainChange = (val: "domanial" | "communal" | "autres") => {
    setForm({
      ...form,
      estdomanial: val === "domanial",
      estcommunal: val === "communal",
      autres: val === "autres",
    });
  };

  return (
    <div className="w-[40%] ml-5 p-8 bg-base-100 rounded-lg shadow-lg mt-20">
      <h2 className="text-xl font-bold mb-6 text-center">
        DESIGNATION : {title}
      </h2>
      <form className="flex flex-col gap-5">
        {/* Dans l'enceinte */}
        <label className="form-control">
          <div className="md:flex md:items-center md:justify-between">
            <span className="label-text font-semibold">
              DANS L'ENCEINTE DE L'ETABLISSEMENT
            </span>
            <input
              type="checkbox"
              checked={form.estenceinte_etab ?? false}
              onChange={(e) =>
                handleCheckboxChange("estenceinte_etab", e.target.checked)
              }
            />
          </div>
        </label>

        {/* Titre ou non */}
        <div className="flex justify-between">
          <p>{titre ? "TERRAIN TITRE" : "TERRAIN NON TITRE"}</p>
          <input
            type="checkbox"
            checked={titre}
            onChange={() => setTitre(!titre)}
          />
        </div>

        {titre ? (
          <div className="flex flex-col gap-5">
            <RadioOption
              label="MEN"
              name={`titre-${title}`}
              checked={form.estmen ?? false}
              onChange={() =>
                setForm({ ...form, estmen: true, estprive: false, autres: false })
              }
            />
            <RadioOption
              label="TIERCE PERSONNE OU ORGANISME PRIVE"
              name={`titre-${title}`}
              checked={form.estprive ?? false}
              onChange={() =>
                setForm({ ...form, estmen: false, estprive: true, autres: false })
              }
            />
            <RadioOption
              label="Autres"
              name={`titre-${title}`}
              checked={form.autres ?? false}
              onChange={() =>
                setForm({ ...form, estmen: false, estprive: false, autres: true })
              }
            />
            <NumberInput
              label="Numero cadastre"
              value={form.numcadastre ?? 0}
              onChange={(val) => handleNumberChange("numcadastre", val)}
            />
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            <RadioOption
              label="TERRAIN DOMANIAL"
              name={`terrain-${title}`}
              checked={form.estdomanial ?? false}
              onChange={() => handleTerrainChange("domanial")}
            />
            <RadioOption
              label="TERRAIN COMMUNAL"
              name={`terrain-${title}`}
              checked={form.estcommunal ?? false}
              onChange={() => handleTerrainChange("communal")}
            />
            <RadioOption
              label="Autres"
              name={`terrain-${title}`}
              checked={form.autres ?? false}
              onChange={() => handleTerrainChange("autres")}
            />
          </div>
        )}

        <NumberInput
          label="Superficie"
          value={form.superficiedesign ?? 0}
          onChange={(val) => handleNumberChange("superficiedesign", val)}
        />

        <SelectInput
          label="Litigieux"
          value={form.litigieux ?? "Non"}
          options={["Une partie", "En totalité", "Non"]}
          onChange={(val) => handleSelectChange("litigieux", val)}
        />
      </form>
    </div>
  );
};

// Composants utilitaires
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
      <select
        className="select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((opt, i) => (
          <option key={i} value={opt} className="text-sm">
            {opt}
          </option>
        ))}
      </select>
    </div>
  </label>
);

export default function DomaineScolaire({ codeetab }: Etablissement) {
  const [sectionsData, setSectionsData] = useState<Designation[]>([]);

  // Charger les désignations depuis Supabase
  const fetchDesignations = async () => {
    const { data, error } = await supabase
      .from("designation")
      .select("*")
      .eq("codeetab", codeetab);

    if (error) console.error(error);
    else setSectionsData(data as Designation[]);
  };

  useEffect(() => {
    fetchDesignations();
  }, [codeetab]);

  const handleSave = async () => {
    for (const form of sectionsData) {
      if (form.numdesign) {
        const { error } = await supabase
          .from("designation")
          .update(form)
          .eq("numdesign", form.numdesign);
        if (error) console.error(error);
      } else {
        const { error } = await supabase.from("designation").insert([form]);
        if (error) console.error(error);
      }
    }
    fetchDesignations();
    alert("Enregistrement effectué !");
  };

  const sections: DesignationType[] = [
    "TERRAIN BATI",
    "COUR",
    "TERRAIN DE SPORT",
    "JARDIN POTAGER SCOLAIRE",
    "TERRAIN DE REBOISEMENT",
    "TERRAIN LIBRE",
    "AUTRES",
  ];

  return (
    <div className="bg-base-200 rounded-3xl px-[3%] py-[3%]">
      <h2 className="text-center text-2xl text-primary-content font-semibold mt-10">
        DOMAINE SCOLAIRE
      </h2>
      <div className="flex justify-between flex-wrap gap-20 px-[3%]">
        {sections.map((title, idx) => (
          <DesignationSection
            key={title}
            title={title}
            form={
              sectionsData[idx] ??
              ({
                nomdesign: title,
                codeetab,
              } as Designation)
            }
            setForm={(form) => {
              const newData = [...sectionsData];
              newData[idx] = form;
              setSectionsData(newData);
            }}
          />
        ))}
      </div>

      <div className="flex justify-center mt-10">
        <button className="btn btn-primary" onClick={handleSave}>
          Enregistrer les modifications
        </button>
      </div>
    </div>
  );
}
