import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function GET() {
  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, active: true, createdAt: true },
    orderBy: { name: "asc" }
  });
  return NextResponse.json(users);
}

export async function POST(req: Request) {
  const b = await req.json();
  const passwordHash = await bcrypt.hash(b.password, 12);
  const user = await prisma.user.create({
    data: {
      name: b.name,
      email: b.email,
      passwordHash,
      role: b.role,
      active: true
    },
    select: { id: true, name: true, email: true, role: true, active: true }
  });
  return NextResponse.json(user, { status: 201 });
}
