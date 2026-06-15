"use client";
import { useState, useEffect } from "react";

import { useAppSelector } from "@/lib/hooks";
import { useGetCartQuery } from "@/features/api/dummyJsonApi";
import { CartItemCard } from "@/components/cart/CartItemCard";
import { CartSummary } from "@/components/cart/CartSummary";
import { Skeleton } from "@/components/ui/Skeleton";
import { CartItem } from "@/types";
export default function CartPage() {
  const userId = useAppSelector((state) => state.auth.user?.id);

  const { data: cart, isLoading, isError } = useGetCartQuery(userId!);
  useEffect(() => {
    console.log("Fetched cart data:", cart?.carts?.[0]);
  }, [cart]);

  const activeCart = cart?.carts?.[0];
  if (!activeCart) {
    console.warn("No active cart found for user ID:", userId);
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-10 space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (isError || !cart) {
    return (
      <div className="container mx-auto py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-400">
          Your cart is empty!
        </h2>
        <p className="mt-2 text-slate-500">
          Find great products and add them to your cart.
        </p>
      </div>
    );
  }

  return (
    <main className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {activeCart?.products && activeCart.products.length > 0 ? (
          <div className="lg:col-span-2 space-y-4">
            {activeCart.products.map((item: CartItem) => (
              <CartItemCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="lg:col-span-2 text-center py-20">
            <h2 className="text-2xl font-bold text-slate-400">
              Your cart is empty!
            </h2>
            <p className="mt-2 text-slate-500">
              Find great products and add them to your cart.
            </p>
          </div>
        )}

        <div className="lg:col-span-1">
          {activeCart && (
            <CartSummary
              total={activeCart.total}
              discountedTotal={activeCart.discountedTotal}
              totalQuantity={activeCart.totalQuantity}
            />
          )}
        </div>
      </div>
    </main>
  );
}
