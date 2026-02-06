import { Link } from "react-router";

/**
 * Main App Component
 * * Layout Structure:
 * - Left Side (50%): Interactive Voice AI entry point.
 * - Right Side (50%): Vertical stack containing the Recommender and Catalog links.
 */
function App() {
    return (
        <div className="h-screen w-screen bg-white dark:bg-black text-black dark:text-white flex overflow-hidden space-x-2 p-4 font-sans">
            
            {/* SECTION 1: Audio AI (Left 50%) */}
            {/* This section now links to the /voice route to activate your VoiceAgent backend interaction */}
            <Link to="/voice" className="w-1/2 h-full block">
                <div className="h-full flex flex-col items-center justify-center border border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-white dark:from-black to-zinc-100 dark:to-zinc-900 rounded-4xl transition-all duration-300 hover:border-blue-500/50 hover:shadow-[0_0_40px_rgba(59,130,246,0.1)] cursor-pointer group relative overflow-hidden">
                    
                    {/* Animated Pulse Circle */}
                    <div className="w-32 h-32 rounded-full bg-blue-500 dark:bg-blue-600 animate-pulse flex items-center justify-center shadow-[0_0_50px_rgba(59,130,246,0.4)] dark:shadow-[0_0_50px_rgba(37,99,235,0.4)] group-hover:scale-110 transition-transform duration-500">
                        {/* Icon/Logo Placeholder */}
                        <div className="w-12 h-12 border-4 border-white rounded-full opacity-80"></div>
                    </div>

                    <div className="text-center mt-8 z-10">
                        <h2 className="text-3xl font-light tracking-tight">
                            How can I help you today?
                        </h2>
                        <p className="text-zinc-600 dark:text-zinc-500 mt-2">
                            Speak with Helix AI to find your next device.
                        </p>
                    </div>

                    {/* Interactive Hint */}
                    <div className="absolute bottom-10 flex items-center gap-2 text-blue-500 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span>Start Voice Session</span>
                        <span className="text-lg">→</span>
                    </div>
                </div>
            </Link>

            {/* RIGHT SIDE CONTAINER (Right 50%) */}
            <div className="w-1/2 h-full flex flex-col space-y-2">
                
                {/* SECTION 2: AI-Lite Recommendation (Top Right 25%) */}
                <Link to="/recommender" className="h-1/2 block">
                    <div className="h-full p-10 flex flex-col justify-center border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all duration-300 group rounded-2xl">
                        <span className="font-bold uppercase tracking-widest text-[10px] text-blue-600 dark:text-blue-400 mb-2">
                            AI-Lite Match
                        </span>
                        <h3 className="text-4xl font-light leading-tight">
                            Find your <br /> perfect laptop.
                        </h3>
                        <p className="text-zinc-500 dark:text-zinc-400 mt-4 group-hover:text-black dark:group-hover:text-white transition-colors">
                            Start the 30-second quiz &rarr;
                        </p>
                    </div>
                </Link>

                {/* SECTION 3: Product Catalog (Bottom Right 25%) */}
                <Link to="/catalog" className="h-1/2 block">
                    <div className="h-full p-10 flex flex-col justify-center border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all duration-300 group rounded-2xl">
                        <span className="font-bold uppercase tracking-widest text-[10px] text-zinc-400 mb-2">
                            Explore All
                        </span>
                        <h3 className="text-4xl font-light leading-tight">
                            Browse the <br /> full catalogue.
                        </h3>
                        <div className="mt-6 flex flex-wrap gap-2">
                            {["Gaming", "Creator", "Office", "Student"].map((category) => (
                                <span
                                    key={category}
                                    className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 text-xs rounded-full group-hover:bg-white dark:group-hover:bg-zinc-700 transition-colors"
                                >
                                    {category}
                                </span>
                            ))}
                        </div>
                    </div>
                </Link>
            </div>
        </div>
    );
}

export default App;