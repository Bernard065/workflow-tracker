import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { getApplications } from "@/api/applications";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { ApplicationEmptyState } from "@/features/applications/components/ApplicationEmptyState";
import { ApplicationListHeader } from "@/features/applications/components/ApplicationListHeader";
import { ApplicationMobileCard } from "@/features/applications/components/ApplicationMobileCard";
import { ApplicationsPagination } from "@/features/applications/components/ApplicationsPagination";
import { ApplicationsTable } from "@/features/applications/components/ApplicationsTable";
import type { ApplicationListItem } from "@/types/application";

const DEFAULT_PAGE_SIZE = 10;

export function ApplicationListPage() {
  const [applications, setApplications] = useState<ApplicationListItem[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(DEFAULT_PAGE_SIZE);
  const [totalApplications, setTotalApplications] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    queueMicrotask(() => {
      if (!isActive) {
        return;
      }

      setIsLoading(true);
      setErrorMessage(null);
    });

    void getApplications({
      page,
      pageSize,
    })
      .then((data) => {
        if (!isActive) {
          return;
        }

        setApplications(data.items);
        setTotalApplications(data.total);
        setTotalPages(data.total_pages);
      })
      .catch((error: unknown) => {
        if (!isActive) {
          return;
        }

        const message =
          error instanceof Error ? error.message : "Failed to load applications.";

        setApplications([]);
        setErrorMessage(message);
      })
      .finally(() => {
        if (!isActive) {
          return;
        }

        setIsLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [page, pageSize]);

  const approvedApplications = useMemo(
    () =>
      applications.filter((application) => application.status === "approved").length,
    [applications],
  );

  const activeApplications = useMemo(
    () =>
      applications.filter(
        (application) =>
          application.status !== "approved" && application.status !== "rejected",
      ).length,
    [applications],
  );

  function handlePageChange(nextPage: number) {
    setPage(nextPage);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 px-4 py-6 text-slate-950 sm:px-6 lg:px-8">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.28),transparent_34%),radial-gradient(circle_at_top_right,rgba(16,185,129,0.18),transparent_28%),linear-gradient(135deg,#020617_0%,#0f172a_48%,#172554_100%)]" />

      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="mx-auto flex max-w-7xl flex-col gap-6"
      >
        <ApplicationListHeader
          totalApplications={totalApplications}
          activeApplications={activeApplications}
          approvedApplications={approvedApplications}
        />

        <Card className="border-white/80 bg-slate-50/95 shadow-2xl shadow-slate-950/20 backdrop-blur">
          <CardContent className="p-4 sm:p-6 lg:p-8">
            {isLoading && (
              <div className="grid gap-4">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="h-24 animate-pulse rounded-3xl bg-white shadow-sm"
                  />
                ))}
              </div>
            )}

            {errorMessage && (
              <Alert variant="destructive">
                <AlertTitle>Unable to load applications</AlertTitle>
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}

            {!isLoading && !errorMessage && applications.length === 0 && (
              <ApplicationEmptyState />
            )}

            {!isLoading && !errorMessage && applications.length > 0 && (
              <div className="space-y-5">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                  <div>
                    <h2 className="text-2xl font-black text-slate-950">
                      Application records
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Review the latest application activity and open records for more
                      details.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-500 shadow-sm">
                    <Search className="h-4 w-4" />
                    Search and filters
                  </div>
                </div>

                <ApplicationsTable applications={applications} />

                <div className="grid gap-4 lg:hidden">
                  {applications.map((application, index) => (
                    <ApplicationMobileCard
                      key={application.id}
                      application={application}
                      index={index}
                    />
                  ))}
                </div>

                <ApplicationsPagination
                  page={page}
                  pageSize={pageSize}
                  total={totalApplications}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </motion.section>
    </main>
  );
}
