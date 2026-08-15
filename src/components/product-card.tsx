import { ShoppingCart, Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { formatPrice, type Product } from "@/lib/products";
import { cn } from "@/lib/utils";

const badgeLabels: Record<NonNullable<Product["badge"]>, string> = {
  nouveau: "Nouveau",
  promo: "Promo",
  rupture: "Rupture de stock",
};

function discountPercent(price: number, compareAt: number) {
  return Math.round((1 - price / compareAt) * 100);
}

export function ProductCard({ product }: { product: Product }) {
  const { name, category, price, compareAt, rating, reviews, badge, inStock } =
    product;

  return (
    <Card className="group gap-0 overflow-hidden py-0 transition-shadow duration-200 hover:shadow-lg">
      {/*
        Placeholder media block. The aspect ratio is fixed so swapping in real
        supplier images doesn't shift the grid (CLS).
      */}
      <div className="relative aspect-square bg-muted">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-cta/15"
        />
        {badge ? (
          <Badge
            variant={badge === "rupture" ? "secondary" : "default"}
            className={cn(
              "absolute start-3 top-3",
              badge === "promo" && "bg-cta text-cta-foreground",
            )}
          >
            {badgeLabels[badge]}
          </Badge>
        ) : null}
      </div>

      <CardContent className="flex flex-col gap-2 p-4">
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          {category}
        </p>
        <h3 className="font-heading text-base leading-snug font-semibold">
          {name}
        </h3>

        <div className="flex items-center gap-1.5">
          <Star
            aria-hidden="true"
            className="size-4 fill-cta text-cta"
          />
          <span className="tabular text-sm font-medium">
            {rating.toFixed(1)}
          </span>
          <span className="text-sm text-muted-foreground">
            ({reviews} avis)
          </span>
        </div>

        <div className="mt-1 flex items-baseline gap-2">
          <span className="tabular font-heading text-lg font-bold">
            {formatPrice(price)}
          </span>
          {compareAt ? (
            <>
              <span className="tabular text-sm text-muted-foreground line-through">
                {formatPrice(compareAt)}
              </span>
              <span className="sr-only">
                Soit {discountPercent(price, compareAt)} pour cent de réduction
              </span>
              <span
                aria-hidden="true"
                className="tabular text-sm font-semibold text-destructive"
              >
                −{discountPercent(price, compareAt)}%
              </span>
            </>
          ) : null}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full cursor-pointer"
          disabled={!inStock}
          aria-label={
            inStock
              ? `Ajouter ${name} au panier`
              : `${name} est en rupture de stock`
          }
        >
          <ShoppingCart aria-hidden="true" />
          {inStock ? "Ajouter au panier" : "Indisponible"}
        </Button>
      </CardFooter>
    </Card>
  );
}
