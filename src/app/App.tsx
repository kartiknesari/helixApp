import { Link } from "react-router";

function App() {
    return (
        <div className="h-screen w-screen bg-white dark:bg-black text-black dark:text-white flex overflow-hidden">
            {/* <ThemeToggleButton /> */}
            {/* SECTION 1: Audio AI (Left 50%) */}
            <section className="w-1/2 h-full flex flex-col items-center justify-center border-r border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-white dark:from-black to-zinc-100 dark:to-zinc-900">
                <div className="w-32 h-32 rounded-full bg-blue-500 dark:bg-blue-600 animate-pulse flex items-center justify-center shadow-[0_0_50px_rgba(59,130,246,0.4)] dark:shadow-[0_0_50px_rgba(37,99,235,0.4)]">
                    {/* Icon Placeholder */}
                    <div className="w-12 h-12 border-4 border-white rounded-full"></div>
                </div>
                <h2 className="mt-8 text-3xl font-light tracking-tight">
                    How can I help you today?
                </h2>
                <p className="text-zinc-600 dark:text-zinc-500 mt-2">
                    Speak now or select a journey on the right.
                </p>
            </section>

            {/* RIGHT SIDE CONTAINER (Right 50%) */}
            <div className="w-1/2 h-full flex flex-col">
                {/* SECTION 2: AI-Lite Recommendation (Top Right 25%) */}
                {/* <Link to="/quiz" className="h-1/2"> */}
                <section className="h-full p-10 flex flex-col justify-center border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer group">
                    <span className="text-helix-student font-bold uppercase tracking-widest text-xs mb-2">
                        AI-Lite Match
                    </span>
                    <h3 className="text-4xl font-light leading-tight">
                        Find your <br /> perfect laptop.
                    </h3>
                    <p className="text-zinc-500 dark:text-zinc-400 mt-4 group-hover:text-black dark:group-hover:text-white transition-colors">
                        Start the 30-second quiz &rarr;
                    </p>
                </section>
                {/* </Link> */}

                {/* SECTION 3: Product Catalog (Bottom Right 25%) */}
                {/* <Link to="/" className="h-1/2"> */}
                <section className="h-full p-10 flex flex-col justify-center bg-white dark:bg-black hover:bg-zinc-50 dark:hover:bg-zinc-950 transition-colors cursor-pointer group">
                    <span className="text-helix-gaming font-bold uppercase tracking-widest text-xs mb-2">
                        Explore All
                    </span>
                    <h3 className="text-4xl font-light leading-tight">
                        Browse the <br /> full catalogue.
                    </h3>
                    <div className="mt-6 flex gap-2">
                        {["Gaming", "Creator", "Office", "Student"].map((p) => (
                            <span
                                key={p}
                                className="px-3 py-1 bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs rounded-full"
                            >
                                {p}
                            </span>
                        ))}
                    </div>
                </section>
                {/* </Link> */}
            </div>
        </div>
    );
}

export default App;
