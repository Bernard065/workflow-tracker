import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { ApplicationListFilters } from "./ApplicationListFilters";

describe("ApplicationListFilters", () => {
  it("calls onSearchChange when the user types", async () => {
    const user = userEvent.setup();
    const onSearchChange = vi.fn();

    render(
      <ApplicationListFilters
        search=""
        status=""
        applicationType=""
        onSearchChange={onSearchChange}
        onStatusChange={vi.fn()}
        onApplicationTypeChange={vi.fn()}
        onClearFilters={vi.fn()}
      />,
    );

    await user.type(
      screen.getByPlaceholderText(
        /search tracking number, applicant, email, or company/i,
      ),
      "Benard",
    );

    expect(onSearchChange).toHaveBeenCalled();
  });

  it("disables clear button when no filters are active", () => {
    render(
      <ApplicationListFilters
        search=""
        status=""
        applicationType=""
        onSearchChange={vi.fn()}
        onStatusChange={vi.fn()}
        onApplicationTypeChange={vi.fn()}
        onClearFilters={vi.fn()}
      />,
    );

    expect(screen.getByRole("button", { name: /clear/i })).toBeDisabled();
  });

  it("enables clear button when search is active", () => {
    render(
      <ApplicationListFilters
        search="APP"
        status=""
        applicationType=""
        onSearchChange={vi.fn()}
        onStatusChange={vi.fn()}
        onApplicationTypeChange={vi.fn()}
        onClearFilters={vi.fn()}
      />,
    );

    expect(screen.getByRole("button", { name: /clear/i })).toBeEnabled();
  });
});
