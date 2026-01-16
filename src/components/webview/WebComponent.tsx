// import React, { useEffect, useRef } from "react";

type webcomponent = {
    url: string;
};

export default function WebViewPage({ url }: webcomponent) {
    return (
        // <iframe style={{ width: "100vw", height: "100vh" }} src={url} />
        <div className="w-full h-screen bg-white">
            <webview
                key={url}
                src={url}
                style={{ width: "100%", height: "100%" }}
            />
        </div>
    );
}

// export default function WebViewPage({ url }: webcomponent) {
//     const placeholderRef = useRef<HTMLDivElement>(null);
//     const requestRef = useRef<number>();

//     const syncBounds = () => {
//         if (placeholderRef.current) {
//             const rect = placeholderRef.current.getBoundingClientRect();

//             // Sending bounds to Main process via IPC
//             window.electronAPI.updateWebViewBounds({
//                 x: Math.round(rect.x),
//                 y: Math.round(rect.y),
//                 width: Math.round(rect.width),
//                 height: Math.round(rect.height),
//             });
//         }
//         // Continue the sync loop for smooth animations
//         requestRef.current = requestAnimationFrame(syncBounds);
//     };

//     useEffect(() => {
//         const initWebView = async () => {
//             if (placeholderRef.current) {
//                 const rect = placeholderRef.current.getBoundingClientRect();
//                 // Tell Main to create and attach the view at this specific rect
//                 await window.electronAPI.attachWebView({
//                     bounds: {
//                         x: Math.round(rect.x),
//                         y: Math.round(rect.y),
//                         width: Math.round(rect.width),
//                         height: Math.round(rect.height),
//                     },
//                     url: url, // Use the URL from product props
//                 });
//             }
//         };

//         initWebView();
//         // Start the sync loop
//         requestRef.current = requestAnimationFrame(syncBounds);

//         // Also sync on scroll and resize events
//         window.addEventListener("scroll", syncBounds, true);
//         window.addEventListener("resize", syncBounds);

//         return () => {
//             if (requestRef.current) cancelAnimationFrame(requestRef.current);
//             window.removeEventListener("scroll", syncBounds, true);
//             window.removeEventListener("resize", syncBounds);
//             window.electronAPI.detachWebView(); // Clean up on unmount
//         };
//     }, [url]);

//     return (
//         <div className="pdp-container overflow-y-auto h-screen bg-black">
//             <div className="h-[500px] flex items-center justify-center">
//                 <h1 className="text-white text-4xl"></h1>
//             </div>
//             {/* The moving target for the WebContentsView */}
//             <div
//                 ref={placeholderRef}
//                 className="w-full h-[600px] bg-white rounded-2xl mx-auto max-w-5xl"
//             />
//             <div className="h-[1000px]" /> {/* Extra space for scrolling */}
//         </div>
//     );
// }
