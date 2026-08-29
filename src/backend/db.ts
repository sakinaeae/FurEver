import fs from "fs";
import path from "path";
import { User, Pet, AdoptionApplication, Like } from "./types";

const DATABASE_DIR = path.join(process.cwd(), "database");

function getFilePath(filename: string) {
  return path.join(DATABASE_DIR, filename);
}

export function loadData<T>(filename: string): T[] {
  const filePath = getFilePath(filename);
  if (!fs.existsSync(filePath)) return [];
  const content = fs.readFileSync(filePath, "utf-8");
  try {
    return JSON.parse(content || "[]");
  } catch (e) {
    return [];
  }
}

export function saveData<T>(filename: string, data: T[]): void {
  const filePath = getFilePath(filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
}

export const loadUsers = () => loadData<User>("users.json");
export const saveUsers = (data: User[]) => saveData("users.json", data);

export const loadPets = () => loadData<Pet>("pets.json");
export const savePets = (data: Pet[]) => saveData("pets.json", data);

export const loadApplications = () => loadData<AdoptionApplication>("applications.json");
export const saveApplications = (data: AdoptionApplication[]) => saveData("applications.json", data);

export const loadLikes = () => loadData<Like>("likes.json");
export const saveLikes = (data: Like[]) => saveData("likes.json", data);
