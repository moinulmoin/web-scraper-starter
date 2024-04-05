import { JSONFilePreset } from "lowdb/node";

export const db = await JSONFilePreset<Data>("db.json", { categories: [], products: [] });