"use server"

import { db } from "@/app/_lib/prisma";

export const DeleteAnswer = async (id: string) => {
  if (id) {
    await db.answer.delete({
      where: {
        id
      }
    });
  }
}