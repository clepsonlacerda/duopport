"use server"

import { db } from "@/app/_lib/prisma";

export const getFindAllSections = async () => {
  const sections = await db.section.findMany({});

  return sections;
}