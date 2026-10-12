import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

describe("UI primitives", () => {
  describe("Input", () => {
    it("renders with placeholder and data-slot", () => {
      render(<Input placeholder="Search destination" />);
      const input = screen.getByPlaceholderText("Search destination");
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute("data-slot", "input");
    });

    it("applies error state attributes and classes", () => {
      render(<Input placeholder="Airport" error aria-invalid="true" />);
      const input = screen.getByPlaceholderText("Airport");
      expect(input).toHaveAttribute("data-error", "true");
      expect(input).toHaveAttribute("aria-invalid", "true");
    });

    it("supports disabled state", () => {
      render(<Input placeholder="Locked" disabled />);
      const input = screen.getByPlaceholderText("Locked");
      expect(input).toBeDisabled();
    });
  });

  describe("Card", () => {
    it("renders complete card structure", () => {
      render(
        <Card data-testid="card-root">
          <CardHeader>
            <CardTitle>Flight Deal</CardTitle>
            <CardDescription>Lowest available fare</CardDescription>
          </CardHeader>
          <CardContent>DEL to BOM for ₹4,299</CardContent>
          <CardFooter>Book Now</CardFooter>
        </Card>
      );

      expect(screen.getByTestId("card-root")).toBeInTheDocument();
      expect(screen.getByText("Flight Deal")).toBeInTheDocument();
      expect(screen.getByText("Lowest available fare")).toBeInTheDocument();
      expect(screen.getByText("DEL to BOM for ₹4,299")).toBeInTheDocument();
      expect(screen.getByText("Book Now")).toBeInTheDocument();
    });
  });

  describe("Badge", () => {
    it("renders with distinct variants", () => {
      const { rerender } = render(<Badge variant="default">Primary</Badge>);
      expect(screen.getByText("Primary")).toBeInTheDocument();

      rerender(<Badge variant="accent">Best Value</Badge>);
      expect(screen.getByText("Best Value")).toBeInTheDocument();

      rerender(<Badge variant="success">Non-Stop</Badge>);
      expect(screen.getByText("Non-Stop")).toBeInTheDocument();
    });
  });
});
