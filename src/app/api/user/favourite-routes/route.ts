import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { getFavouriteRoutes, createFavouriteRoute, deleteFavouriteRoute } from "@/lib/db";

const createRouteSchema = z.object({
  fromIata: z.string().length(3),
  toIata: z.string().length(3),
  fromCity: z.string().min(1),
  toCity: z.string().min(1),
});

export async function GET() {
  const session = await auth();
  const userId = session?.user?.id || "usr-demo-1";

  const list = await getFavouriteRoutes(userId);
  return NextResponse.json({ success: true, count: list.length, routes: list });
}

export async function POST(request: NextRequest) {
  const session = await auth();
  const userId = session?.user?.id || "usr-demo-1";

  try {
    const json = await request.json();
    const parsed = createRouteSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { error: { code: "VALIDATION_ERROR", details: parsed.error.flatten() } },
        { status: 400 }
      );
    }

    const created = await createFavouriteRoute({
      ...parsed.data,
      userId,
    });

    return NextResponse.json({ success: true, route: created }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: String(error) } },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const session = await auth();
  const userId = session?.user?.id || "usr-demo-1";

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: { code: "MISSING_ID", message: "ID parameter required" } },
        { status: 400 }
      );
    }

    const deleted = await deleteFavouriteRoute(id, userId);
    return NextResponse.json({ success: deleted });
  } catch (error) {
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: String(error) } },
      { status: 500 }
    );
  }
}
