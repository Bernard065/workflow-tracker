import { describe, expect, it } from "vitest";

import {
  canEditApplication,
  canRecordDecision,
  canStartReview,
  canSubmitApplication,
  formatApplicationStatus,
  formatApplicationType,
} from "./status";

describe("status utilities", () => {
  it("formats application types", () => {
    expect(formatApplicationType("recordation")).toBe("Recordation");
    expect(formatApplicationType("change_of_ownership")).toBe("Change of Ownership");
    expect(formatApplicationType("change_of_name")).toBe("Change of Name");
  });

  it("formats application statuses", () => {
    expect(formatApplicationStatus("draft")).toBe("Draft");
    expect(formatApplicationStatus("under_review")).toBe("Under Review");
    expect(formatApplicationStatus("need_more_information")).toBe(
      "Need More Information",
    );
  });

  it("allows editing only for draft and need more information", () => {
    expect(canEditApplication("draft")).toBe(true);
    expect(canEditApplication("need_more_information")).toBe(true);
    expect(canEditApplication("submitted")).toBe(false);
    expect(canEditApplication("approved")).toBe(false);
  });

  it("allows submit only for draft and need more information", () => {
    expect(canSubmitApplication("draft")).toBe(true);
    expect(canSubmitApplication("need_more_information")).toBe(true);
    expect(canSubmitApplication("under_review")).toBe(false);
  });

  it("allows start review only for submitted applications", () => {
    expect(canStartReview("submitted")).toBe(true);
    expect(canStartReview("draft")).toBe(false);
  });

  it("allows reviewer decision only for under review applications", () => {
    expect(canRecordDecision("under_review")).toBe(true);
    expect(canRecordDecision("submitted")).toBe(false);
    expect(canRecordDecision("rejected")).toBe(false);
  });
});
