"use server"

import { db } from "@/app/_lib/prisma";

interface AnswerProps {
  name: string;
  questionId: string;
}

export const useAnswerService = () => {

  const saveAnswer = async (params:  AnswerProps) => {
    const answerSaved = await db.answer.create({
      data: {
        name: params.name,
        questionId: params.questionId,
      }
    });

    return answerSaved;
  }

  const findAnswersByQuestionId = async (questionId: string) => {
    const listAnswers = await db.answer.findMany({
      where: {
        questionId,
      }
    });

    return listAnswers;
  }

  return {
    saveAnswer,
    findAnswersByQuestionId,
  }
  
}