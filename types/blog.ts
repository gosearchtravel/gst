/** @format */

// Shared TypeScript interfaces for the blog system

export interface BlogPost {
	id: number;
	city: string;
	image: string;
	excerpt: string;
	content: string;
	createdAt: string;
	updatedAt: string;
}

export interface BlogPostCreateInput {
	city: string;
	image: string;
	excerpt: string;
	content: string;
}

export interface BlogPostUpdateInput {
	city?: string;
	image?: string;
	excerpt?: string;
	content?: string;
}
