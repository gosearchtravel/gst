/** @format */

// Utility functions for handling text content in React components

/**
 * Escapes special characters for safe use in JSX
 * @param text - The text to escape
 * @returns The escaped text
 */
export function escapeForJSX(text: string): string {
	return text
		.replace(/'/g, '&apos;')
		.replace(/"/g, '&quot;')
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;');
}

/**
 * Safely renders text content that might contain apostrophes
 * Use this when you have dynamic content that might contain special characters
 * @param text - The text content
 * @returns JSX-safe text
 */
export function safeText(text: string): string {
	return text.replace(/'/g, '&apos;');
}

/**
 * For blog content that contains HTML, ensure apostrophes are properly escaped
 * @param htmlContent - HTML content string
 * @returns HTML with properly escaped entities
 */
export function safeBlogContent(htmlContent: string): string {
	// Only escape apostrophes in text content, not in HTML attributes
	return htmlContent.replace(/(?<=>)[^<]*(?=<)/g, (match) => match.replace(/'/g, '&apos;'));
}
