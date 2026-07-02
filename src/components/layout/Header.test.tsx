import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { Header } from "@/components/layout/Header";

describe("Header search navigation (diagnostic)", () => {
  it("navigates back to / when clicking Search from /list", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={["/list"]}>
        <Header />
        <Routes>
          <Route path="/" element={<div>SEARCH_PAGE_MARKER</div>} />
          <Route path="/list" element={<div>LIST_PAGE_MARKER</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("LIST_PAGE_MARKER")).toBeInTheDocument();

    const searchLink = screen.getByRole("link", { name: /search/i });
    await user.click(searchLink);

    expect(screen.getByText("SEARCH_PAGE_MARKER")).toBeInTheDocument();
  });
});
