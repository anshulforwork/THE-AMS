import { LocalStorage } from "./local";
import { SupabaseStorage } from "./supabase";
import type { StorageAdapter } from "./types";

let instance: StorageAdapter | null = null;

function supabaseConfigured(): boolean {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY);
}

export function getStorage(): StorageAdapter {
  if (instance) return instance;
  instance = supabaseConfigured() ? new SupabaseStorage() : new LocalStorage();
  return instance;
}

export function getStorageMode(): "cloud" | "local" {
  return supabaseConfigured() ? "cloud" : "local";
}
