import { Suspense } from "react";
import { BrandsPage } from "../components/pages/BrandsPage";
export default function BrandsRoute() { return <Suspense fallback={<main className="mx-auto min-h-[65vh] max-w-7xl px-4 py-8">Loading…</main>}><BrandsPage /></Suspense>; }
