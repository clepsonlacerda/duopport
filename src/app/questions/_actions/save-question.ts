"use server"

import { db } from "@/app/_lib/prisma";

interface SaveQuestionProps {
  id: string;
  question: string;
  unitId: string;
  correct: boolean;
  date: Date
}

export const SaveQuestion = async (params: SaveQuestionProps) => {
  if (params.id) {
    const questionSaved = await db.question.update({
      where: {
        id: params.id,
      },
      data: {
        question: params.question,
        unitId: params.unitId,
        correct: params.correct,
        date: params.date,
      }
    });

    return questionSaved;
  }

  const questionUpdated = await db.question.create({
    data: {
      question: params.question,
      unitId: params.unitId,
      correct: params.correct,
      date: params.date,
    }
  });

  return questionUpdated;
}