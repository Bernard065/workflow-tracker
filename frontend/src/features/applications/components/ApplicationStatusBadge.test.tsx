import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ApplicationStatusBadge } from "./ApplicationStatusBadge";

describe("ApplicationStatusBadge", () => {
  it("renders formatted status text", () => {
    render(<ApplicationStatusBadge status="under_review" />);

    expect(screen.getByText("Under Review")).toBeInTheDocument();
  });

  it("renders need more information status", () => {
    render(<ApplicationStatusBadge status="need_more_information" />);

    expect(screen.getByText("Need More Information")).toBeInTheDocument();
  });
});
