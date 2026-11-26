import { Suspense } from "react";
import { ShopPage } from "../components/pages/ShopPage";
export default function ShopRoute() { return <Suspense fallback={<main className="mx-auto min-h-[65vh] max-w-7xl px-4 py-8">Loading…</main>}><ShopPage /></Suspense>; }
