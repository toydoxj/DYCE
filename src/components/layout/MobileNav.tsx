"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { navigation } from "@/data/navigation";
import { useState } from "react";

interface MobileNavProps {
  isTransparent?: boolean;
}

export function MobileNav({ isTransparent }: MobileNavProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className={`inline-flex items-center justify-center rounded-lg p-2 lg:hidden ${isTransparent ? "hover:bg-white/10" : "hover:bg-navy/5"}`}>
        <Menu className={`h-6 w-6 ${isTransparent ? "text-white" : "text-navy"}`} />
        <span className="sr-only">메뉴 열기</span>
      </SheetTrigger>
      <SheetContent side="right" className="w-72">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 text-left text-navy">
            <Image src="/dongyang_logo.svg" alt="로고" width={28} height={28} className="h-7 w-7" />
            (주)동양구조
          </SheetTitle>
        </SheetHeader>
        <nav className="mt-8 flex flex-col gap-1">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`rounded-md px-4 py-3 text-sm font-medium transition-colors ${
                pathname === item.href
                  ? "bg-navy/5 text-brand"
                  : "text-navy/80 hover:bg-navy/5 hover:text-navy"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
