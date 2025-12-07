"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Trash2, ChevronDown, ChevronUp } from "lucide-react";
import questionsData from "@/data/questions.json";

const HACK_MESSAGES = [
  "[*] Scanning network...",
  "[*] Exploiting vulnerabilities...",
  "[*] Bypassing firewall...",
  "[*] Accessing system files...",
  "[!] WARNING: SECURITY BREACH DETECTED",
  "[!] Unauthorized access detected",
  "[*] Injecting payload...",
  "[*] Gaining root access...",
  "[+] ACCESS GRANTED",
  "[+] Welcome to CyberSafe Quiz"
];

function HackedScreen({ onComplete }) {
  const [lines, setLines] = useState([]);
  const [showWarning, setShowWarning] = useState(false);
  const [showAccess, setShowAccess] = useState(false);

  useEffect(() => {
    let lineIndex = 0;
    let isMounted = true;

    // Start immediately
    const addLine = () => {
      if (!isMounted || lineIndex >= HACK_MESSAGES.length) return;
      
      const newLine = HACK_MESSAGES[lineIndex];
      setLines((current) => [...current, newLine]);
      
      if (newLine.includes("WARNING")) {
        setShowWarning(true);
      }
      if (newLine.includes("ACCESS GRANTED")) {
        setShowAccess(true);
      }
      
      lineIndex++;
      
      if (lineIndex < HACK_MESSAGES.length) {
        setTimeout(addLine, 400);
      }
    };

    // Start typing after 200ms
    const startTimer = setTimeout(() => {
      addLine();
    }, 200);

    // Show for exactly 4.5 seconds then transition
    const completeTimer = setTimeout(() => {
      if (isMounted) {
        onComplete();
      }
    }, 4500);

    return () => {
      isMounted = false;
      clearTimeout(startTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center font-mono" 
      style={{ 
        backgroundColor: '#000000',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999
      }}
    >
      {/* Matrix-style background effect */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,255,0,0.03)_50%)] bg-[length:100%_4px] animate-scan-line" />
      </div>

      <div className="relative z-10 w-full max-w-3xl px-8">
        {/* YOU ARE HACKED warning */}
        {showWarning && (
          <div className="mb-8 text-center">
            <h1 className="text-6xl font-bold text-red-500 animate-pulse mb-4" style={{ color: '#ef4444' }}>
              ⚠️ YOU ARE HACKED ⚠️
            </h1>
            <div className="text-2xl text-yellow-400 animate-blink" style={{ color: '#facc15' }}>
              SECURITY BREACH DETECTED
            </div>
          </div>
        )}

        {/* Terminal output */}
        <div className="rounded-lg border-2 border-green-500/50 bg-black/90 p-6 shadow-[0_0_40px_rgba(0,255,0,0.5)]" style={{ borderColor: 'rgba(34, 197, 94, 0.5)', backgroundColor: 'rgba(0, 0, 0, 0.9)' }}>
          <div className="mb-4 flex items-center gap-2 border-b border-green-500/30 pb-2">
            <span className="h-3 w-3 rounded-full bg-red-500" style={{ backgroundColor: '#ef4444' }} />
            <span className="h-3 w-3 rounded-full bg-yellow-500" style={{ backgroundColor: '#eab308' }} />
            <span className="h-3 w-3 rounded-full bg-green-500" style={{ backgroundColor: '#22c55e' }} />
            <span className="ml-auto text-sm text-green-400/70" style={{ color: 'rgba(74, 222, 128, 0.7)' }}>
              root@cybersafe:~$
            </span>
          </div>
          <div className="space-y-1 text-sm min-h-[100px]">
            {lines.length === 0 && (
              <div className="text-green-400" style={{ color: '#4ade80' }}>
                root@cybersafe:~$<span className="ml-2 inline-block h-4 w-2 animate-blink bg-green-400" style={{ backgroundColor: '#4ade80' }} />
              </div>
            )}
            {lines.map((line, idx) => (
              <div
                key={idx}
                className="animate-fade-in"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <span className="text-green-400" style={{ color: '#4ade80' }}>{line}</span>
                {line.includes("WARNING") && (
                  <span className="ml-2 text-red-500 animate-blink" style={{ color: '#ef4444' }}>!</span>
                )}
                {line.includes("ACCESS") && (
                  <span className="ml-2 text-green-400 animate-blink" style={{ color: '#4ade80' }}>✓</span>
                )}
              </div>
            ))}
            {lines.length < HACK_MESSAGES.length && (
              <span className="inline-block h-4 w-2 animate-blink bg-green-400 ml-1" style={{ backgroundColor: '#4ade80' }} />
            )}
          </div>
        </div>

        {/* Access granted message */}
        {showAccess && (
          <div className="mt-6 text-center animate-fade-in">
            <p className="text-xl text-green-400 font-semibold">
              System secured. Proceeding to quiz...
            </p>
            <div className="mt-4 flex justify-center gap-2">
              <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
              <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" style={{ animationDelay: "0.2s" }} />
              <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" style={{ animationDelay: "0.4s" }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function HomePage() {
  const router = useRouter();
  const [count, setCount] = useState(10);
  const [hasSavedGame, setHasSavedGame] = useState(false);
  const [bestScore, setBestScore] = useState(null);
  const [difficulty, setDifficulty] = useState("all");
  const [createdQuizzes, setCreatedQuizzes] = useState([]);
  const [expandedQuiz, setExpandedQuiz] = useState(null);
  const [showHackedScreen, setShowHackedScreen] = useState(true);
  const [terminalLines, setTerminalLines] = useState([
    "> Initializing security protocols...",
    "> Loading question database...",
    "> Scanning for vulnerabilities...",
    "> System ready. Awaiting user input."
  ]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const rawCurrent = window.localStorage.getItem("cybersafe-quiz-current");
      if (rawCurrent) {
        const current = JSON.parse(rawCurrent);
        if (current && !current.completed) {
          setHasSavedGame(true);
        }
      }
      const rawBest = window.localStorage.getItem("cybersafe-quiz-best");
      if (rawBest) {
        const best = JSON.parse(rawBest);
        if (best && typeof best.score === "number") {
          setBestScore(best.score);
        }
      }
      const rawQuizzes = window.localStorage.getItem("cybersafe-quizzes");
      if (rawQuizzes) {
        const quizzes = JSON.parse(rawQuizzes);
        setCreatedQuizzes(Array.isArray(quizzes) ? quizzes : []);
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  // Animated terminal output
  useEffect(() => {
    const interval = setInterval(() => {
      setTerminalLines((prev) => {
        const newLines = [
          ...prev.slice(1),
          `> [${new Date().toLocaleTimeString()}] System status: ACTIVE`
        ];
        return newLines;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleDeleteQuiz = (quizId) => {
    if (typeof window === "undefined") return;
    try {
      const updated = createdQuizzes.filter((q) => q.id !== quizId);
      setCreatedQuizzes(updated);
      window.localStorage.setItem("cybersafe-quizzes", JSON.stringify(updated));
      // Also delete associated scores
      window.localStorage.removeItem(`cybersafe-quiz-scores-${quizId}`);
      if (expandedQuiz === quizId) {
        setExpandedQuiz(null);
      }
    } catch {
      // ignore errors
    }
  };

  const getQuizScores = (quizId) => {
    if (typeof window === "undefined") return [];
    try {
      const raw = window.localStorage.getItem(`cybersafe-quiz-scores-${quizId}`);
      if (raw) {
        const scores = JSON.parse(raw);
        return Array.isArray(scores) ? scores : [];
      }
    } catch {
      // ignore errors
    }
    return [];
  };

  const getQuizQuestions = (questionIds) => {
    return questionsData.filter((q) => questionIds.includes(q.id));
  };

  const handleStart = () => {
    const n = Math.min(Math.max(Number(count) || 10, 10), 100);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("cybersafe-quiz-current");
    }
    router.push(`/quiz?count=${n}&difficulty=${difficulty}`);
  };

  const handleHackedComplete = () => {
    setShowHackedScreen(false);
  };

  // Always show hacked screen first
  if (showHackedScreen) {
    return <HackedScreen onComplete={handleHackedComplete} />;
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-10 text-slate-50">
      {/* Grid / cyber background */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_#22d3ee33,_transparent_50%),radial-gradient(circle_at_bottom,_#4ade8033,_transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(148,163,184,0.15)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.12)_1px,transparent_1px)] bg-[size:80px_80px]" />
      
      {/* Scanning line effect */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="h-0.5 w-full animate-scan-line bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
      </div>

      {/* Animated status indicators */}
      <div className="pointer-events-none absolute right-4 top-4 z-0 hidden flex-col gap-2 md:flex">
        <div className="flex items-center gap-2 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 backdrop-blur">
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
          <span className="font-mono text-[10px] text-emerald-300">SECURE</span>
        </div>
        <div className="flex items-center gap-2 rounded-md border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 backdrop-blur">
          <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" />
          <span className="font-mono text-[10px] text-cyan-300">ONLINE</span>
        </div>
      </div>

      {/* Animated terminal window - bottom left */}
      <div className="pointer-events-none absolute bottom-4 left-4 z-0 hidden max-w-xs rounded-md border border-cyan-500/30 bg-slate-900/90 px-4 py-3 font-mono text-[10px] text-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.3)] backdrop-blur md:block">
        <div className="mb-2 flex items-center gap-2 border-b border-cyan-500/20 pb-1">
          <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
          <span className="h-2 w-2 rounded-full bg-yellow-500" />
          <span className="h-2 w-2 rounded-full bg-green-500" />
          <span className="ml-auto text-[9px] text-slate-400">root@cybersafe</span>
        </div>
        <div className="space-y-1">
          {terminalLines.map((line, idx) => (
            <p
              key={idx}
              className="animate-fade-in text-slate-300"
              style={{
                animationDelay: `${idx * 0.1}s`,
                animation: "fadeIn 0.5s ease-in"
              }}
            >
              {line}
            </p>
          ))}
          <span className="inline-block h-2.5 w-1.5 animate-blink bg-cyan-400 ml-1" />
        </div>
      </div>

      <div className="w-full max-w-5xl">
        <div className="mb-10 flex flex-col items-center gap-6 text-center md:flex-row md:items-start md:text-left">
          <div className="flex-1 space-y-4">
            <p className="inline-flex items-center rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-emerald-300">
              Cyber Security Awareness
            </p>
            <h1 className="text-balance text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              <span className="relative inline-block">
                CyberSafe
                <span className="absolute -right-2 top-0 h-full w-0.5 animate-blink bg-cyan-400" />
              </span>{" "}
              <span className="relative inline-block text-cyan-400">
                Quiz
                <span className="absolute -right-2 top-0 h-full w-0.5 animate-blink bg-cyan-400" />
              </span>
            </h1>
            <p className="max-w-xl text-sm text-slate-300 sm:text-base">
              An interactive cyber security awareness test for students and
              professionals. Practice topics like phishing, passwords, audits,
              compliance, and incident response — all scored out of{" "}
              <span className="font-semibold text-cyan-300">100</span>.
            </p>
            <div className="flex flex-wrap gap-3 text-xs text-slate-300">
              <span className="rounded-full border border-slate-700 bg-slate-900/60 px-3 py-1">
                ⚡ Real-world security scenarios
              </span>
              <span className="rounded-full border border-slate-700 bg-slate-900/60 px-3 py-1">
                🛡️ Learn with detailed explanations
              </span>
              <span className="rounded-full border border-slate-700 bg-slate-900/60 px-3 py-1">
                🔐 No data stored, for learning only
              </span>
            </div>
          </div>
          <div className="hidden flex-1 md:flex md:justify-end">
            <div className="relative rounded-2xl border border-cyan-500/40 bg-slate-900/70 px-6 py-5 shadow-[0_0_40px_rgba(34,211,238,0.25)] backdrop-blur animate-pulse-glow">
              <div className="mb-3 flex items-center justify-between text-xs text-cyan-200">
                <span className="font-mono uppercase tracking-[0.2em]">
                  Threat Monitor
                </span>
                <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] text-emerald-300">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                  Live
                </span>
              </div>
              <div className="space-y-2 text-xs font-mono text-slate-200">
                <p className="animate-fade-in">
                  &gt; Scanning phishing awareness...
                  <span className="inline-block animate-blink">█</span>
                </p>
                <p className="animate-fade-in" style={{ animationDelay: "0.5s" }}>
                  &gt; Checking password hygiene...
                  <span className="inline-block animate-blink">█</span>
                </p>
                <p className="animate-fade-in" style={{ animationDelay: "1s" }}>
                  &gt; Evaluating compliance posture...
                  <span className="inline-block animate-blink">█</span>
                </p>
                <p
                  className="animate-fade-in text-cyan-300"
                  style={{ animationDelay: "1.5s" }}
                >
                  &gt; Ready. Launch your quiz.
                  <span className="inline-block animate-blink">█</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <Card className="border border-cyan-500/40 bg-slate-900/80 shadow-2xl backdrop-blur">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold tracking-tight text-slate-50">
              Configure your security drill
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="question-count"
                className="block text-sm font-medium text-slate-100"
              >
                Number of questions
              </label>
              <input
                id="question-count"
                type="number"
                min={10}
                max={100}
                value={count}
                onChange={(e) => setCount(e.target.value)}
                className="flex h-11 w-full rounded-md border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-slate-50 shadow-sm outline-none ring-cyan-500/40 focus-visible:ring-2"
              />
              <p className="text-xs text-slate-300">
                Pick between{" "}
                <span className="font-semibold text-cyan-300">10</span> and{" "}
                <span className="font-semibold text-cyan-300">100</span>{" "}
                questions. Your final score is always scaled to{" "}
                <span className="font-semibold text-emerald-300">100</span>{" "}
                marks.
              </p>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="difficulty"
                className="block text-sm font-medium text-slate-100"
              >
                Difficulty
              </label>
              <select
                id="difficulty"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="flex h-11 w-full rounded-md border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-slate-50 shadow-sm outline-none ring-cyan-500/40 focus-visible:ring-2"
              >
                <option value="all">Mixed (all levels)</option>
                <option value="easy">Easy only</option>
                <option value="medium">Medium only</option>
                <option value="hard">Hard only</option>
              </select>
              <p className="text-xs text-slate-300">
                Questions are randomly selected from the chosen difficulty pool.
              </p>
            </div>

            {bestScore !== null && (
              <p className="text-xs text-slate-400">
                Best score so far:{" "}
                <span className="font-semibold text-emerald-300">
                  {bestScore} / 100
                </span>
              </p>
            )}

            <Button
              onClick={handleStart}
              className="w-full bg-cyan-500 text-slate-950 hover:bg-cyan-400"
              variant="default"
            >
              Start Secure Quiz
            </Button>

            {hasSavedGame && (
              <Button
                variant="outline"
                className="w-full border-slate-700 bg-slate-900/60 text-slate-50 hover:bg-slate-800"
                onClick={() => router.push("/quiz")}
              >
                Continue Previous Quiz
              </Button>
            )}

            <Button
              variant="outline"
              className="w-full border-slate-700 bg-slate-900/60 text-slate-50 hover:bg-slate-800"
              onClick={() => router.push("/create-quiz")}
            >
              Create &amp; Share Custom Quiz
            </Button>

            <p className="text-xs text-slate-400 text-center">
              We don&apos;t store your answers or personal data — this lab is
              purely for training and self‑assessment.
            </p>
          </CardContent>
        </Card>

        {createdQuizzes.length > 0 && (
          <Card className="border border-cyan-500/40 bg-slate-900/80 shadow-2xl backdrop-blur">
            <CardHeader>
              <CardTitle className="text-xl font-semibold tracking-tight text-slate-50">
                Created Quizzes ({createdQuizzes.length})
              </CardTitle>
              <CardDescription className="text-slate-300">
                View details, questions, answers, and all student scores for
                each quiz.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {createdQuizzes.map((quiz) => {
                const isExpanded = expandedQuiz === quiz.id;
                const scores = getQuizScores(quiz.id);
                const questions = getQuizQuestions(quiz.questionIds);
                const sortedScores = [...scores].sort(
                  (a, b) => b.score - a.score || a.timestamp - b.timestamp
                );

                return (
                  <div
                    key={quiz.id}
                    className="rounded-lg border border-slate-700 bg-slate-950/60 p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-100">
                          {quiz.title}
                        </h3>
                        <p className="mt-1 text-xs text-slate-400">
                          {questions.length} questions • Created:{" "}
                          {new Date(quiz.createdAt).toLocaleDateString()} •{" "}
                          {scores.length} attempt{scores.length !== 1 ? "s" : ""}
                        </p>
                        <p className="mt-1 text-xs text-slate-500 font-mono break-all">
                          {quiz.shareUrl}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-slate-400 hover:text-slate-100"
                          onClick={() =>
                            setExpandedQuiz(isExpanded ? null : quiz.id)
                          }
                        >
                          {isExpanded ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-red-400 hover:text-red-300"
                          onClick={() => handleDeleteQuiz(quiz.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="mt-4 space-y-4 border-t border-slate-700 pt-4">
                        <div>
                          <h4 className="mb-2 text-sm font-semibold text-cyan-300">
                            Questions &amp; Answers
                          </h4>
                          <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                            {questions.map((q, idx) => {
                              const correctOption = q.options.find(
                                (o) => o.id === q.correctOptionId
                              );
                              return (
                                <div
                                  key={q.id}
                                  className="rounded-md border border-slate-700 bg-slate-900/40 p-3 text-xs"
                                >
                                  <p className="font-medium text-slate-200">
                                    Q{idx + 1}. {q.question}
                                  </p>
                                  <p className="mt-1 text-slate-400">
                                    Category: {q.category} • Difficulty:{" "}
                                    {q.difficulty}
                                  </p>
                                  <div className="mt-2 space-y-1">
                                    {q.options.map((opt) => (
                                      <p
                                        key={opt.id}
                                        className={
                                          opt.id === q.correctOptionId
                                            ? "text-emerald-300"
                                            : "text-slate-400"
                                        }
                                      >
                                        {opt.id === q.correctOptionId ? "✓ " : "  "}
                                        {opt.text}
                                      </p>
                                    ))}
                                  </div>
                                  <p className="mt-2 text-slate-500">
                                    Explanation: {q.explanation}
                                  </p>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        <div>
                          <h4 className="mb-2 text-sm font-semibold text-emerald-300">
                            Student Scores ({sortedScores.length})
                          </h4>
                          {sortedScores.length > 0 ? (
                            <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                              {sortedScores.map((entry, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-center justify-between rounded-md border border-slate-700 bg-slate-900/40 px-3 py-2 text-xs"
                                >
                                  <div>
                                    <span className="font-mono text-slate-400">
                                      #{idx + 1}
                                    </span>{" "}
                                    <span className="font-medium text-slate-200">
                                      {entry.name || "Anonymous"}
                                    </span>
                                    <span className="ml-2 text-slate-400">
                                      ({entry.correctCount}/
                                      {entry.totalQuestions} correct)
                                    </span>
                                  </div>
                                  <span className="font-semibold text-cyan-300">
                                    {entry.score} / 100
                                  </span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-xs text-slate-500">
                              No attempts yet. Share the link to get started!
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}


