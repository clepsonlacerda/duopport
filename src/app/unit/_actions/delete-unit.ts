"use server"

import { db } from "@/app/_lib/prisma";

export const DeleteUnit = async (id: string) => {
  if (id) {
    await db.unit.delete({
      where: {
        id
      }
    });
  }
}