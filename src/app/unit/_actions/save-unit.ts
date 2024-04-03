"use server"

import { db } from "@/app/_lib/prisma";

interface SaveSectionProps {
  id: string;
  name: string;
  description: string;
  sectionId: string;
}

export const SaveUnit = async (params: SaveSectionProps) => {
  if (params.id) {
    await db.unit.update({
      where: {
        id: params.id,
      },
      data: {
        name: params.name,
        description: params.description,
        sectionId: params.sectionId,
      }
    });

    return
  }

  await db.unit.create({
    data: {
      name: params.name,
      description: params.description,
      sectionId: params.sectionId,
    }
  });
}