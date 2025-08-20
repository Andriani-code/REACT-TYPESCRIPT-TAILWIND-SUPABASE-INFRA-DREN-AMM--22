import { useEffect, useMemo, useState } from "react";
import {
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  BarChart,
  Bar,
} from "recharts";
import supabase from "../../helper/SupabaseClient";
import Footer from "../../camponents/Footer";
import AdminNav from "./Camponents/AdminNav";

// --- Types ---
export interface Salle {
  idsalle?: number;
  siglesalle: string;
  niveausalle?: number | null;
  affectationsalle: string | null;
  etatsalle: string | null;
  estoperartionnel: boolean | null;
  estelectrifier: boolean | null;
  longueurint?: number | null;
  hauteursp: number | null;
  nbelevef: number | null;
  nbeleveg: number | null;
  idbat: number;
}
export interface Etablissement {
  codeetab: number;
  nometab?: string | null;
  dren?: string | null;
  cisco?: string | null;
  commune?: string | null;
  zap?: string | null;
  fokontany?: string | null;
  quartier?: string | null;
  couvtelephonique?: string | null;
  couvinternet?: string | null;
  nbenseignantg?: number | null;
  nbenseignantf?: number | null;
  nbsectiong?: number | null;
  nbsectionf?: number | null;
}
export interface Batiment {
  idbat?: number;
  siglebat: string | null;
  nbniveau: number | null;
  annrecprovc: number | null;
  anndefc: number | null;
  srcfic: string | null;
  agencec: string | null;
  anneer: number | null;
  srcfir: string | null;
  agencer: string | null;
  dispositiveac: boolean;
  codeetab?: number | null;
}

// --- Widgets ---
function StatCard({
  title,
  value,
  sub,
}: {
  title: string;
  value: string | number;
  sub?: string;
}) {
  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title text-sm opacity-70">{title}</h2>
        <p className="text-3xl font-bold">{value}</p>
        {sub && <p className="text-xs opacity-60">{sub}</p>}
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="h-28 bg-base-200 rounded-2xl" />
      ))}
    </div>
  );
}

// --- Page Dashboard ---
export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [etabs, setEtabs] = useState<Etablissement[]>([]);
  const [bats, setBats] = useState<Batiment[]>([]);
  const [salles, setSalles] = useState<Salle[]>([]);

  // --- Chargement des données ---
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [etabRes, batRes, salleRes] = await Promise.all([
        supabase.from("etablissement").select("*"),
        supabase.from("batiment").select("*"),
        supabase.from("salle").select("*"),
      ]);

      if (!etabRes.error && etabRes.data)
        setEtabs(etabRes.data as Etablissement[]);
      if (!batRes.error && batRes.data) setBats(batRes.data as Batiment[]);
      if (!salleRes.error && salleRes.data) setSalles(salleRes.data as Salle[]);

      setLoading(false);
    };
    load();
  }, []);

  // --- KPIs calculés ---
  const totalEtabs = etabs.length;
  const totalBatiments = bats.length;
  const totalSalles = salles.length;

  const totalSallesOp = useMemo(
    () => salles.filter((s) => s.estoperartionnel === true).length,
    [salles]
  );
  const totalSallesElec = useMemo(
    () => salles.filter((s) => s.estelectrifier === true).length,
    [salles]
  );

  const totalEleves = useMemo(
    () =>
      salles.reduce((acc, s) => acc + (s.nbelevef ?? 0) + (s.nbeleveg ?? 0), 0),
    [salles]
  );
  const avgElevesParSalle =
    totalSalles > 0 ? Math.round(totalEleves / totalSalles) : 0;

  const batAvecAC = useMemo(
    () => bats.filter((b) => b.dispositiveac === true).length,
    [bats]
  );

  // --- Totaux élèves par établissement ---
  const elevesParEtab = useMemo(() => {
    const totals: Record<number, number> = {};
    const batToEtab: Record<number, number> = {};

    bats.forEach((b) => {
      if (b.idbat && b.codeetab) {
        batToEtab[b.idbat] = b.codeetab;
      }
    });

    salles.forEach((s) => {
      const salleTotal = (s.nbelevef ?? 0) + (s.nbeleveg ?? 0);
      const codeetab = batToEtab[s.idbat];
      if (codeetab) {
        totals[codeetab] = (totals[codeetab] ?? 0) + salleTotal;
      }
    });

    return etabs
      .map((e) => ({
        etab: e.nometab ?? `Etab ${e.codeetab}`,
        totalEleves: totals[e.codeetab] ?? 0,
      }))
      .sort((a, b) => b.totalEleves - a.totalEleves)
      .slice(0, 10); // Top 10
  }, [salles, bats, etabs]);

  // --- UI ---
  return (
    <div>
      <AdminNav />
      <div className="p-4 md:p-8 mx-[4%] mt-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">Tableau de bord</h1>
          <div className="badge badge-primary badge-lg">Supabase Live</div>
        </div>

        {loading ? (
          <LoadingSkeleton />
        ) : (
          <>
            {/* KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-20 mb-10">
              <StatCard title="Établissements" value={totalEtabs} />
              <StatCard
                title="Bâtiments"
                value={totalBatiments}
                sub={`${batAvecAC} avec dispositif AC`}
              />
              <StatCard
                title="Salles"
                value={totalSalles}
                sub={`${totalSallesOp} opérationnelles`}
              />
              <StatCard
                title="Électrifiées"
                value={totalSallesElec}
                sub={`${Math.round(
                  (totalSallesElec / (totalSalles || 1)) * 100
                )}% des salles`}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-20 mb-10">
              <StatCard title="Total élèves (F+G)" value={totalEleves} />
              <StatCard
                title="Élèves / salle (moy.)"
                value={avgElevesParSalle}
              />
              <StatCard title="Bât. avec AC" value={batAvecAC} />
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h2 className="card-title text-sm opacity-70">
                    Synchronisation
                  </h2>
                  <div className="flex items-center gap-2">
                    <span className="loading loading-ring loading-sm text-primary" />
                    <span className="text-sm opacity-70">Données à jour</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Graphique élèves par établissement */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
              <div className="card bg-primary text-primary-content shadow-xl lg:col-span-2">
                <div className="card-body">
                  <h2 className="card-title">
                    Top 10 établissements par nombre d’élèves
                  </h2>
                  <div className="h-64 w-full">
                    <ResponsiveContainer>
                      <BarChart data={elevesParEtab}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="etab" tick={{ fontSize: 12 }} />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Bar dataKey="totalEleves" fill="#82ca9d" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              <div className="card bg-secondary text-secondary-content shadow-xl">
                <div className="card-body">
                  <h2 className="card-title">Résumé rapide</h2>
                  <ul className="text-sm space-y-2">
                    <li>• {totalSallesOp} salles opérationnelles</li>
                    <li>• {totalSallesElec} salles électrifiées</li>
                    <li>
                      • {batAvecAC} bâtiments avec dispositif anti-cyclonique
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}
