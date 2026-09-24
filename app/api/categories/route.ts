import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
export async function GET(){return NextResponse.json(await prisma.category.findMany({orderBy:{name:"asc"}}))}
export async function POST(req:Request){const body=await req.json();const item=await prisma.category.create({data:{name:body.name,type:body.type}});return NextResponse.json(item,{status:201})}
