import { NextResponse } from "next/server";
import { getUserByEmail, createUser } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { firstName, lastName, phone, email, password } = body;

    if (!firstName || !firstName.trim()) {
      return NextResponse.json(
        { error: "First name is required." },
        { status: 400 }
      );
    }

    if (!lastName || !lastName.trim()) {
      return NextResponse.json(
        { error: "Surname (last name) is required." },
        { status: 400 }
      );
    }

    if (!phone || !phone.trim()) {
      return NextResponse.json(
        { error: "Phone number is required." },
        { status: 400 }
      );
    }

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "A valid email address is required." },
        { status: 400 }
      );
    }

    if (!password || password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    const fullName = `${firstName.trim()} ${lastName.trim()}`;

    // Check if user already exists
    const existing = await getUserByEmail(cleanEmail);
    if (existing) {
      // If user exists, we can return informative error or allow update
      return NextResponse.json(
        { error: "An account with this email already exists. Please sign in instead." },
        { status: 409 }
      );
    }

    const newUser = await createUser({
      email: cleanEmail,
      name: fullName,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone: phone.trim(),
      password,
      image: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(fullName)}`,
    });

    return NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        name: newUser.name,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        phone: newUser.phone,
        email: newUser.email,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to register user";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
