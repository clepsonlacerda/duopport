"use server"

import { db } from "@/app/_lib/prisma";

export const getFindAllSections = async () => {
  const sections = await db.section.findMany({});

  return sections;
}

export const getFindById = async (id: string) => {
  const section = await db.section.findUnique({
    where: {
      id,
    }
  });

  return section;
}