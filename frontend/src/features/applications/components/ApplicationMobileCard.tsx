import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { ApplicationListItem } from "@/types/application";
import { formatApplicationType } from "@/utils/status";

import { formatDate } from "../utils";
import { ApplicationStatusBadge } from "./ApplicationStatusBadge";

interface ApplicationMobileCardProps {
  application: ApplicationListItem;
  index: number;
}

export function ApplicationMobileCard({
  application,
  index,
}: ApplicationMobileCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.04,
        duration: 0.28,
        ease: "easeOut",
      }}
    >
      <Card className="border-slate-200 bg-white shadow-lg shadow-slate-200/70">
        <CardContent className="space-y-5 p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-slate-500">Tracking Number</p>
              <p className="mt-1 font-black text-slate-950">
                {application.tracking_number}
              </p>
            </div>

            <ApplicationStatusBadge status={application.status} />
          </div>

          <div className="grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <p className="text-slate-500">Applicant</p>
              <p className="font-semibold text-slate-900">
                {application.applicant_name}
              </p>
            </div>

            <div>
              <p className="text-slate-500">Company</p>
              <p className="font-semibold text-slate-900">{application.company_name}</p>
            </div>

            <div>
              <p className="text-slate-500">Type</p>
              <p className="font-semibold text-slate-900">
                {formatApplicationType(application.application_type)}
              </p>
            </div>

            <div>
              <p className="text-slate-500">Created</p>
              <p className="font-semibold text-slate-900">
                {formatDate(application.created_at)}
              </p>
            </div>
          </div>

          <Button asChild variant="outline" className="w-full rounded-full">
            <Link to={`/applications/${application.id}`}>
              View application
              <ArrowUpRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
