"use server"

import { db } from "@/app/_lib/prisma";

export const getFindAllUnits = async () => {
  const units = await db.unit.findMany({
    include: {
      barbershop: true
    }
  });

  return units;
}