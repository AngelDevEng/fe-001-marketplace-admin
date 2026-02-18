"use client";

import { useEffect, useState } from "react";
import { getProducts, getStores } from "@/lib/api";
import { Product } from "@/lib/types";
import ProductTable from "@/components/products/ProductTable";
import { Store } from "@/lib/types/stores/store";
import StoreTable from "@/components/stores/StoreTable";

export default function ProductsPage() {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const data = await getStores();
        setStores(data);
      } catch (err) {
        setError("Failed to fetch stores");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <h1 className="text-4xl font-bold text-center mb-8">vendedores</h1>
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && <StoreTable stores={stores} />}
      </div>
    </main>
  );
}
