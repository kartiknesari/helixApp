import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router";
import * as LiveKitClient from "livekit-client";

// Backend Constants
const NOISE_WS_URL = "ws://localhost:8000/ws/audio";
const HELIX_BACKEND = "http://127.0.0.1:8001"; 
const SAMPLE_RATE = 16000;
const BUFFER_SIZE = 512;

export default function VoiceAgent() {
    const navigate = useNavigate();
    const [status, setStatus] = useState<"disconnected" | "connecting" | "listening" | "speaking" | "error">("disconnected");
    const [room, setRoom] = useState<LiveKitClient.Room | null>(null);
    const [isNoiseCancelled, setIsNoiseCancelled] = useState(false);

    // Visualizer State
    const [frequencies, setFrequencies] = useState<Uint8Array>(new Uint8Array(20).fill(0));
    const animationFrameRef = useRef<number>();
    
    // Audio Infrastructure Refs
    const audioCtxRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const wsRef = useRef<WebSocket | null>(null);
    const processorRef = useRef<ScriptProcessorNode | null>(null);
    const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);

    // --- 1. REAL-TIME ANIMATION ENGINE ---
    // This function connects an audio source (AI or User) to the visualizer
    const setupVisualizer = (audioNode: AudioNode) => {
        if (!audioCtxRef.current) return;
        
        const analyser = audioCtxRef.current.createAnalyser();
        analyser.fftSize = 64; // Low FFT size for fewer, wider frequency bins
        audioNode.connect(analyser);
        analyserRef.current = analyser;

        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        const update = () => {
            if (!analyserRef.current) return;
            // Get the current frequency data from the audio track
            analyserRef.current.getByteFrequencyData(dataArray);
            
            // Map the data to our 20 visualizer bars
            setFrequencies(new Uint8Array(dataArray.slice(0, 20)));
            
            // Loop the animation at 60fps
            animationFrameRef.current = requestAnimationFrame(update);
        };
        update();
    };

    // --- 2. NOISE CANCELLATION & MIC SETUP ---
    const startNoiseCancellation = async (audioCtx: AudioContext) => {
        const ws = new WebSocket(NOISE_WS_URL);
        ws.binaryType = "arraybuffer";
        wsRef.current = ws;

        const stream = await navigator.mediaDevices.getUserMedia({
            audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false }
        });

        const source = audioCtx.createMediaStreamSource(stream);
        sourceRef.current = source;

        const processor = audioCtx.createScriptProcessor(BUFFER_SIZE, 1, 1);
        processorRef.current = processor;

        source.connect(processor);
        processor.connect(audioCtx.destination); 

        processor.onaudioprocess = (e) => {
            if (ws.readyState !== WebSocket.OPEN) return;
            const input = e.inputBuffer.getChannelData(0);
            ws.send(input.buffer);
        };

        ws.onmessage = (e) => {
            const cleanData = new Float32Array(e.data);
            const buffer = audioCtx.createBuffer(1, cleanData.length, SAMPLE_RATE);
            buffer.copyToChannel(cleanData, 0);

            const playback = audioCtx.createBufferSource();
            playback.buffer = buffer;
            playback.connect(audioCtx.destination);
            playback.start();
        };

        setIsNoiseCancelled(true);
        // Link the visualizer to your "Clean" processed audio track
        setupVisualizer(processor); 
    };

    // --- 3. LIVEKIT CONNECTION ---
    const joinVoiceRoom = async () => {
        setStatus("connecting");
        try {
            const roomName = "voice-room";
            const identity = `user-${Math.random().toString(36).substring(7)}`;
            
            // Fetch token from helix_ai backend
            const res = await fetch(`${HELIX_BACKEND}/token/?room=${roomName}&identity=${identity}`);
            const data = await res.json();

            const newRoom = new LiveKitClient.Room({ adaptiveStream: true, dynacast: true });
            
            // Handle AI Voice (incoming track)
            newRoom.on(LiveKitClient.RoomEvent.TrackSubscribed, (track) => {
                if (track.kind === "audio") {
                    const el = track.attach();
                    document.body.appendChild(el);
                    
                    // Connect AI audio to visualizer so bars move when Helix speaks
                    if (audioCtxRef.current) {
                        const aiStream = new MediaStream([track.mediaStreamTrack]);
                        const aiSource = audioCtxRef.current.createMediaStreamSource(aiStream);
                        setupVisualizer(aiSource);
                    }
                    setStatus("speaking");
                }
            });

            await newRoom.connect(data.serverUrl, data.token);
            await newRoom.localParticipant.setMicrophoneEnabled(true);

            // Initialize AudioContext for local processing
            const audioCtx = new AudioContext({ sampleRate: SAMPLE_RATE });
            audioCtxRef.current = audioCtx;
            await startNoiseCancellation(audioCtx);

            setRoom(newRoom);
            setStatus("listening");
        } catch (err) {
            console.error("Connection Error:", err);
            setStatus("error");
        }
    };

    // --- 4. HARDWARE CLEANUP ---
    const handleDisconnect = async () => {
        // Stop UI animations
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);

        // Turn off Mic hardware
        if (sourceRef.current && sourceRef.current.mediaStream) {
            sourceRef.current.mediaStream.getTracks().forEach(track => track.stop());
        }

        // Close WebSocket and Audio Nodes
        processorRef.current?.disconnect();
        sourceRef.current?.disconnect();
        wsRef.current?.close();

        if (audioCtxRef.current) {
            await audioCtxRef.current.close();
            audioCtxRef.current = null;
        }

        if (room) {
            await room.localParticipant.setMicrophoneEnabled(false);
            await room.disconnect();
            setRoom(null);
        }

        setIsNoiseCancelled(false);
        setStatus("disconnected");
        navigate("/");
    };

    return (
        <div className="h-screen w-screen bg-black text-white flex flex-col items-center justify-center overflow-hidden relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(37,99,235,0.08)_0%,_transparent_80%)] pointer-events-none" />
            
            {/* MOVABLE VISUALIZER BARS */}
            <div className="flex items-end justify-center gap-1.5 h-48 mb-12">
                {Array.from(frequencies).map((val, i) => (
                    <div
                        key={i}
                        className="w-2 bg-blue-500 rounded-full transition-all duration-75 shadow-[0_0_20px_rgba(59,130,246,0.3)]"
                        style={{ 
                            // Height changes based on real-time audio frequency (0-160px)
                            height: `${Math.max(8, (val / 255) * 160)}px` 
                        }}
                    />
                ))}
            </div>

            <div className="text-center z-10 space-y-4">
                <h2 className="text-4xl font-light tracking-tight">
                    {status === "disconnected" && "Helix AI Voice Assistant"}
                    {status === "listening" && "Listening..."}
                    {status === "speaking" && "Helix is responding..."}
                </h2>
                <div className="flex items-center justify-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${isNoiseCancelled ? 'bg-green-500' : 'bg-zinc-600'}`} />
                    <p className="text-zinc-500 text-[10px] uppercase tracking-[0.2em] font-medium">
                        {isNoiseCancelled ? "AI Noise Cancellation Active" : "Microphone Off"}
                    </p>
                </div>
            </div>

            <div className="mt-16 flex gap-4">
                <button onClick={handleDisconnect} className="px-8 py-3 bg-zinc-900 border border-zinc-800 rounded-full hover:bg-zinc-800 transition-all text-xs font-semibold">
                    {status === "disconnected" ? "Back" : "End Session"}
                </button>
                {status === "disconnected" && (
                    <button onClick={joinVoiceRoom} className="px-10 py-3 bg-blue-600 rounded-full hover:bg-blue-500 shadow-lg transition-all text-xs font-bold uppercase tracking-widest">
                        Start Voice Journey
                    </button>
                )}
            </div>
        </div>
    );
}