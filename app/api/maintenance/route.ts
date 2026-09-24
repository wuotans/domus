import { prisma } from "@/lib/prisma";import { NextResponse } from "next/server";
export async function GET(){return NextResponse.json(await prisma.maintenance.findMany({orderBy:{scheduledAt:"asc"}}))}
export async function POST(req:Request){const b=await req.json();return NextResponse.json(await prisma.maintenance.create({data:{title:b.title,description:b.description||null,provider:b.provider||null,cost:b.cost?Number(b.cost):null,scheduledAt:new Date(b.scheduledAt),notes:b.notes||null}}),{status:201})}
