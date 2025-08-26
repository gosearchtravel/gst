/** @format */

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	const post = await prisma.blogPost.findUnique({ where: { id: Number(id) } });
	return NextResponse.json(post);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	const data = await req.json();
	const post = await prisma.blogPost.update({ where: { id: Number(id) }, data });
	return NextResponse.json(post);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	await prisma.blogPost.delete({ where: { id: Number(id) } });
	return NextResponse.json({ success: true });
}
