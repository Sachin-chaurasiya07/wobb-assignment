import { beforeEach, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ListPage } from "@/features/list/ListPage";
import { useSelectionStore } from "@/store/useSelectionStore";

function renderListPage() {
  return render(
    <MemoryRouter>
      <ListPage />
    </MemoryRouter>
  );
}

beforeEach(() => {
  useSelectionStore.setState({ entries: {} });
  window.localStorage.clear();
});

describe("ListPage", () => {
  it("renders the empty state without data", () => {
    renderListPage();
    expect(screen.getByText(/your list is empty/i)).toBeInTheDocument();
  });

  it(
    "renders saved profiles without an infinite render loop " +
      "(regression: selectSavedList returns a new array reference every call, " +
      "which without useShallow causes 'Maximum update depth exceeded')",
    () => {
      useSelectionStore.getState().addProfile("tiktok", {
        user_id: "1",
        username: "mrbeast",
        url: "https://example.com",
        picture: "https://example.com/pic.jpg",
        fullname: "MrBeast",
        is_verified: true,
        followers: 92_690_266,
      });

      renderListPage();
      expect(screen.getByText("@mrbeast")).toBeInTheDocument();
    }
  );

  it("still renders correctly with multiple entries", () => {
    useSelectionStore.getState().addProfile("tiktok", {
      user_id: "1",
      username: "mrbeast",
      url: "https://example.com",
      picture: "https://example.com/pic.jpg",
      fullname: "MrBeast",
      is_verified: true,
      followers: 1000,
    });
    useSelectionStore.getState().addProfile("instagram", {
      user_id: "2",
      username: "cristiano",
      url: "https://example.com",
      picture: "https://example.com/pic.jpg",
      fullname: "Cristiano Ronaldo",
      is_verified: true,
      followers: 2000,
    });

    renderListPage();
    expect(screen.getByText("@mrbeast")).toBeInTheDocument();
    expect(screen.getByText("@cristiano")).toBeInTheDocument();
  });
});
