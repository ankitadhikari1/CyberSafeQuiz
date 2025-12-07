"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import questionsData from "@/data/questions.json";

function shuffleArray(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function CreateQuizPage() {
  const router = useRouter();
  const [mode, setMode] = useState("auto"); // "auto" | "manual"
  const [difficulty, setDifficulty] = useState("all");
  const [count, setCount] = useState(10);
  const [selectedIds, setSelectedIds] = useState([]);
  const [title, setTitle] = useState("");
  const [shareUrl, setShareUrl] = useState("");
  const [error, setError] = useState("");

  const filteredQuestions = useMemo(() => {
    if (difficulty === "all") return questionsData;
    return questionsData.filter(
      (q) => (q.difficulty || "medium") === difficulty
    );
  }, [difficulty]);

  const handleToggleQuestion = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleGenerate = () => {
    setError("");
    let ids = [];

    if (mode === "manual") {
      if (selectedIds.length === 0) {
        setError("Select at least one question.");
        return;
      }
      ids = [...selectedIds];
    } else {
      const n = Math.min(
        Math.max(Number(count) || 1, 1),
        Math.min(100, filteredQuestions.length)
      );
      if (filteredQuestions.length === 0) {
        setError(
          "No questions available for this difficulty. Try a different filter."
        );
        return;
      }
      ids = shuffleArray(filteredQuestions)
        .slice(0, n)
        .map((q) => q.id);
    }

    const params = new URLSearchParams();
    params.set("ids", ids.join(","));
    if (difficulty !== "all") params.set("difficulty", difficulty);
    if (title.trim()) params.set("title", title.trim());

    const url =
      (typeof window !== "undefined" ? window.location.origin : "") +
      "/quiz?" +
      params.toString();

    // Save quiz to localStorage
    if (typeof window !== "undefined") {
      try {
        const quizId = `quiz_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const quizData = {
          id: quizId,
          title: title.trim() || `Quiz ${new Date().toLocaleDateString()}`,
          questionIds: ids,
          difficulty: difficulty,
          createdAt: Date.now(),
          shareUrl: url
        };

        const existing = window.localStorage.getItem("cybersafe-quizzes");
        const quizzes = existing ? JSON.parse(existing) : [];
        quizzes.push(quizData);
        window.localStorage.setItem("cybersafe-quizzes", JSON.stringify(quizzes));
      } catch {
        // ignore storage errors
      }
    }

    setShareUrl(url);
  };

  const handleCopy = async () => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
    } catch {
      // ignore
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-10 text-slate-50">
      {/* Cyber grid background */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_#22d3ee33,_transparent_50%),radial-gradient(circle_at_bottom,_#4ade8033,_transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(148,163,184,0.15)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.12)_1px,transparent_1px)] bg-[size:80px_80px]" />

      <div className="w-full max-w-6xl space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Create &amp; Share Custom Quiz
            </h1>
            <p className="text-sm text-slate-300">
              Build a quiz from the question bank and share it via link so
              others can attempt the exact same set.
            </p>
          </div>
          <Button
            variant="outline"
            className="border-slate-700 bg-slate-900/60 text-slate-50 hover:bg-slate-800"
            onClick={() => router.push("/")}
          >
            Back to Home
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
          <Card className="border border-cyan-500/40 bg-slate-900/80 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-slate-50">
                Quiz configuration
              </CardTitle>
              <CardDescription>
                Choose how questions are picked and optionally name your quiz.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-100">
                  Selection mode
                </p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <button
                    type="button"
                    onClick={() => setMode("auto")}
                    className={
                      "rounded-md border px-3 py-2 text-left " +
                      (mode === "auto"
                        ? "border-cyan-400 bg-cyan-500/10"
                        : "border-slate-700 bg-slate-900/60 hover:border-cyan-500/60")
                    }
                  >
                    <p className="font-medium">Auto-select</p>
                    <p className="text-xs text-slate-300">
                      Set a count and difficulty, we pick randomly.
                    </p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode("manual")}
                    className={
                      "rounded-md border px-3 py-2 text-left " +
                      (mode === "manual"
                        ? "border-cyan-400 bg-cyan-500/10"
                        : "border-slate-700 bg-slate-900/60 hover:border-cyan-500/60")
                    }
                  >
                    <p className="font-medium">Manual</p>
                    <p className="text-xs text-slate-300">
                      Pick exact questions from the list.
                    </p>
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="quiz-title"
                  className="block text-sm font-medium text-slate-100"
                >
                  Quiz title (optional)
                </label>
                <input
                  id="quiz-title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-slate-700 bg-slate-950/60 px-3 text-sm text-slate-50 shadow-sm outline-none ring-cyan-500/40 focus-visible:ring-2"
                  placeholder="e.g. Phishing Awareness Drill"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="difficulty-create"
                  className="block text-sm font-medium text-slate-100"
                >
                  Difficulty filter
                </label>
                <select
                  id="difficulty-create"
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-slate-700 bg-slate-950/60 px-3 text-sm text-slate-50 shadow-sm outline-none ring-cyan-500/40 focus-visible:ring-2"
                >
                  <option value="all">All difficulties</option>
                  <option value="easy">Easy only</option>
                  <option value="medium">Medium only</option>
                  <option value="hard">Hard only</option>
                </select>
                <p className="text-xs text-slate-400">
                  Manual mode will show questions using this filter. Auto mode
                  picks from this pool.
                </p>
              </div>

              {mode === "auto" && (
                <div className="space-y-2">
                  <label
                    htmlFor="auto-count"
                    className="block text-sm font-medium text-slate-100"
                  >
                    Number of questions
                  </label>
                  <input
                    id="auto-count"
                    type="number"
                    min={1}
                    max={100}
                    value={count}
                    onChange={(e) => setCount(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-slate-700 bg-slate-950/60 px-3 text-sm text-slate-50 shadow-sm outline-none ring-cyan-500/40 focus-visible:ring-2"
                  />
                  <p className="text-xs text-slate-400">
                    Up to 100 questions will be randomly drawn from the filtered
                    bank.
                  </p>
                </div>
              )}

              {error && (
                <p className="text-xs font-medium text-red-400">{error}</p>
              )}

              <div className="space-y-2">
                <Button
                  className="w-full bg-cyan-500 text-slate-950 hover:bg-cyan-400"
                  onClick={handleGenerate}
                >
                  Generate Shareable Link
                </Button>
                {shareUrl && (
                  <div className="space-y-2">
                    <label className="block text-xs font-medium text-slate-200">
                      Share this link
                    </label>
                    <div className="flex gap-2">
                      <input
                        readOnly
                        value={shareUrl}
                        className="flex-1 truncate rounded-md border border-slate-700 bg-slate-950/60 px-3 py-2 text-xs text-slate-100"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        className="border-slate-700 bg-slate-900/60 text-slate-50 hover:bg-slate-800"
                        onClick={handleCopy}
                      >
                        Copy
                      </Button>
                    </div>
                    <p className="text-xs text-slate-400">
                      Anyone opening this link will see this exact quiz and can
                      attempt it with local top‑10 ranking.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border border-slate-800 bg-slate-950/80 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-slate-50 text-sm">
                Question bank ({filteredQuestions.length} matching)
              </CardTitle>
              <CardDescription>
                In manual mode, click to select which questions should be part
                of the quiz.
              </CardDescription>
            </CardHeader>
            <CardContent className="max-h-[480px] space-y-2 overflow-y-auto pr-2 text-sm">
              {filteredQuestions.map((q) => {
                const checked = selectedIds.includes(q.id);
                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => handleToggleQuestion(q.id)}
                    className={
                      "w-full rounded-md border px-3 py-2 text-left transition-colors " +
                      (mode === "manual"
                        ? checked
                          ? "border-cyan-400 bg-cyan-500/10 shadow-[0_0_18px_rgba(34,211,238,0.35)]"
                          : "border-slate-700 bg-slate-900/40 hover:border-cyan-500/60 hover:bg-slate-900/80"
                        : "border-slate-800 bg-slate-950/60 cursor-default")
                    }
                    disabled={mode !== "manual"}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-medium text-slate-100">
                        {q.question}
                      </p>
                      <span className="ml-2 rounded-full border border-slate-700 bg-slate-900 px-2 py-0.5 text-[10px] uppercase tracking-wide text-slate-300">
                        {q.difficulty || "medium"}
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] text-slate-400">
                      Category: {q.category}
                    </p>
                  </button>
                );
              })}
              {filteredQuestions.length === 0 && (
                <p className="text-xs text-slate-400">
                  No questions match this difficulty filter yet.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}


