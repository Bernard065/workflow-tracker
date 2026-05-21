import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { ApplicationListItem } from "@/types/application";
import { formatApplicationType } from "@/utils/status";

import { formatDate } from "../utils";
import { ApplicationStatusBadge } from "./ApplicationStatusBadge";

interface ApplicationsTableProps {
  applications: ApplicationListItem[];
}

export function ApplicationsTable({ applications }: ApplicationsTableProps) {
  return (
    <div className="hidden overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/70 lg:block">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-100/80 hover:bg-slate-100/80">
            <TableHead>Tracking Number</TableHead>
            <TableHead>Applicant</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {applications.map((application, index) => (
            <motion.tr
              key={application.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: index * 0.035,
                duration: 0.25,
                ease: "easeOut",
              }}
              className="border-b transition-colors hover:bg-cyan-50/60"
            >
              <TableCell className="font-bold text-slate-950">
                {application.tracking_number}
              </TableCell>

              <TableCell>{application.applicant_name}</TableCell>

              <TableCell>{application.company_name}</TableCell>

              <TableCell>
                {formatApplicationType(application.application_type)}
              </TableCell>

              <TableCell>
                <ApplicationStatusBadge status={application.status} />
              </TableCell>

              <TableCell>{formatDate(application.created_at)}</TableCell>

              <TableCell className="text-right">
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="group rounded-full"
                >
                  <Link to={`/applications/${application.id}`}>
                    View
                    <ArrowUpRight className="ml-2 h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </Button>
              </TableCell>
            </motion.tr>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
