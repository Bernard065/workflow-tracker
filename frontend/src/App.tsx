import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "@/routes/AppRoutes";

export function App() {
  return (
    <BrowserRouter>
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 px-6 py-4 backdrop-blur-xl backdrop-saturate-150 dark:border-slate-800/80 dark:bg-slate-950/90 sm:px-8">
        <div className="mx-auto flex max-w-screen-2xl items-center gap-3 text-slate-950 dark:text-white">
          <div className="h-11 w-11 overflow-hidden rounded-2xl bg-white/90 flex items-center justify-center shadow-lg">
            <svg className="h-8 w-8" viewBox="0 0 21 20" aria-hidden>
              <use href="/icons.svg#documentation-icon" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">
              Workflow tracker
            </p>
            <h1 className="text-xl font-black tracking-tight text-slate-950 dark:text-white">
              Application Workflow Tracker
            </h1>
          </div>
        </div>
      </header>
      <AppRoutes />
    </BrowserRouter>
  );
}
