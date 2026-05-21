import { ArrowLeft, FileQuestion } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function NotFoundPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 px-4 py-6 sm:px-6 lg:px-8">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.22),transparent_34%),linear-gradient(135deg,#020617_0%,#0f172a_52%,#172554_100%)]" />

      <section className="mx-auto flex min-h-[80vh] max-w-3xl items-center justify-center">
        <Card className="w-full border-white/80 bg-slate-50/95 text-center shadow-2xl shadow-slate-950/20">
          <CardContent className="p-8 sm:p-12">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-cyan-100 text-cyan-700">
              <FileQuestion className="h-8 w-8" />
            </div>

            <h1 className="text-4xl font-black tracking-tight text-slate-950">
              Page not found
            </h1>

            <p className="mx-auto mt-3 max-w-md text-slate-600">
              The page you are looking for does not exist or may have been moved.
            </p>

            <Button
              asChild
              className="mt-6 rounded-full bg-cyan-400 px-6 font-bold text-slate-950 hover:bg-cyan-300"
            >
              <Link to="/applications">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to applications
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
