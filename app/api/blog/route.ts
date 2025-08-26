/** @format */

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
	const posts = await prisma.blogPost.findMany();
	return NextResponse.json(posts);
}

export async function POST(req: NextRequest) {
	try {
		const data = await req.json();
		// Only allow fields defined in the model
		const { city, image, excerpt, content } = data;
		if (!city || !image || !excerpt || !content) {
			return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
		}
		const post = await prisma.blogPost.create({ data: { city, image, excerpt, content } });
		return NextResponse.json(post);
	} catch (e) {
		const message = e instanceof Error ? e.message : 'Unknown error';
		return NextResponse.json({ error: message }, { status: 500 });
	}
}
