import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

import { getApplications } from "@/api/applications";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { ApplicationEmptyState } from "@/features/applications/components/ApplicationEmptyState";
import { ApplicationListFilters } from "@/features/applications/components/ApplicationListFilters";
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
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [applicationTypeFilter, setApplicationTypeFilter] = useState("");
  const [totalApplications, setTotalApplications] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    queueMicrotask(() => {
      if (!isActive) {
        return;
      }

      setIsFetching(true);
      setErrorMessage(null);
    });

    void getApplications({
      page,
      pageSize,
      search,
      status: statusFilter,
      applicationType: applicationTypeFilter,
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
        setTotalApplications(0);
        setTotalPages(1);
        setErrorMessage(message);
      })
      .finally(() => {
        if (!isActive) {
          return;
        }

        setIsInitialLoading(false);
        setIsFetching(false);
      });

    return () => {
      isActive = false;
    };
  }, [page, pageSize, search, statusFilter, applicationTypeFilter]);

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

  function handleSearchChange(value: string) {
    setSearch(value);
    setPage(1);
  }

  function handleStatusFilterChange(value: string) {
    setStatusFilter(value);
    setPage(1);
  }

  function handleApplicationTypeFilterChange(value: string) {
    setApplicationTypeFilter(value);
    setPage(1);
  }

  function handleClearFilters() {
    setSearch("");
    setStatusFilter("");
    setApplicationTypeFilter("");
    setPage(1);
  }

  const hasActiveFilters = Boolean(search || statusFilter || applicationTypeFilter);

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
            {errorMessage && (
              <Alert variant="destructive">
                <AlertTitle>Unable to load applications</AlertTitle>
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}

            {!errorMessage && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-2xl font-black text-slate-950">
                    Application records
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Review the latest application activity and open records for more
                    details.
                  </p>
                </div>

                <ApplicationListFilters
                  search={search}
                  status={statusFilter}
                  applicationType={applicationTypeFilter}
                  onSearchChange={handleSearchChange}
                  onStatusChange={handleStatusFilterChange}
                  onApplicationTypeChange={handleApplicationTypeFilterChange}
                  onClearFilters={handleClearFilters}
                />

                {isInitialLoading && (
                  <div className="grid gap-4">
                    {[1, 2, 3].map((item) => (
                      <div
                        key={item}
                        className="h-24 animate-pulse rounded-3xl bg-white shadow-sm"
                      />
                    ))}
                  </div>
                )}

                {!isInitialLoading && isFetching && (
                  <div className="rounded-3xl border border-cyan-100 bg-cyan-50 px-4 py-3 text-sm font-semibold text-cyan-800">
                    Updating results...
                  </div>
                )}

                {!isInitialLoading && applications.length === 0 && (
                  <div className="space-y-4">
                    {hasActiveFilters ? (
                      <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                        <h3 className="text-xl font-black text-slate-950">
                          No matching applications found
                        </h3>
                        <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                          Try changing your search term, status filter, or application
                          type filter.
                        </p>
                      </div>
                    ) : (
                      <ApplicationEmptyState />
                    )}
                  </div>
                )}

                {!isInitialLoading && applications.length > 0 && (
                  <>
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
                  </>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.section>
    </main>
  );
}
