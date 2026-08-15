import Link from "next/link";
import { Menu, Search, ShoppingBag } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/produits", label: "Produits" },
  { href: "/categories", label: "Catégories" },
  { href: "/suivi", label: "Suivi de commande" },
  { href: "/aide", label: "Aide" },
];

function SearchForm({
  id,
  className,
  inputClassName,
}: {
  id: string;
  className?: string;
  inputClassName?: string;
}) {
  return (
    <form role="search" action="/produits" className={className}>
      <Search
        aria-hidden="true"
        className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
      />
      <label htmlFor={id} className="sr-only">
        Rechercher un produit
      </label>
      <Input
        id={id}
        name="q"
        type="search"
        placeholder="Rechercher…"
        className={cn("ps-9", inputClassName)}
      />
    </form>
  );
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
        {/* Mobile navigation. Hidden on lg where the inline nav takes over. */}
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="cursor-pointer lg:hidden"
              aria-label="Ouvrir le menu"
            >
              <Menu aria-hidden="true" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72">
            <SheetHeader>
              <SheetTitle className="font-heading">Navigation</SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-1 px-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-md px-3 py-2.5 text-base font-medium hover:bg-accent hover:text-accent-foreground"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>

        <Link
          href="/"
          className="font-heading text-lg font-bold tracking-tight whitespace-nowrap"
        >
          Kay<span className="text-primary">Boutik</span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Principale">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="ms-auto flex items-center gap-2">
          {/* Search is a primary action in a store, so it stays on screen at
              every width — inline here, and on its own row below on mobile. */}
          <SearchForm
            id="site-search"
            className="relative hidden sm:block"
            inputClassName="w-44 md:w-64"
          />

          <Button
            variant="outline"
            size="icon"
            className="relative cursor-pointer"
            aria-label="Panier, 0 article"
          >
            <ShoppingBag aria-hidden="true" />
          </Button>
        </div>
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 pb-3 sm:hidden">
        {/* h-11 keeps the field above the 44px touch-target minimum. */}
        <SearchForm
          id="site-search-mobile"
          className="relative"
          inputClassName="h-11 w-full text-base"
        />
      </div>
    </header>
  );
}
