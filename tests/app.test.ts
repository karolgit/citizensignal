import { describe, expect, it } from "vitest";

import { APP_NAME, createAppBanner } from "../src/app.js";

describe("createAppBanner", () => {
  it("includes the application name", () => {
    expect(APP_NAME).toBe("CitizenSignal");
    expect(createAppBanner()).toContain(APP_NAME);
  });
});
