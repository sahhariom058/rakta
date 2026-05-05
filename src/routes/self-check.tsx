import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/self-check")({
  head: () => ({
    meta: [
      { title: "Deployment Self-Check — Rakta-Seva Connect" },
      { name: "description", content: "Verify all key routes return 200 after refresh." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SelfCheckPage,
});

const ROUTES = ["/", "/donors", "/register", "/request", "/dashboard"];

type Result = {
  path: string;
  status: number | null;
  ok: boolean;
  ms: number;
  error?: string;
};

function SelfCheckPage() {
  const [results, setResults] = useState<Result[]>([]);
  const [running, setRunning] = useState(false);

  const run = async () => {
    setRunning(true);
    setResults([]);
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const out: Result[] = [];
    for (const path of ROUTES) {
      const start = performance.now();
      try {
        const res = await fetch(`${origin}${path}`, {
          method: "GET",
          cache: "no-store",
          headers: { Accept: "text/html" },
        });
        out.push({
          path,
          status: res.status,
          ok: res.status === 200,
          ms: Math.round(performance.now() - start),
        });
      } catch (e) {
        out.push({
          path,
          status: null,
          ok: false,
          ms: Math.round(performance.now() - start),
          error: e instanceof Error ? e.message : String(e),
        });
      }
      setResults([...out]);
    }
    setRunning(false);
  };

  useEffect(() => {
    run();
  }, []);

  const allOk = results.length === ROUTES.length && results.every((r) => r.ok);

  return (
    <main className="container mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Deployment Self-Check</h1>
      <p className="text-muted-foreground mb-6">
        Verifies that core routes return HTTP 200 on direct request (refresh-safe).
      </p>

      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={run}
          disabled={running}
          className="px-4 py-2 rounded-md bg-primary text-primary-foreground disabled:opacity-50"
        >
          {running ? "Running…" : "Re-run checks"}
        </button>
        {results.length === ROUTES.length && (
          <span
            className={`text-sm font-medium ${
              allOk ? "text-green-600" : "text-destructive"
            }`}
          >
            {allOk ? "All routes OK ✓" : "Some routes failed ✗"}
          </span>
        )}
      </div>

      <ul className="divide-y border rounded-md">
        {ROUTES.map((path) => {
          const r = results.find((x) => x.path === path);
          return (
            <li key={path} className="flex items-center justify-between px-4 py-3">
              <code className="text-sm">{path}</code>
              <div className="flex items-center gap-3 text-sm">
                {!r ? (
                  <span className="text-muted-foreground">pending…</span>
                ) : (
                  <>
                    <span className="text-muted-foreground">{r.ms}ms</span>
                    <span
                      className={`px-2 py-0.5 rounded font-mono text-xs ${
                        r.ok
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {r.status ?? "ERR"}
                    </span>
                  </>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      {results.some((r) => r.error) && (
        <pre className="mt-6 p-3 bg-muted rounded text-xs overflow-auto">
          {results
            .filter((r) => r.error)
            .map((r) => `${r.path}: ${r.error}`)
            .join("\n")}
        </pre>
      )}
    </main>
  );
}
