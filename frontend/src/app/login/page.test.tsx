
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import LoginPage from "./page";
import { loginUser } from "@/lib/api";

// Replace the real API call with a fake one for this test
vi.mock("@/lib/api", () => ({
  loginUser: vi.fn()
}));

// Replace Next.js navigation with a fake router
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn()
  })
}));

describe("Login Page", () => {
  it("should display an error when login fails", async () => {
    const user = userEvent.setup();

    // Pretend the API rejects the login
    vi.mocked(loginUser).mockRejectedValueOnce(
      new Error("Invalid email or password.")
    );

    render(<LoginPage />);

    // Enter login details
    await user.type(
      screen.getByPlaceholderText("Enter your email"),
      "wrong@gmail.com"
    );

    await user.type(
      screen.getByPlaceholderText("Enter your password"),
      "wrongpassword"
    );

    // Click Sign In
    await user.click(
      screen.getByRole("button", { name: "Sign In" })
    );

    // Check that the error is displayed
    expect(
      await screen.findByText("Invalid email or password.")
    ).toBeInTheDocument();

    // Check that the button is enabled again
    expect(
      screen.getByRole("button", { name: "Sign In" })
    ).not.toBeDisabled();

    // Check that the API received the entered details
    expect(loginUser).toHaveBeenCalledWith(
      "wrong@gmail.com",
      "wrongpassword"
    );
  });
});
