import Link from "next/link";
import { Button } from "./ui/button";
import { SheetHeader, SheetTitle } from "./ui/sheet";
import { BoltIcon, BookTextIcon, GroupIcon, HomeIcon, ListPlusIcon, ShieldQuestionIcon } from "lucide-react";

const SideMenu = () => {
  return (
    <>
      <SheetHeader className="text-left border-b border-solid border-secondary p-5">
        <SheetTitle>Menu</SheetTitle>
      </SheetHeader>

      <div className="flex flex-col gap-3 px-5 pt-5">
        <Button variant="outline" className="justify-start" asChild>
          <Link href="/">
            <HomeIcon size={18} className="mr-2" />
            Início
          </Link>
        </Button>

        <Button variant="outline" className="justify-start" asChild>
          <Link href="/section">
            <ListPlusIcon size={18} className="mr-2" />
            Seção
          </Link>
        </Button>

        <Button variant="outline" className="justify-start" asChild>
          <Link href="/unit">
            <GroupIcon size={18} className="mr-2" />
            Unidade
          </Link>
        </Button>

        <Button variant="outline" className="justify-start" asChild>
          <Link href="/questions">
            <ShieldQuestionIcon size={18} className="mr-2" />
            Perguntas
          </Link>
        </Button>

        <Button variant="outline" className="justify-start" asChild>
          <Link href="/learn">
            <BookTextIcon size={18} className="mr-2" />
            Aprender
          </Link>
        </Button>

        <Button variant="outline" className="justify-start" asChild>
          <Link href="/barbershops/register">
            <BoltIcon size={18} className="mr-2" />
            Configuração
          </Link>
        </Button>
      </div>
    </>
  );
}

export default SideMenu;