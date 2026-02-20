// services/paymentTypeService.ts
import db from "./db";

export const paymentTypeService = {
  getAll: () => db.getAllSync("SELECT * FROM payment_types"),

  getById: (id: number) =>
    db.getFirstSync("SELECT * FROM payment_types WHERE id = ?", [id]),

  create: (payload: { name: string }) => {
    const result = db.runSync("INSERT INTO payment_types (name) VALUES (?)", [
      payload.name,
    ]);
    return result.lastInsertRowId;
  },

  update: (id: number, payload: { name: string }) => {
    db.runSync("UPDATE payment_types SET name = ? WHERE id = ?", [
      payload.name,
      id,
    ]);
  },

  delete: (id: number) => {
    db.runSync("DELETE FROM payment_types WHERE id = ?", [id]);
  },
};
