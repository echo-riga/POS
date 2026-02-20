// services/subcategoryService.ts
import db from "./db";
export const subcategoryService = {
  getAll: () => db.getAllSync("SELECT * FROM subcategories"),

  getByCategory: (category_id: number) => {
    return db.getAllSync("SELECT * FROM subcategories WHERE category_id = ?", [
      category_id,
    ]);
  },

  getById: (id: number) =>
    db.getFirstSync("SELECT * FROM subcategories WHERE id = ?", [id]),

  create: (payload: { name: string; category_id: number }) => {
    const result = db.runSync(
      "INSERT INTO subcategories (name, category_id) VALUES (?, ?)",
      [payload.name, payload.category_id],
    );
    return result.lastInsertRowId;
  },

  update: (id: number, payload: { name: string }) => {
    db.runSync("UPDATE subcategories SET name = ? WHERE id = ?", [
      payload.name,
      id,
    ]);
  },

  delete: (id: number) => {
    db.runSync("DELETE FROM subcategories WHERE id = ?", [id]);
  },
};
