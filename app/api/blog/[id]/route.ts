/** @format */

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: Request, { params }: { params: { id: string } }) {
	const post = await prisma.blogPost.findUnique({ where: { id: Number(params.id) } });
	return NextResponse.json(post);
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
	const data = await req.json();
	const post = await prisma.blogPost.update({ where: { id: Number(params.id) }, data });
	return NextResponse.json(post);
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
	await prisma.blogPost.delete({ where: { id: Number(params.id) } });
	return NextResponse.json({ success: true });
}
