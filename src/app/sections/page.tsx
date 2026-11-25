'use client'

import { useEffect, useState } from "react";
import Header from "../_components/header";
import { Section } from "@prisma/client";
import { getFindAllSections } from "../section/_actions/fins-all-sections";
import { ListTodoIcon } from "lucide-react";
import Link from "next/link";
import { useSection } from "../context/section-context";

const Sections = () => {

  const [sections, setSections] = useState<Section[]>([]);

  const { sectionId, addSection } = useSection()

  useEffect(() => {
    const findAllSections = async () => {
      const listSections = await getFindAllSections();

      setSections(listSections);
    }

    findAllSections();
  }, []);

  const setSectionId = (id: string) => {
    addSection(id);
  }

  return (
    <section>
      <Header />

      <div className="container mt-8">
        {sectionId}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {sections.map((item) => (
            <Link
              key={item.id}
              href="/learn"
              className="border bg-white hover:bg-zinc-50 h-28 rounded-md flex items-center justify-center gap-4 drop-shadow-md"
              onClick={() => setSectionId(item.id)}
            >
              <ListTodoIcon size={32} className="text-zinc-900" />
              <span className="text-zinc-900 font-medium">
                {item.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Sections;