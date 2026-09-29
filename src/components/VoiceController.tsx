import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Pause, Play, Square, Sparkles } from 'lucide-react';

interface VoiceControllerProps {
  onTranscript: (text: string) => void;
  speakingText?: string;
  isProcessing?: boolean;
}

export const VoiceController: React.FC<VoiceControllerProps> = ({
  onTranscript,
  speakingText = '',
  isProcessing = false,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(true);
  const [ttsSupported, setTtsSupported] = useState(true);
  const [audioLevel, setAudioLevel] = useState<number[]>([15, 30, 45, 20, 60, 35, 10]);

  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Initialize Speech Recognition & Synthesis
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        try {
          const recognition = new SpeechRecognition();
          recognition.continuous = false;
          recognition.interimResults = true;
          recognition.lang = 'en-US';

          recognition.onresult = (event: any) => {
            let currentTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; i++) {
              currentTranscript += event.results[i][0].transcript;
            }
            if (currentTranscript.trim()) {
              onTranscript(currentTranscript);
            }
          };

          recognition.onerror = (event: any) => {
            console.warn('[VoiceController] Speech recognition notice:', event.error);
            setIsListening(false);
          };

          recognition.onend = () => {
            setIsListening(false);
          };

          recognitionRef.current = recognition;
        } catch {
          setVoiceSupported(false);
        }
      } else {
        setVoiceSupported(false);
      }

      if ('speechSynthesis' in window) {
        synthRef.current = window.speechSynthesis;
      } else {
        setTtsSupported(false);
      }
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [onTranscript]);

  // Audio waveform animation when listening or speaking
  useEffect(() => {
    let active = isListening || isSpeaking;
    if (active) {
      const updateWaveform = () => {
        setAudioLevel([
          Math.floor(10 + Math.random() * 70),
          Math.floor(20 + Math.random() * 80),
          Math.floor(15 + Math.random() * 95),
          Math.floor(30 + Math.random() * 70),
          Math.floor(25 + Math.random() * 90),
          Math.floor(15 + Math.random() * 80),
          Math.floor(10 + Math.random() * 60),
        ]);
        animationFrameRef.current = requestAnimationFrame(updateWaveform);
      };
      animationFrameRef.current = requestAnimationFrame(updateWaveform);
    } else {
      setAudioLevel([15, 25, 35, 20, 45, 25, 10]);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isListening, isSpeaking]);

  const toggleListening = () => {
    if (!voiceSupported || !recognitionRef.current) {
      alert('Speech recognition is not supported in this browser. Please type your query.');
      return;
    }

    if (isListening) {
      try {
        recognitionRef.current.stop();
      } catch {}
      setIsListening(false);
    } else {
      try {
        // Stop speech output if speaking
        if (synthRef.current && isSpeaking) {
          synthRef.current.cancel();
          setIsSpeaking(false);
        }
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.warn('Could not start recognition:', err);
      }
    }
  };

  const handleSpeak = (textToSpeak: string) => {
    if (!ttsSupported || !synthRef.current) return;

    if (isSpeaking && !isPaused) {
      synthRef.current.pause();
      setIsPaused(true);
      return;
    }

    if (isSpeaking && isPaused) {
      synthRef.current.resume();
      setIsPaused(false);
      return;
    }

    synthRef.current.cancel();

    // Clean markdown formatting before speaking
    const cleanText = textToSpeak
      .replace(/[#*`_~[\]()]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.lang = 'en-US';

    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    utteranceRef.current = utterance;
    synthRef.current.speak(utterance);
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    setIsSpeaking(false);
    setIsPaused(false);
  };

  return (
    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
      {/* 3D Voice Input Button */}
      <button
        type="button"
        onClick={toggleListening}
        disabled={isProcessing}
        title={isListening ? 'Stop listening' : 'Speak to CoLead'}
        className={`relative inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-semibold transition-all duration-300 shadow-md cursor-pointer ${
          isListening
            ? 'bg-rose-600 text-white border-rose-500 shadow-rose-900/30 scale-105 animate-pulse'
            : 'bg-[#E8DED2] hover:bg-[#D4C3B3] text-[#342F2A] border-[#B8A48D]'
        }`}
      >
        {isListening ? (
          <>
            <Mic className="h-4 w-4 animate-bounce text-white" />
            <span className="font-mono tracking-wider uppercase text-[11px]">Listening...</span>
            <div className="flex items-center gap-0.5 h-3 ml-1">
              {audioLevel.map((lvl, idx) => (
                <span
                  key={idx}
                  className="w-1 bg-white rounded-full transition-all duration-75"
                  style={{ height: `${Math.max(4, lvl * 0.25)}px` }}
                />
              ))}
            </div>
          </>
        ) : (
          <>
            <Mic className="h-4 w-4 text-[#5B5045]" />
            <span>Speak</span>
          </>
        )}
      </button>

      {/* Voice Output Speaker for Responses */}
      {speakingText && ttsSupported && (
        <div className="inline-flex items-center gap-1.5 p-1 rounded-xl bg-[#E8DED2]/80 border border-[#B8A48D]/60 shadow-xs">
          <button
            type="button"
            onClick={() => handleSpeak(speakingText)}
            title={isSpeaking ? (isPaused ? 'Resume narration' : 'Pause narration') : 'Listen to CoLead narration'}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              isSpeaking
                ? 'bg-[#342F2A] text-[#F3F0E9] shadow-xs'
                : 'bg-[#FBF9F5] hover:bg-[#E8DED2] text-[#342F2A] border border-[#B8A48D]/40'
            }`}
          >
            {isSpeaking ? (
              isPaused ? (
                <>
                  <Play className="h-3.5 w-3.5" />
                  <span>Resume Voice</span>
                </>
              ) : (
                <>
                  <Pause className="h-3.5 w-3.5" />
                  <span>Pause Voice</span>
                </>
              )
            ) : (
              <>
                <Volume2 className="h-3.5 w-3.5 text-[#5B5045]" />
                <span>Play Voice</span>
              </>
            )}
          </button>

          {isSpeaking && (
            <button
              type="button"
              onClick={stopSpeaking}
              title="Stop voice"
              className="p-1.5 rounded-lg bg-[#FBF9F5] hover:bg-rose-100 text-rose-700 transition-all cursor-pointer border border-[#B8A48D]/40"
            >
              <Square className="h-3 w-3 fill-current" />
            </button>
          )}

          {isSpeaking && !isPaused && (
            <div className="flex items-center gap-0.5 px-2">
              {audioLevel.slice(0, 5).map((lvl, idx) => (
                <span
                  key={idx}
                  className="w-1 bg-[#342F2A] rounded-full transition-all duration-100"
                  style={{ height: `${Math.max(3, lvl * 0.2)}px` }}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
