import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { ApplicationForm } from "./ApplicationForm";

describe("ApplicationForm", () => {
  it("shows validation messages when required fields are empty", async () => {
    const user = userEvent.setup();

    render(<ApplicationForm submitLabel="Create Draft" onSubmit={vi.fn()} />);

    await user.click(screen.getByRole("button", { name: /create draft/i }));

    expect(screen.getByText("Applicant name is required.")).toBeInTheDocument();
    expect(screen.getByText("Applicant email is required.")).toBeInTheDocument();
    expect(screen.getByText("Company name is required.")).toBeInTheDocument();
    expect(screen.getByText("Description is required.")).toBeInTheDocument();
  });

  it("submits valid form values", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(undefined);

    render(<ApplicationForm submitLabel="Create Draft" onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText(/applicant name/i), "Jane Doe");
    await user.type(screen.getByLabelText(/applicant email/i), "jane@example.com");
    await user.type(screen.getByLabelText(/company name/i), "Jane Holdings");
    await user.type(
      screen.getByLabelText(/description/i),
      "Application test description.",
    );

    await user.click(screen.getByRole("button", { name: /create draft/i }));

    expect(onSubmit).toHaveBeenCalledWith({
      applicant_name: "Jane Doe",
      applicant_email: "jane@example.com",
      company_name: "Jane Holdings",
      application_type: "recordation",
      description: "Application test description.",
    });
  });
});
