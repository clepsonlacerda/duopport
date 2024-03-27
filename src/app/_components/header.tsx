import { Link, MenuIcon } from "lucide-react";
import { Card, CardContent } from "./ui/card";

import Image from "next/image";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Button } from "./ui/button";
import SideMenu from "./side-menu";

const Header = () => {
  return (
    <Card className="rounded-none" >
      <CardContent className="p-5 justify-between items-center flex flex-row" >
        {/* <Link href="/">
          <Image src="/logo.png" alt="FSW Barber" height={18} width={120} />
        </Link> */}
        <h5 className="text-slate-900 font-semibold">Duopport</h5>

        <Sheet>
          <SheetTrigger asChild >
            <Button variant="outline" size="icon" className="h-8 w-8">
              <MenuIcon size={16} />
            </Button>
          </SheetTrigger>

          <SheetContent className="p-0">
            <SideMenu />
          </SheetContent>
        </Sheet>
      </CardContent>
    </Card>
  );
}

export default Header;