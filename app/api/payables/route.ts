import { prisma } from "@/lib/prisma";import { NextResponse } from "next/server";
export async function GET(){return NextResponse.json(await prisma.accountPayable.findMany({include:{category:true,attachments:true},orderBy:{dueDate:"asc"}}))}
export async function POST(req:Request){const b=await req.json();const item=await prisma.accountPayable.create({data:{description:b.description,supplier:b.supplier||null,amount:Number(b.amount),dueDate:new Date(b.dueDate),categoryId:b.categoryId,notes:b.notes||null}});return NextResponse.json(item,{status:201})}
