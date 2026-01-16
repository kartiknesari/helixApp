import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Product } from "../interfaces/products";

interface ComparisonTableProps {
    currentProduct: Product | null;
}

export default function Comparison({ currentProduct }: ComparisonTableProps) {
    const [compareSlots, setCompareSlots] = useState<(Product | null)[]>([
        currentProduct || null,
        null,
        null,
    ]);
    const [activeSlotSelector, setActiveSlotSelector] = useState<number | null>(
        null
    );
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Sync the first slot if the main product page changes
    useEffect(() => {
        setCompareSlots((prev) => {
            const next = [...prev];
            next[0] = currentProduct || null;
            return next;
        });
    }, [currentProduct]);
    useEffect(() => {
        const loadProducts = async () => {
            try {
                const all = await window.database.getProducts(null);
                setAllProducts(all);
            } catch (error) {
                console.error("Failed to load product data", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadProducts();
    }, []);

    const handleAddProduct = (p: Product, idx: number) => {
        const newSlots = [...compareSlots];
        newSlots[idx] = p;
        setCompareSlots(newSlots);
        setActiveSlotSelector(null);
    };

    const handleRemoveProduct = (idx: number) => {
        if (idx === null) return;
        const newSlots = [...compareSlots];
        newSlots[idx] = null;
        setCompareSlots(newSlots);
    };

    const getSpecVal = (p: Product | null, label: string) => {
        if (!p) return "—";
        const s = p.specs.find((sp) =>
            sp.label.toLowerCase().includes(label.toLowerCase())
        );
        return s ? s.human_value : "—";
    };

    const specsToCompare = [
        "Processor",
        "Graphics",
        "Memory",
        "Storage",
        "Display",
        "Battery",
        "Weight",
    ];

    return (
        <>
            <header className="p-6">
                <Link
                    to="/catalog"
                    className="text-sm text-slate-500 hover:text-slate-900 flex items-center gap-2 font-medium"
                >
                    &larr; Back to Catalog
                </Link>
            </header>
            {isLoading ? (
                <div className="h-screen flex items-center justify-center bg-slate-50">
                    <div className="text-xl text-slate-600">
                        Loading Comparison...
                    </div>
                </div>
            ) : (
                <div className="flex-1 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-200 bg-slate-50">
                        <h2 className="text-2xl font-bold text-slate-900">
                            Compare with similar items
                        </h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm border-collapse">
                            <thead>
                                <tr>
                                    <th className="p-4 border-b border-r border-slate-200 w-1/4 bg-white sticky left-0 z-10">
                                        <span className="font-bold text-slate-400 uppercase text-xs">
                                            Features
                                        </span>
                                    </th>
                                    {compareSlots.map((slot, idx) => (
                                        <th
                                            key={idx}
                                            className={`p-4 border-b border-r border-slate-200 w-1/4 min-w-[200px] align-top ${
                                                idx === 0 ? "bg-blue-50/10" : ""
                                            }`}
                                        >
                                            {slot ? (
                                                <div className="relative">
                                                    {idx !== null && (
                                                        <button
                                                            onClick={() =>
                                                                handleRemoveProduct(
                                                                    idx
                                                                )
                                                            }
                                                            className="absolute -top-2 -right-2 text-black hover:text-red-500 font-bold p-1 z-20"
                                                        >
                                                            ✕
                                                        </button>
                                                    )}
                                                    <div className="h-24 mb-3 flex items-center justify-center">
                                                        {slot.media[0] ? (
                                                            <img
                                                                src={
                                                                    slot
                                                                        .media[0]
                                                                        .file_path
                                                                }
                                                                className="max-h-full max-w-full object-contain"
                                                                alt={
                                                                    slot.model_name
                                                                }
                                                            />
                                                        ) : (
                                                            <span className="text-slate-400">
                                                                No Image
                                                            </span>
                                                        )}
                                                    </div>
                                                    <Link
                                                        to={`/product/${slot.id}`}
                                                        className="font-bold text-blue-600 hover:underline block mb-1"
                                                    >
                                                        {slot.model_name}
                                                    </Link>
                                                    {idx === 0 &&
                                                        currentProduct && (
                                                            <span className="text-xs text-blue-600 font-semibold">
                                                                Current Product
                                                            </span>
                                                        )}
                                                </div>
                                            ) : (
                                                <div className="h-32 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-lg relative">
                                                    <button
                                                        onClick={() =>
                                                            setActiveSlotSelector(
                                                                idx
                                                            )
                                                        }
                                                        className="text-slate-400 hover:text-blue-600 font-bold text-sm flex flex-col items-center gap-1"
                                                    >
                                                        <span className="text-2xl">
                                                            +
                                                        </span>
                                                        <span>Add Product</span>
                                                    </button>

                                                    {activeSlotSelector ===
                                                        idx && (
                                                        <div className="absolute top-0 left-0 w-full max-h-96 bg-white z-30 overflow-y-auto border border-slate-300 rounded shadow-xl text-left">
                                                            <div className="p-3 border-b bg-slate-50 flex justify-between items-center sticky top-0 z-10">
                                                                <span className="text-sm font-bold text-slate-900">
                                                                    Select a
                                                                    product
                                                                </span>
                                                                <button
                                                                    onClick={(
                                                                        e
                                                                    ) => {
                                                                        e.stopPropagation();
                                                                        setActiveSlotSelector(
                                                                            null
                                                                        );
                                                                    }}
                                                                    className="text-slate-500 hover:text-red-500 text-lg font-bold"
                                                                >
                                                                    ✕
                                                                </button>
                                                            </div>
                                                            {allProducts
                                                                .filter(
                                                                    (p) =>
                                                                        !compareSlots.some(
                                                                            (
                                                                                slot
                                                                            ) =>
                                                                                slot?.id ===
                                                                                p.id
                                                                        )
                                                                )
                                                                .map((p) => (
                                                                    <div
                                                                        key={
                                                                            p.id
                                                                        }
                                                                        onClick={() =>
                                                                            handleAddProduct(
                                                                                p,
                                                                                idx
                                                                            )
                                                                        }
                                                                        className="p-3 hover:bg-blue-50 cursor-pointer border-b border-slate-100 flex items-center gap-3 transition-colors"
                                                                    >
                                                                        <div className="w-12 h-12 bg-slate-100 rounded flex-shrink-0">
                                                                            {p
                                                                                .media[0] && (
                                                                                <img
                                                                                    src={
                                                                                        p
                                                                                            .media[0]
                                                                                            .file_path
                                                                                    }
                                                                                    className="w-full h-full object-contain"
                                                                                    alt={
                                                                                        p.model_name
                                                                                    }
                                                                                />
                                                                            )}
                                                                        </div>
                                                                        <div className="flex-1 min-w-0">
                                                                            <div className="font-semibold text-slate-900 truncate">
                                                                                {
                                                                                    p.model_name
                                                                                }
                                                                            </div>
                                                                            <div className="text-xs text-slate-500 truncate">
                                                                                {
                                                                                    p
                                                                                        .persona
                                                                                        ?.name
                                                                                }{" "}
                                                                                Series
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {specsToCompare.map((spec, i) => (
                                    <tr
                                        key={spec}
                                        className={
                                            i % 2 === 0
                                                ? "bg-white"
                                                : "bg-slate-50"
                                        }
                                    >
                                        <td className="p-4 border-b border-r border-slate-200 font-semibold text-slate-700 sticky left-0 bg-inherit z-10">
                                            {spec}
                                        </td>
                                        {compareSlots.map((slot, idx) => (
                                            <td
                                                key={idx}
                                                className={`p-4 border-b border-r border-slate-200 text-slate-800 ${
                                                    idx === 0
                                                        ? "font-medium bg-blue-50/5"
                                                        : ""
                                                }`}
                                            >
                                                {getSpecVal(slot, spec)}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </>
    );
}
