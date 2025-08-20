// /services/etablissementService.ts

import supabase from "../helper/SupabaseClient";
import type { Etablissement } from "../types/types";


export const createEtablissement = async (data: Omit<Etablissement, 'images'>) => {
  const { data: newEtab, error } = await supabase
    .from('etablissement')
    .insert(data)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return newEtab;
};

export const getEtablissements = async () => {
  const { data, error } = await supabase
    .from('etablissement')
    .select('*');

  if (error) throw new Error(error.message);
  return data;
};

export const getEtablissementByCode = async (codeetab: number) => {
  const { data, error } = await supabase
    .from('etablissement')
    .select('*')
    .eq('codeetab', codeetab)
    .single();

  if (error) throw new Error(error.message);
  return data;
};

export const updateEtablissement = async (codeetab: number, data: Partial<Etablissement>) => {
  const { data: updatedEtab, error } = await supabase
    .from('etablissement')
    .update(data)
    .eq('codeetab', codeetab)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return updatedEtab;
};

export const deleteEtablissement = async (codeetab: number) => {
  const { error } = await supabase
    .from('etablissement')
    .delete()
    .eq('codeetab', codeetab);

  if (error) throw new Error(error.message);
};