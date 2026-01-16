import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { Product } from "../interfaces/products";
import WebComponent from "@/components/webview/WebComponent";

export default function ExperienceLoader() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [loadError] = useState(false);

    const [product, setProduct] = useState<Product | null>(null);

    useEffect(() => {
        if (!id) {
            /*
            setError("No product ID provided");
            setIsLoading(false);
            */
            return;
        }

        const loadProductData = async () => {
            try {
                const current = await window.database.getProductById(id);
                // const all = await window.database.getProducts(null);
                setProduct(current);
            } catch (error) {
                console.error("Failed to load product data", error);
            }
        };
        loadProductData();

        /*
        const init = async () => {
            try {
                setIsLoading(true);
                setError(null);

                const current = await window.electronAPI.getProductById(id);

                if (!current) {
                    setError("Product not found");
                    setProduct(null);
                } else {
                    setProduct(current);
                    console.log(current);
                }
            } catch (error) {
                console.error("Failed to load product", error);
                setError("Failed to load product details");
            } finally {
                setIsLoading(false);
            }
        };

        init();
        */
    }, [id]);

    if (loadError) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-black text-white">
                <div className="text-2xl mb-4">Experience not available</div>
                <button
                    onClick={() => navigate("/catalog")}
                    className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
                >
                    Back to Catalog
                </button>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="h-screen flex items-center justify-center bg-black text-white">
                Loading Experience...
            </div>
        );
    }

    console.log(product);
    return (
        <div className="relative h-screen w-screen overflow-y-auto scrollbar-hide">
            <WebComponent url={product.url} />
            {/* <div className="py-2">
                <OffersSection />
            </div> */}
            {/* Render the new Comparison Component */}
            {/* {product && (
                <ComparisonTable
                    currentProduct={product}
                    allProducts={allProducts}
                />
            )} */}
            {/* Button will appear after all the static component content */}
            <div
                style={
                    {
                        // margin: "2px 0px 2px 0px",
                        // opacity: "95%",
                        // backgroundColor:
                        //     layout_config.theme === "dark" ? "black" : "white", // High contrast flip
                        // color: layout_config.theme === "dark" ? "white" : "black",
                    }
                }
                className="fixed flex w-full justify-center bottom-0 bg-transparent mb-8 scrollbar-hide"
            >
                <button
                    onClick={() => navigate("/catalog")}
                    className={`p-4 bg-zinc-800 text-white rounded-full border border-zinc-600 opacity-95`}
                >
                    Back to Catalog
                </button>
            </div>
        </div>
    );
}

// // --- HELPER COMPONENTS ---

// const StarRating = () => (
//     <div className="flex items-center gap-1 mb-4">
//         <div className="flex text-yellow-400 text-sm">
//             {[1, 2, 3, 4, 5].map((i) => (
//                 <span key={i}>★</span>
//             ))}
//         </div>
//         <span className="text-xs text-blue-600 hover:underline ml-1 cursor-pointer">
//             128 ratings
//         </span>
//     </div>
// );

// const SpecRow = ({
//     label,
//     value,
//     isEven,
// }: {
//     label: string;
//     value: string;
//     isEven: boolean;
// }) => (
//     <div
//         className={`flex border-b border-slate-200 ${isEven ? "bg-slate-50" : "bg-white"}`}
//     >
//         <div className="w-1/3 py-3 px-4 text-sm font-semibold text-slate-500 border-r border-slate-200">
//             {label}
//         </div>
//         <div className="w-2/3 py-3 px-4 text-sm font-medium text-slate-900">
//             {value}
//         </div>
//     </div>
// );

// // --- NEW: OFFERS COMPONENT ---
// const OffersSection = () => (
//     <div className="mb-6">
//         <h4 className="font-bold text-sm text-slate-900 mb-3 flex items-center gap-2">
//             <span className="text-lg">🏷️</span> Available Offers
//         </h4>
//         <div className="grid grid-cols-1 gap-3">
//             {/* Bank Offer */}
//             <div className="flex gap-3 items-start border border-slate-100 rounded-lg p-3 bg-white shadow-sm hover:shadow-md transition-shadow">
//                 <div className="text-xl">🏦</div>
//                 <div>
//                     <div className="font-bold text-xs text-slate-800">
//                         Bank Offer
//                     </div>
//                     <div className="text-xs text-slate-600 mt-1">
//                         5% Unlimited Cashback on Axis Bank Credit Card.
//                     </div>
//                 </div>
//             </div>

//             {/* Partner Offer */}
//             <div className="flex gap-3 items-start border border-slate-100 rounded-lg p-3 bg-white shadow-sm hover:shadow-md transition-shadow">
//                 <div className="text-xl">🤝</div>
//                 <div>
//                     <div className="font-bold text-xs text-slate-800">
//                         Partner Offer
//                     </div>
//                     <div className="text-xs text-slate-600 mt-1">
//                         Sign up for Helix Pay and get $500 Gift Card instantly.
//                     </div>
//                 </div>
//             </div>

//             {/* No Cost EMI */}
//             <div className="flex gap-3 items-start border border-slate-100 rounded-lg p-3 bg-white shadow-sm hover:shadow-md transition-shadow">
//                 <div className="text-xl">📅</div>
//                 <div>
//                     <div className="font-bold text-xs text-slate-800">
//                         No Cost EMI
//                     </div>
//                     <div className="text-xs text-slate-600 mt-1">
//                         Upto 6 months No Cost EMI on select credit cards.
//                     </div>
//                 </div>
//             </div>
//         </div>
//     </div>
// );
