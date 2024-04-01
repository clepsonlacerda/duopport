"use server"

import { db } from "@/app/_lib/prisma";

interface SaveSectionProps {
  id: string;
  name: string;
}

export const SaveSection = async (params: SaveSectionProps) => {
  if (params.id) {
    await db.section.update({
      where: {
        id: params.id,
      },
      data: {
        name: params.name,
      }
    });

    return
  }

  await db.section.create({
    data: {
      name: params.name,
    }
  });
}