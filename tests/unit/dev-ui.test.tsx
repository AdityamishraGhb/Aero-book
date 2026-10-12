import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import UIDesignSystemPage from "@/app/dev/ui/page";

describe("UIDesignSystemPage", () => {
  it("renders showroom title and all main sections", () => {
    render(<UIDesignSystemPage />);
    expect(screen.getByText("AeroBook UI Showroom")).toBeInTheDocument();
    expect(screen.getByText("Color Palette & Design Tokens")).toBeInTheDocument();
    expect(screen.getByText("Buttons & Action Triggers")).toBeInTheDocument();
    expect(screen.getByText("Inputs, Selects & Field States")).toBeInTheDocument();
    expect(screen.getByText("Badges & Status Micro-Tokens")).toBeInTheDocument();
    expect(screen.getByText("Cards & Flight Result Previews")).toBeInTheDocument();
    expect(screen.getByText("Interactive State Matrix")).toBeInTheDocument();
  });
});
