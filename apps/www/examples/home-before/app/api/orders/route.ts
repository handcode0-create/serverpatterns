import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON invalide" }, { status: 400 });
  }

  if (typeof body.productId !== "string" || typeof body.quantity !== "number") {
    return NextResponse.json({ message: "Données invalides" }, { status: 422 });
  }

  try {
    const res = await fetch(`${process.env.SHOP_API_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.SHOP_API_TOKEN}`,
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      return NextResponse.json({ err: `Erreur ${res.status}` }, { status: res.status });
    }
    return NextResponse.json(await res.json());
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
