"use client"

import { useEffect, useState } from "react";
import Header from "../_components/header";
import { useSection } from "../context/section-context";
import { getFindById } from "../section/_actions/fins-all-sections";
import { Section } from "@prisma/client";

const Learn = () => {

  const [section, setSection] = useState<Section>({ id: '', name: '' });

  const { sectionId } = useSection();

  useEffect(() => {
    const findAllSections = async () => {
      const sec = await getFindById(sectionId);

      // setSection(sec);
    }

    findAllSections();
  }, []);

  return (
    <section>
      <Header />

      <div className="container mt-8">
        <section>
          Seção 1
        </section>
        aprender
      </div>
    </section>
  );
}

export default Learn;