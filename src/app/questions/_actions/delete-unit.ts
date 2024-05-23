"use server"

import { db } from "@/app/_lib/prisma";

export const DeleteQuestion = async (id: string) => {
  if (id) {
    await db.question.delete({
      where: {
        id
      }
    });
  }
}