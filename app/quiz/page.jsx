"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import questionsData from "@/data/questions.json";
import { Home } from "lucide-react";

function shuffleArray(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function QuizPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const countParam = searchParams.get("count");
  const difficultyParam = searchParams.get("difficulty") || "all";
  const idsParam = searchParams.get("ids");

  const requestedCount = Number(countParam) || 10;

  const [results, setResults] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [infoMessage, setInfoMessage] = useState(null);
  const [answers, setAnswers] = useState({});
  const [bestScore, setBestScore] = useState(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check if we should resume a saved quiz (only if params match)
    let shouldResume = false;
    try {
      const raw = window.localStorage.getItem("cybersafe-quiz-current");
      if (raw) {
        const stored = JSON.parse(raw);
        if (
          stored &&
          Array.isArray(stored.questions) &&
          stored.questions.length > 0 &&
          !stored.completed &&
          stored.requestedCount === requestedCount &&
          stored.difficulty === difficultyParam &&
          stored.ids === (idsParam || null)
        ) {
          shouldResume = true;
          setQuestions(stored.questions);
          setAnswers(stored.answers || {});
          setInfoMessage(null);
        }
      }
    } catch {
      // ignore parse errors, will create fresh quiz
    }

    // If not resuming, create fresh quiz
    if (!shouldResume) {
      let basePool = questionsData;
      if (idsParam) {
        const idSet = new Set(idsParam.split(","));
        basePool = questionsData.filter((q) => idSet.has(q.id));
      } else if (difficultyParam !== "all") {
        basePool = questionsData.filter(
          (q) => (q.difficulty || "medium") === difficultyParam
        );
      }

      const shuffled = shuffleArray(basePool);
      const totalAvailable = shuffled.length;
      let actual = idsParam ? totalAvailable : requestedCount;
      if (!idsParam && requestedCount > totalAvailable) {
        actual = totalAvailable;
      }
      if (actual < 1) actual = 1;

      const picked = shuffled.slice(0, actual);
      const message =
        !idsParam && requestedCount > totalAvailable
          ? `Only ${totalAvailable} questions available for this difficulty. Using all of them.`
          : null;

      setQuestions(picked);
      setAnswers({});
      setInfoMessage(message);

      try {
        window.localStorage.setItem(
          "cybersafe-quiz-current",
          JSON.stringify({
            questions: picked,
            answers: {},
            requestedCount: actual,
            difficulty: difficultyParam,
            ids: idsParam || null,
            completed: false
          })
        );
      } catch {
        // localStorage may be unavailable; ignore
      }
    }

    // load best score if present
    try {
      const rawBest = window.localStorage.getItem("cybersafe-quiz-best");
      if (rawBest) {
        const best = JSON.parse(rawBest);
        if (best && typeof best.score === "number") {
          setBestScore(best.score);
        }
      }
    } catch {
      // ignore
    }
  }, [requestedCount, difficultyParam, idsParam]);

  const totalQuestions = questions.length;
  const answeredCount = Object.keys(answers).length;
  const progressValue =
    totalQuestions === 0 ? 0 : Math.round((answeredCount / totalQuestions) * 100);

  const handleSelect = (questionId, optionId) => {
    setAnswers((prev) => {
      const next = {
        ...prev,
        [questionId]: optionId
      };

      if (typeof window !== "undefined") {
        try {
          const raw = window.localStorage.getItem("cybersafe-quiz-current");
          let stored = {
            questions,
            requestedCount,
            completed: false
          };
          if (raw) {
            stored = { ...stored, ...JSON.parse(raw) };
          }
          stored.questions = questions;
          stored.answers = next;
          stored.completed = false;
          window.localStorage.setItem(
            "cybersafe-quiz-current",
            JSON.stringify(stored)
          );
        } catch {
          // ignore storage errors
        }
      }

      return next;
    });
  };

  const handleSubmit = () => {
    if (totalQuestions === 0) return;

    let correctCount = 0;
    const perQuestion = 100 / totalQuestions;

    const detailed = questions.map((q) => {
      const selectedOptionId = answers[q.id] || null;
      const isCorrect = selectedOptionId === q.correctOptionId;
      if (isCorrect) correctCount += 1;
      return {
        ...q,
        selectedOptionId,
        isCorrect
      };
    });

    const rawScore = correctCount * perQuestion;
    const finalScore = Math.round(rawScore);

    // Find quiz ID if this is a custom quiz
    let quizId = null;
    if (idsParam && typeof window !== "undefined") {
      try {
        const rawQuizzes = window.localStorage.getItem("cybersafe-quizzes");
        if (rawQuizzes) {
          const quizzes = JSON.parse(rawQuizzes);
          const sortedIds = idsParam.split(",").sort().join(",");
          const found = quizzes.find(
            (q) => q.questionIds.sort().join(",") === sortedIds
          );
          if (found) {
            quizId = found.id;
          }
        }
      } catch {
        // ignore
      }
    }

    const quizKeyBase = quizId
      ? quizId
      : idsParam
        ? `custom:${idsParam.split(",").sort().join(",")}`
        : `generated:${totalQuestions}:${difficultyParam}`;

    setResults({
      totalQuestions,
      correctCount,
      incorrectCount: totalQuestions - correctCount,
      score: finalScore,
      perQuestion,
      detailed,
      quizKey: quizKeyBase,
      quizId: quizId
    });

    if (typeof window !== "undefined") {
      try {
        // mark current quiz as completed
        const raw = window.localStorage.getItem("cybersafe-quiz-current");
        let stored = {
          questions,
          requestedCount,
          answers,
          completed: true
        };
        if (raw) {
          stored = { ...stored, ...JSON.parse(raw) };
        }
        stored.completed = true;
        stored.lastScore = finalScore;
        window.localStorage.setItem(
          "cybersafe-quiz-current",
          JSON.stringify(stored)
        );

        // update best score (global best)
        const rawBest = window.localStorage.getItem("cybersafe-quiz-best");
        let bestScoreValue = 0;
        if (rawBest) {
          const best = JSON.parse(rawBest);
          if (best && typeof best.score === "number") {
            bestScoreValue = best.score;
          }
        }
        if (finalScore > bestScoreValue) {
          window.localStorage.setItem(
            "cybersafe-quiz-best",
            JSON.stringify({
              score: finalScore,
              totalQuestions,
              correctCount,
              timestamp: Date.now()
            })
          );
        }
      } catch {
        // ignore storage errors
      }
    }
  };

  const handleRetake = () => {
    router.push("/");
  };

  // Leaderboard state when results are visible
  const [playerName, setPlayerName] = useState("");
  const [leaderboard, setLeaderboard] = useState([]);
  const [savedToBoard, setSavedToBoard] = useState(false);

  useEffect(() => {
    if (!results || typeof window === "undefined") return;
    try {
      const storageKey = results.quizId
        ? `cybersafe-quiz-scores-${results.quizId}`
        : `cybersafe-leaderboard:${results.quizKey}`;
      const raw = window.localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setLeaderboard(parsed);
        }
      }
    } catch {
      // ignore
    }
  }, [results]);

  const handleSaveToLeaderboard = () => {
    if (!results || typeof window === "undefined") return;
    const name = playerName.trim() || "Anonymous";
    const entry = {
      name,
      score: results.score,
      correctCount: results.correctCount,
      totalQuestions: results.totalQuestions,
      timestamp: Date.now()
    };
    try {
      // Use quizId if available, otherwise fall back to quizKey
      const storageKey = results.quizId
        ? `cybersafe-quiz-scores-${results.quizId}`
        : `cybersafe-leaderboard:${results.quizKey}`;
      const raw = window.localStorage.getItem(storageKey);
      let list = [];
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) list = parsed;
      }
      list.push(entry);
      list.sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return a.timestamp - b.timestamp;
      });
      // Keep top 10
      list = list.slice(0, 10);
      window.localStorage.setItem(storageKey, JSON.stringify(list));
      setLeaderboard(list);
      setSavedToBoard(true);
    } catch {
      // ignore
    }
  };

  if (results) {
    return (
      <main className="relative mx-auto flex min-h-screen max-w-5xl flex-col gap-6 overflow-hidden bg-slate-950 px-4 py-8 text-slate-50">
        {/* Cyber grid background */}
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_#22d3ee33,_transparent_50%),radial-gradient(circle_at_bottom,_#4ade8033,_transparent_55%)]" />
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(148,163,184,0.15)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.12)_1px,transparent_1px)] bg-[size:80px_80px]" />

        {/* Terminal-style status in the corner */}
        <div className="pointer-events-none absolute bottom-6 right-6 z-0 hidden max-w-xs rounded-md border border-slate-700 bg-slate-900/80 px-3 py-2 font-mono text-[10px] text-slate-300 shadow-[0_0_25px_rgba(15,23,42,0.9)] md:block">
          <p className="animate-pulse">root@cybersafe:~$ tail -f quiz.log</p>
          <p className="text-emerald-300">
            [OK] Session completed. Score: {results.score}/100
          </p>
          <p className="text-cyan-300">
            [INFO] Review explanations to harden your security posture.
          </p>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Quiz Results
            </h1>
            <p className="text-sm text-slate-300">
              Review each question, your answer, and the explanation.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 border border-slate-700 bg-slate-900/60 text-slate-50 hover:bg-slate-800"
              onClick={() => router.push("/")}
              aria-label="Back to home"
            >
              <Home className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="border-slate-700 bg-slate-900/60 text-slate-50 hover:bg-slate-800"
              onClick={handleRetake}
            >
              Retake Quiz
            </Button>
          </div>
        </div>

        <Card className="border border-cyan-500/40 bg-slate-900/80 shadow-[0_18px_40px_rgba(15,23,42,0.7)] backdrop-blur">
          <CardHeader>
            <CardTitle>Your Score: {results.score} / 100</CardTitle>
            <CardDescription>
              Correct: {results.correctCount} | Incorrect:{" "}
              {results.incorrectCount} (out of {results.totalQuestions} questions)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Progress value={results.score} />
              <p className="mt-2 text-xs text-slate-300">
                Each question was worth{" "}
                {results.perQuestion.toFixed(2)} marks.
              </p>
              {bestScore !== null && (
                <p className="mt-1 text-xs text-slate-400">
                  Highest score so far (all quizzes):{" "}
                  <span className="font-semibold text-emerald-300">
                    {bestScore} / 100
                  </span>
                </p>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-[minmax(0,1.4fr)_minmax(0,2fr)]">
              <div className="space-y-2">
                <p className="text-xs font-medium text-slate-200">
                  Save to this quiz&apos;s Top 10
                </p>
                {!savedToBoard && (
                  <>
                    <input
                      type="text"
                      value={playerName}
                      onChange={(e) => setPlayerName(e.target.value)}
                      placeholder="Enter your name"
                      className="flex h-9 w-full rounded-md border border-slate-700 bg-slate-950/60 px-3 text-xs text-slate-50 shadow-sm outline-none ring-cyan-500/40 focus-visible:ring-2"
                    />
                    <Button
                      size="sm"
                      className="bg-cyan-500 text-slate-950 hover:bg-cyan-400"
                      onClick={handleSaveToLeaderboard}
                    >
                      Save score
                    </Button>
                  </>
                )}
                {savedToBoard && (
                  <p className="text-xs text-emerald-300">
                    Saved! Your score is now in this quiz&apos;s local Top 10.
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <p className="text-xs font-medium text-slate-200">
                  Local Top 10 for this quiz
                </p>
                {leaderboard.length === 0 ? (
                  <p className="text-xs text-slate-400">
                    No entries yet. Be the first to save a score.
                  </p>
                ) : (
                  <ul className="space-y-1 text-xs text-slate-200">
                    {leaderboard.map((entry, idx) => (
                      <li
                        key={`${entry.name}-${entry.timestamp}-${idx}`}
                        className="flex items-center justify-between rounded border border-slate-800 bg-slate-950/40 px-2 py-1"
                      >
                        <span>
                          #{idx + 1} {entry.name}
                        </span>
                        <span className="font-semibold text-emerald-300">
                          {entry.score}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4 pb-10">
          {results.detailed.map((q, idx) => {
            const userOption = q.options.find(
              (o) => o.id === q.selectedOptionId
            );
            const correctOption = q.options.find(
              (o) => o.id === q.correctOptionId
            );
            const isCorrect = q.isCorrect;

            return (
              <Card
                key={q.id}
                className={
                  isCorrect
                    ? "border-l-4 border-l-emerald-500 bg-slate-900/70"
                    : "border-l-4 border-l-red-500 bg-slate-900/70"
                }
              >
                <CardHeader>
                  <CardTitle className="flex items-center justify-between gap-2 text-base">
                    <span>
                      Q{idx + 1}. {q.question}
                    </span>
                    <span
                      className={
                        isCorrect
                          ? "rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs font-semibold text-emerald-200"
                          : "rounded-full bg-red-500/20 px-2 py-0.5 text-xs font-semibold text-red-100"
                      }
                    >
                      {isCorrect ? "Correct" : "Incorrect"}
                    </span>
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Category: {q.category} • Difficulty: {q.difficulty}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div>
                    <p className="font-medium">Your answer:</p>
                    <p
                      className={
                        isCorrect
                          ? "text-emerald-300"
                          : "text-red-300"
                      }
                    >
                      {userOption
                        ? `${userOption.text}`
                        : "No answer selected"}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">Correct answer:</p>
                    <p className="text-emerald-300">
                      {correctOption ? correctOption.text : "Not available"}
                    </p>
                  </div>
                  <div className="pt-1">
                    <p className="font-medium">Explanation:</p>
                    <p className="text-slate-300">{q.explanation}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>
    );
  }

  return (
    <main className="relative mx-auto flex min-h-screen max-w-5xl flex-col gap-6 overflow-hidden bg-slate-950 px-4 py-8 text-slate-50">
      {/* Cyber grid background */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_#22d3ee33,_transparent_50%),radial-gradient(circle_at_bottom,_#4ade8033,_transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(148,163,184,0.15)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.12)_1px,transparent_1px)] bg-[size:80px_80px]" />

      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            CyberSafe Quiz
          </h1>
          <p className="text-sm text-slate-300">
            Answer all questions to get your cybersecurity awareness score.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 border border-slate-700 bg-slate-900/60 text-slate-50 hover:bg-slate-800"
            onClick={() => router.push("/")}
            aria-label="Back to home"
          >
            <Home className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="border-slate-700 bg-slate-900/60 text-slate-50 hover:bg-slate-800"
            onClick={() => router.push("/")}
          >
            Change Question Count
          </Button>
        </div>
      </div>

      <Card className="border border-cyan-500/40 bg-slate-900/80 shadow-[0_18px_40px_rgba(15,23,42,0.7)] backdrop-blur">
        <CardHeader className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <CardTitle>Quiz Progress</CardTitle>
              <CardDescription>
                {answeredCount} of {totalQuestions} answered
              </CardDescription>
            </div>
            <span className="text-sm font-medium text-cyan-300">
              {progressValue}% complete
            </span>
          </div>
          <Progress value={progressValue} className="h-2 rounded-full bg-slate-800">
            {/* filled bar is cyan via Progress component */}
          </Progress>
          {infoMessage && (
            <p className="text-xs text-amber-200 bg-amber-500/10 border border-amber-400/40 rounded-md px-3 py-2">
              {infoMessage}
            </p>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {questions.map((q, idx) => (
            <div
              key={q.id}
              className="rounded-lg border border-slate-700 bg-slate-900/70 p-4 shadow-sm"
            >
              <p className="mb-2 text-sm font-semibold text-slate-100">
                Q{idx + 1}. {q.question}
              </p>
              <p className="mb-3 text-xs text-slate-400">
                Category: {q.category} • Difficulty: {q.difficulty}
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                {q.options.map((opt) => {
                  const selected = answers[q.id] === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleSelect(q.id, opt.id)}
                      className={
                        "flex items-start rounded-md border px-3 py-2 text-left text-sm transition-colors " +
                        (selected
                          ? "border-cyan-400 bg-cyan-500/10 shadow-[0_0_20px_rgba(34,211,238,0.35)]"
                          : "border-slate-700 bg-slate-900/40 hover:border-cyan-500/60 hover:bg-slate-900/80")
                      }
                    >
                      <span className="mr-2 mt-0.5 h-4 w-4 rounded-full border border-cyan-500 bg-slate-950">
                        {selected && (
                          <span className="block h-full w-full rounded-full bg-cyan-400" />
                        )}
                      </span>
                      <span className="text-slate-100">{opt.text}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="mt-2 flex justify-end gap-3 pb-10">
        <Button
          variant="outline"
          className="border-slate-700 bg-slate-900/60 text-slate-50 hover:bg-slate-800"
          onClick={() => router.push("/")}
        >
          Cancel
        </Button>
        <Button
          className="bg-cyan-500 text-slate-950 hover:bg-cyan-400"
          onClick={handleSubmit}
        >
          Submit Quiz
        </Button>
      </div>
    </main>
  );
}

export default function QuizPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center">Loading quiz...</main>}>
      <QuizPageInner />
    </Suspense>
  );
}
