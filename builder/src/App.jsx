import { useState, useEffect } from 'react';
import './index.css';

const defaultPlan = JSON.stringify(
  {
    case: 'demo',
    evidence: ['A', 'B', 'C'],
    verdict: 'pending'
  },
  null,
  2
);

export default function App() {
  const [health, setHealth] = useState({ status: 'checking', pack_sections: [] });
  const [plan, setPlan] = useState(defaultPlan);
  const [verdict, setVerdict] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8000/healthz')
      .then(r => r.json())
      .then(d => setHealth(d))
      .catch(() => setHealth({ status: 'error', pack_sections: [] }));
  }, []);

  const runTrifecta = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      const parsed = JSON.parse(plan);
      const response = await fetch('http://localhost:8000/court/trifecta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed)
      });

      if (!response.ok) {
        throw new Error(`gateway returned HTTP ${response.status}`);
      }

      const data = await response.json();
      setVerdict(data);
    } catch (err) {
      if (err instanceof SyntaxError) {
        setError('Plan must be valid JSON.');
      } else {
        setError(err.message || 'Unknown error');
      }
      setVerdict(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-900/50 px-6 py-4">
        <h1 className="text-2xl font-semibold">Deflex Builder</h1>
       <p className="text-sm text-slate-400">
         FastAPI gateway status: <span className="font-mono">{health.status}</span>
       </p>
        {health.vllm_api_base ? (
          <p className="text-xs text-slate-500">
            vLLM API base: <span className="font-mono">{health.vllm_api_base}</span>
          </p>
        ) : null}
        {health.pack_sections?.length ? (
          <p className="text-xs text-slate-500">
            Constitutional pack mounted with sections: {health.pack_sections.join(', ')}
          </p>
        ) : null}
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-6 py-8 lg:flex-row">
        <section className="w-full lg:w-1/2">
          <h2 className="text-xl font-semibold">Trifecta Plan</h2>
          <p className="mb-4 text-sm text-slate-400">
            Edit the JSON plan and submit it to <code className="rounded bg-slate-800 px-1">/court/trifecta</code>.
          </p>
          <textarea
            className="h-64 w-full rounded border border-slate-800 bg-slate-900 font-mono text-sm text-slate-100 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={plan}
            onChange={event => setPlan(event.target.value)}
          />
          <button
            className="mt-4 inline-flex items-center gap-2 rounded bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-400 disabled:cursor-not-allowed disabled:bg-slate-700"
            onClick={runTrifecta}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting…' : 'Run court trifecta'}
          </button>
          {error ? <p className="mt-2 text-sm text-red-400">{error}</p> : null}
        </section>

        <section className="w-full lg:w-1/2">
          <h2 className="text-xl font-semibold">Result</h2>
          {!verdict ? (
            <p className="mt-2 text-sm text-slate-400">
              Submit a plan to view the verdict and the mounted governance pack contents.
            </p>
          ) : (
            <div className="mt-3 space-y-4">
              <div className="rounded border border-slate-800 bg-slate-900 p-4">
                <h3 className="text-lg font-semibold">Verdict: {verdict.result}</h3>
                {verdict.conditions?.length ? (
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-300">
                    {verdict.conditions.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                ) : null}
              </div>

              <div className="rounded border border-slate-800 bg-slate-900 p-4">
                <h3 className="text-lg font-semibold">Summary</h3>
                <pre className="mt-2 overflow-x-auto whitespace-pre-wrap text-sm text-slate-300">
                  {JSON.stringify(verdict.summary, null, 2)}
                </pre>
              </div>

              <div className="rounded border border-slate-800 bg-slate-900 p-4">
                <h3 className="text-lg font-semibold">Constitutional Pack</h3>
                {verdict.pack?.sections?.map(section => (
                  <details key={section.name} className="group">
                    <summary className="cursor-pointer text-sm font-semibold text-indigo-400">
                      {section.name}
                    </summary>
                    <pre className="mt-2 overflow-x-auto whitespace-pre-wrap text-xs text-slate-300">
                      {section.content || 'No content found.'}
                    </pre>
                  </details>
                ))}
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
