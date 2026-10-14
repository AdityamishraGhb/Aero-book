import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import RoutesIndexPage from "@/app/routes/page";
import RouteLandingPage, {
  generateMetadata,
  generateStaticParams,
} from "@/app/routes/[route]/page";

describe("Route Landing Pages", () => {
  it("renders the routes index page with all 20 Indian corridors", () => {
    render(<RoutesIndexPage />);

    expect(
      screen.getByRole("heading", { name: /Top Domestic Flight Routes in India/i })
    ).toBeInTheDocument();

    // Verify presence of major routes in directory
    expect(screen.getByText(/New Delhi to Mumbai/i)).toBeInTheDocument();
    expect(screen.getByText(/Mumbai to Bengaluru/i)).toBeInTheDocument();
    expect(screen.getByText(/Bengaluru to Hyderabad/i)).toBeInTheDocument();
  });

  it("generateStaticParams returns 20 route slugs", () => {
    const params = generateStaticParams();
    expect(params.length).toBe(20);
    expect(params.some((p) => p.route === "del-bom")).toBe(true);
    expect(params.some((p) => p.route === "bom-del")).toBe(true);
  });

  it("generates correct SEO metadata for a route", async () => {
    const meta = await generateMetadata({
      params: Promise.resolve({ route: "del-bom" }),
    });

    expect(meta.title).toContain("New Delhi to Mumbai");
    expect(meta.title).toContain("DEL to BOM");
    expect(meta.description).toContain("New Delhi");
  });

  it("renders individual route landing page with details and CTA", async () => {
    const jsx = await RouteLandingPage({
      params: Promise.resolve({ route: "del-bom" }),
    });

    render(jsx);

    expect(
      screen.getByRole("heading", { name: /Flights from New Delhi to Mumbai/i })
    ).toBeInTheDocument();

    expect(screen.getByText("2h 15m")).toBeInTheDocument();
    expect(screen.getByText("1148 km")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /search live flights/i })).toBeInTheDocument();
  });
});
