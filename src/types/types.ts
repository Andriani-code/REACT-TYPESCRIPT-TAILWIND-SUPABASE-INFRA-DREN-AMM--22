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
  surface?: number | null;
  idbat: number | null;
}
export interface Etablissement {
  codeetab: number | null;
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
  nbsection?: number | null;
  directeur?: Directeur;
  totalcompartimentWc?: number | null;
  pointdeau?: string | null;
  images?: EtablissementImage[];
}
export interface Directeur {
  iddirecteur?: number;
  nomdirecteur?: string | null;
  prendr?: string | null;
  emaildr?: string | null;
  teldr?: string | null;
}
export interface Batiment {
  idbat?: number | null;
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
export type NavbarProps = {
  isAdmin: boolean;
};

export interface Trajet {
  idtrajet: number;
  debuttrajet?: string | null;
  fintrajet?: string | null;
  distancetraj?: number | null;
  nomtrajet?: string | null;
}

export interface PeriodeDifficile {
  id_periode: number;
  debutperiode?: string | null;
  finperiode?: string | null;
}

export interface Alea {
  idalea: number;
  typealea?: string | null;
  nomalea?: string | null;
  datealea?: string | null;
  nbelevesg?: number | null;
  nbelevesf?: number | null;
  nbenseigng?: number | null;
  nbenseignf?: number | null;
  explication?: string | null;
}

export interface Moyens {
  idmoyen: number;
  typemoyen: string | null;
  dureeheure: number | null;
  dureemin: number | null;
  idtrajet: number;
}

export interface Designation {
  numdesign?: number;
  nomdesign: string | null;
  estenceinte_etab: boolean | null;
  esttitre: boolean | null;
  estmen: boolean | null;
  estprive: boolean | null;
  numcadastre: number | null;
  estdomanial: boolean | null;
  estcommunal: boolean | null;
  autres: boolean | null;
  superficiedesign: number | null;
  litigieux: string | null;
  codeetab: number | null;
}

export interface Ouverture {
  idouvert: number;
  typeouvert: string | null;
  nbouvert: number | null;
  largeurouvert: number | null;
  hauteurouvert: number | null;
  surfaceouvert: number | null;
  idsalle: number;
}

export interface Structure {
  idstruc: number;
  typestructure: string | null;
  existencestruc: boolean | null;
  materiauxstruc: string | null;
  etatstruc: string | null;
  idbat: number;
}

export interface EtablissementImage {
  id: string;
  image_url: string | null;
}

export interface Desservir {
  codeetab: number;
  idtrajet: number;
}

export interface Traverser {
  idtrajet: number;
  id_periode: number;
}

export interface Frapper {
  codeetab: number;
  idalea: number;
}

export interface Disposer {
  idbat: number;
  idtoilette: number;
}
