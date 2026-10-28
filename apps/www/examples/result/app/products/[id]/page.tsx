import { notFound } from "next/navigation";
import { getProduct } from "@/lib/services/products";

// Next.js 15+ : params est une Promise.
export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await getProduct(id);

  if (!result.success) {
    if (result.error.code === "NOT_FOUND") notFound();
    throw result.error; // affiché par error.tsx
  }

  return (
    <h1>
      {result.data.name} : {result.data.price} FCFA
    </h1>
  );
}
