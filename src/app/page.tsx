import Link from "next/link";
import { ArrowRight, BadgeCheck, Headphones, Truck } from "lucide-react";

import { ProductCard } from "@/components/product-card";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { products } from "@/lib/products";

const guarantees = [
  {
    icon: Truck,
    title: "Livraison partout en Haïti",
    body: "Port-au-Prince, Cap-Haïtien, Les Cayes et toutes les grandes villes sous 3 à 7 jours.",
  },
  {
    icon: BadgeCheck,
    title: "Paiement à la livraison",
    body: "Payez en gourdes une fois le colis entre vos mains, ou par MonCash avant expédition.",
  },
  {
    icon: Headphones,
    title: "Support en créole",
    body: "Une équipe qui vous répond en créole et en français, du lundi au samedi.",
  },
];

export default function Home() {
  return (
    <>
      <SiteHeader />

      <main className="flex-1">
        {/* Hero — one value proposition, one primary CTA. */}
        <section className="border-b bg-gradient-to-b from-secondary to-background">
          <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-8 lg:py-24">
            <div className="flex flex-col items-start gap-6">
              <Badge className="bg-cta text-cta-foreground hover:bg-cta">
                Livraison gratuite dès 5 000 HTG
              </Badge>

              <h1 className="font-heading text-4xl leading-[1.1] font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">
                Tout ce qu&apos;il vous faut,
                <span className="text-primary"> livré chez vous</span>
              </h1>

              <p className="max-w-prose text-lg text-muted-foreground">
                Électronique, maison, beauté : commandez en ligne et payez en
                gourdes. Nous nous occupons de l&apos;import et de la livraison
                jusqu&apos;à votre porte.
              </p>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button size="lg" className="cursor-pointer" asChild>
                  <Link href="/produits">
                    Découvrir la boutique
                    <ArrowRight aria-hidden="true" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="cursor-pointer"
                  asChild
                >
                  <Link href="/suivi">Suivre ma commande</Link>
                </Button>
              </div>

              <dl className="flex flex-wrap items-center gap-x-8 gap-y-3 pt-2">
                <div>
                  <dt className="text-sm text-muted-foreground">Clients servis</dt>
                  <dd className="tabular font-heading text-2xl font-bold">
                    12 400+
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">Note moyenne</dt>
                  <dd className="tabular font-heading text-2xl font-bold">
                    4,7 / 5
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">Délai moyen</dt>
                  <dd className="tabular font-heading text-2xl font-bold">
                    5 jours
                  </dd>
                </div>
              </dl>
            </div>

            <div
              aria-hidden="true"
              className="hidden aspect-[4/3] rounded-xl border bg-gradient-to-br from-primary/15 via-background to-cta/20 lg:block"
            />
          </div>
        </section>

        {/* Product grid */}
        <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-heading text-3xl font-bold tracking-tight">
                Les plus commandés
              </h2>
              <p className="mt-2 text-muted-foreground">
                Sélection mise à jour chaque semaine selon les commandes réelles.
              </p>
            </div>
            <Button variant="ghost" className="cursor-pointer" asChild>
              <Link href="/produits">
                Voir tout
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        <Separator />

        {/* Reassurance — the objections that block a first online order in Haiti. */}
        <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="font-heading text-3xl font-bold tracking-tight">
            Commander en confiance
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {guarantees.map(({ icon: Icon, title, body }) => (
              <div key={title} className="flex flex-col gap-3">
                <span className="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon aria-hidden="true" className="size-5" />
                </span>
                <h3 className="font-heading text-lg font-semibold">{title}</h3>
                <p className="text-muted-foreground">{body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Closing CTA */}
        <section className="border-t bg-secondary">
          <div className="mx-auto flex w-full max-w-7xl flex-col items-start gap-6 px-4 py-16 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
            <div>
              <h2 className="font-heading text-3xl font-bold tracking-tight text-balance">
                Prêt à passer votre première commande ?
              </h2>
              <p className="mt-2 max-w-prose text-muted-foreground">
                Créez un compte en une minute et suivez vos colis en temps réel.
              </p>
            </div>
            <Button size="lg" className="cursor-pointer" asChild>
              <Link href="/inscription">
                Créer mon compte
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t">
        <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Kay Boutik — Dropshipping haïtien.
          </p>
        </div>
      </footer>
    </>
  );
}
