import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Product } from "../interfaces/products";

const questions = [
    {
        id: "persona",
        question: "What will you be doing most on your new laptop?",
        options: [
            { text: "Crushing the latest games", value: "gaming" },
            {
                text: "Editing 4K video or designing graphics",
                value: "creator",
            },
            {
                text: "Managing business tasks and video calls",
                value: "office",
            },
            { text: "Attending lectures and writing papers", value: "student" },
        ],
    },
    {
        id: "mobility",
        question: "Where does your work happen?",
        options: [
            {
                text: "Mostly at a desk (I need maximum screen size and power)",
                value: "desktop",
            },
            {
                text: "On the go (I need something thin, light, and portable)",
                value: "portable",
            },
        ],
    },
    {
        id: "workload",
        question: "How many things are you usually doing at once?",
        options: [
            {
                text: "Just the essentials (Web browsing, emails, streaming)",
                value: "essentials",
            },
            {
                text: "Heavy multitasking (Multiple apps, dozens of tabs, large files)",
                value: "multitasking",
            },
        ],
    },
    {
        id: "feature",
        question: "Is there a specific feature you can't live without?",
        options: [
            {
                text: "A screen that looks incredible (OLED/Touch)",
                value: "display",
            },
            { text: "Battery that lasts all day and night", value: "battery" },
            {
                text: "Advanced security and privacy features",
                value: "security",
            },
        ],
    },
];

export default function Questionnaire() {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [recommendations, setRecommendations] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleAnswerSelect = (questionId: string, answerValue: string) => {
        setAnswers((prev) => ({ ...prev, [questionId]: answerValue }));
        setCurrentQuestionIndex((prev) => prev + 1);
    };

    const isQuizFinished = currentQuestionIndex >= questions.length;

    useEffect(() => {
        if (isQuizFinished && Object.keys(answers).length > 0) {
            const fetchRecommendations = async () => {
                setIsLoading(true);
                try {
                    const recommendedProducts =
                        await window.database.getRecommendations(answers);
                    setRecommendations(recommendedProducts);
                } catch (error) {
                    console.error("Failed to fetch recommendations:", error);
                }
                setIsLoading(false);
            };
            fetchRecommendations();
        }
    }, [isQuizFinished, answers]);

    const currentQuestion = questions[currentQuestionIndex];

    return (
        <div
            className={`h-screen w-screen bg-black text-white flex flex-col items-center p-10 overflow-y-auto font-sans justify-start`}
        >
            <header className="absolute top-10 left-10">
                <Link
                    to="/"
                    className="text-zinc-400 hover:text-white transition-colors flex items-center gap-2"
                >
                    &larr; Back to Home
                </Link>
            </header>

            {isQuizFinished ? (
                <div className="text-center w-full max-w-5xl animate-in fade-in zoom-in duration-500">
                    {isLoading ? (
                        <>
                            <h1 className="text-5xl font-light mb-4 animate-pulse">
                                Finding your match...
                            </h1>
                            <p className="text-zinc-400 dark:text-zinc-400">
                                Analyzing your answers to find the best products
                                for you.
                            </p>
                        </>
                    ) : (
                        // Recommendations
                        <>
                            <h1 className="text-5xl font-light mb-4">
                                Here are your recommendations!
                            </h1>
                            <p className="text-zinc-400 dark:text-zinc-400 mb-12">
                                Based on your answers, we think you'll love
                                these.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {recommendations.map((product) => (
                                    <div
                                        key={product.id}
                                        className="group border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 bg-zinc-50 dark:bg-zinc-950 text-left flex flex-col hover:border-zinc-300 dark:hover:border-zinc-700 transition-all hover:shadow-2xl hover:shadow-zinc-900"
                                    >
                                        <div className="aspect-video bg-zinc-100 dark:bg-zinc-900 rounded-2xl mb-6 overflow-hidden relative">
                                            {product.media &&
                                            product.media.length > 0 ? (
                                                <img
                                                    src={
                                                        product.media[0]
                                                            .file_path
                                                    }
                                                    alt={product.model_name}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-zinc-500 dark:text-zinc-600 font-medium">
                                                    {product.model_name} Visual
                                                </div>
                                            )}
                                        </div>
                                        <h3 className="text-xl font-bold text-white dark:text-white tracking-tight">
                                            {product.model_name}
                                        </h3>
                                        <p className="text-zinc-400 mt-3 leading-relaxed flex-grow text-sm">
                                            {product.hero_description}
                                        </p>

                                        <div className="mt-8">
                                            {/* --- UPDATED BUTTON WITH LINK --- */}
                                            <Link
                                                to={`/product/${product.id}`}
                                                className="block w-full"
                                            >
                                                <button className="w-full py-3 bg-zinc-800 text-white rounded-xl font-bold group-hover:bg-blue-600 transition-all hover:scale-[1.02]">
                                                    Explore
                                                </button>
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {!isLoading && (
                        // Answers
                        <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl text-left max-w-md mx-auto mt-16 backdrop-blur-sm">
                            <h2 className="text-sm font-bold mb-4 text-zinc-300 uppercase tracking-wider">
                                Your Selections
                            </h2>
                            <ul className="space-y-3">
                                {Object.entries(answers).map(([key, value]) => (
                                    <li
                                        key={key}
                                        className="flex justify-between items-center text-sm"
                                    >
                                        <span className="capitalize text-zinc-500">
                                            {key}
                                        </span>
                                        <span className="font-mono text-blue-400 bg-blue-900/20 px-2 py-1 rounded">
                                            {value}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-6 pt-6 border-t border-zinc-800 text-center">
                                <button
                                    onClick={() => window.location.reload()}
                                    className="text-zinc-500 hover:text-white text-sm transition-colors"
                                >
                                    Start Over
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                // Questionnaire
                <div className="w-full h-full max-w-3xl text-center flex flex-col items-center justify-center">
                    <p className="text-blue-500 font-bold uppercase tracking-widest text-xs mb-6">
                        Question {currentQuestionIndex + 1} / {questions.length}
                    </p>
                    <h1 className="text-4xl md:text-5xl font-light leading-tight mb-12 animate-in slide-in-from-bottom-4 duration-500">
                        {currentQuestion.question}
                    </h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {currentQuestion.options.map((option) => (
                            <button
                                key={option.value}
                                onClick={() =>
                                    handleAnswerSelect(
                                        currentQuestion.id,
                                        option.value
                                    )
                                }
                                className="p-8 border border-zinc-800 rounded-3xl text-left hover:bg-zinc-900 hover:border-zinc-600 transition-all hover:scale-[1.02] active:scale-95 duration-200"
                            >
                                <span className="text-lg font-light">
                                    {option.text}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
