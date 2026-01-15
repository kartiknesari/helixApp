import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Product } from "../interfaces/products";

export default function ProductCatalog() {
    const [products, setProducts] = useState<Product[]>([]);
    const [activePersona, setActivePersona] = useState<string | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // The 'electronAPI' is exposed from the preload script
                const fetchedProducts = await window.database.getProducts(
                    activePersona
                );
                setProducts(fetchedProducts);
            } catch (error) {
                console.error("Failed to fetch products:", error);
            }
        };

        fetchProducts();
    }, [activePersona]); // Re-fetch when activePersona changes

    return (
        <div className="flex h-screen w-screen bg-white text-slate-900 font-sans">
            {/* Sidebar: Persona Filters */}
            <aside className="w-72 border-r border-slate-100 px-6 py-10 space-y-4 flex flex-col overflow-y-auto bg-slate-50/50">
                <Link
                    to="/"
                    className="text-sm text-slate-500 mb-8 hover:text-slate-900 flex items-center gap-2 font-medium"
                >
                    &larr; Back to Home
                </Link>
                <h2 className="text-2xl font-bold tracking-tight mb-2">
                    For Your Life
                </h2>
                <div className="flex flex-col gap-3">
                    {["gaming", "creator", "office", "student"].map((p) => (
                        <button
                            key={p}
                            onClick={() => setActivePersona(p)}
                            className={`p-4 text-left rounded-2xl transition-all border-2 group relative overflow-hidden ${
                                activePersona === p
                                    ? "border-blue-600 bg-blue-50 shadow-sm"
                                    : "border-transparent hover:bg-white hover:shadow-md"
                            }`}
                        >
                            <span
                                className={`capitalize font-bold relative z-10 ${
                                    activePersona === p
                                        ? "text-blue-700"
                                        : "text-slate-600 group-hover:text-slate-900"
                                }`}
                            >
                                {p}
                            </span>
                        </button>
                    ))}
                    <button
                        onClick={() => setActivePersona(null)}
                        className={`mt-4 text-sm font-medium transition-colors ${
                            activePersona === null
                                ? "text-slate-900 underline"
                                : "text-slate-400 hover:text-slate-600"
                        }`}
                    >
                        Show All Series
                    </button>
                </div>

                <div className="mt-auto pt-6 border-t border-slate-200">
                    <Link
                        to="/compare"
                        className="flex items-center justify-center w-full p-3 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 shadow-sm transition-colors"
                    >
                        <span className="font-semibold text-slate-700">
                            Compare Items
                        </span>
                    </Link>
                </div>
            </aside>

            {/* Product Grid: Human-Centric Cards */}
            <main className="flex-1 p-10 overflow-y-auto">
                <div className="max-w-7xl mx-auto">
                    <header className="mb-10">
                        <h1 className="text-4xl font-light text-slate-900">
                            {activePersona ? (
                                <span className="capitalize">
                                    {activePersona} Series
                                </span>
                            ) : (
                                "All Products"
                            )}
                        </h1>
                        <p className="text-slate-500 mt-2">
                            Select a device to explore its unique experience.
                        </p>
                    </header>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                        {products.map((product) => (
                            <div
                                key={product.id}
                                className="group border border-slate-100 rounded-3xl p-6 hover:shadow-xl hover:shadow-slate-200/50 hover:border-slate-200 transition-all bg-white flex flex-col"
                            >
                                {/* IMAGE SECTION */}
                                <div className="aspect-video bg-slate-50 rounded-2xl mb-6 overflow-hidden relative">
                                    {product.media &&
                                    product.media.length > 0 ? (
                                        <img
                                            src={product.media[0].file_path}
                                            alt={product.model_name}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-400 font-medium">
                                            {product.model_name} Visual
                                        </div>
                                    )}
                                </div>

                                <h3 className="text-xl font-bold tracking-tight">
                                    {product.model_name}
                                </h3>
                                {/* The "Human Term" pitch  */}
                                <p className="text-slate-500 mt-3 leading-relaxed min-h-[3.5rem] text-sm">
                                    {product.hero_description}
                                </p>

                                <div className="mt-auto pt-8">
                                    {/* --- UPDATED BUTTON WITH LINK --- */}
                                    <Link
                                        to={`/product/${product.id}`}
                                        className="block w-full"
                                    >
                                        <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold group-hover:bg-blue-600 transition-colors shadow-lg shadow-slate-200">
                                            Explore Experience
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
