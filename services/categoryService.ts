// services/categoryService.ts
import db from "./db";

export const categoryService = {
  getAll: () => db.getAllSync("SELECT * FROM categories"),

  getById: (id: number) =>
    db.getFirstSync("SELECT * FROM categories WHERE id = ?", [id]),

  create: (payload: { name: string }) => {
    const result = db.runSync("INSERT INTO categories (name) VALUES (?)", [
      payload.name,
    ]);
    return result.lastInsertRowId;
  },

  update: (id: number, payload: { name: string }) => {
    db.runSync("UPDATE categories SET name = ? WHERE id = ?", [
      payload.name,
      id,
    ]);
  },

  delete: (id: number) => {
    db.runSync("DELETE FROM categories WHERE id = ?", [id]);
  },
};
