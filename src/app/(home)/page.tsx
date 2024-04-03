import Link from "next/link";
import Header from "../_components/header";
import { BoltIcon, BookTextIcon, GroupIcon, ListPlusIcon, ShieldQuestionIcon } from "lucide-react";

export default function Home() {
  return (
    <div>
      <Header />

      <div className="container mt-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/section" className="border bg-white hover:bg-zinc-50 h-28 rounded-md flex items-center justify-center gap-4 drop-shadow-md">
            <ListPlusIcon size={32} className="text-zinc-900" />
            <span className="text-zinc-900 font-medium">
              Seção
            </span>
          </Link>

          <Link href="/unit" className="border bg-white hover:bg-zinc-50 h-28 rounded-md flex items-center justify-center gap-4 drop-shadow-md">
            <GroupIcon size={32} className="text-zinc-900" />
            <span className="text-zinc-900 font-medium">
              Unidade
            </span>
          </Link>

          <Link href="#" className="border bg-white hover:bg-zinc-50 h-28 rounded-md flex items-center justify-center gap-4 drop-shadow-md">
            <ShieldQuestionIcon size={32} className="text-zinc-900" />
            <span className="text-zinc-900 font-medium">
              Perguntas
            </span>
          </Link>

          <Link href="#" className="border bg-white hover:bg-zinc-50 h-28 rounded-md flex items-center justify-center gap-4 drop-shadow-md">
            <BookTextIcon size={32} className="text-zinc-900" />
            <span className="text-zinc-900 font-medium">
              Questões
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
