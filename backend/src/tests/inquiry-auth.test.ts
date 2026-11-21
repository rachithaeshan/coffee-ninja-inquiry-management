
import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../app.js";

describe("Inquiry API authentication", () => {
  it("should reject requests without an authentication token", async () => {
    const response = await request(app)
      .get("/api/inquiries");

    expect(response.status).toBe(401);

    expect(response.body).toEqual({
      success: false,
      message: "Authentication required."
    });
  });
});
