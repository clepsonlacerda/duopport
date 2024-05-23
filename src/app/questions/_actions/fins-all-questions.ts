"use server"

import { db } from "@/app/_lib/prisma";

export const getFindAllQuestions = async () => {
  const questions = await db.question.findMany({
    include: {
      unit: true,
      answers: true,
    }
  });

  return questions;
}