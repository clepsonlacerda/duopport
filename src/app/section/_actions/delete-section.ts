"use server"

import { db } from "@/app/_lib/prisma";

export const DeleteSection = async (id: string) => {
  if (id) {
    await db.section.delete({
      where: {
        id
      }
    });
  }
}