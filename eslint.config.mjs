/** @format */

import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
	baseDirectory: __dirname,
});

const eslintConfig = [
	...compat.extends('next/core-web-vitals', 'next/typescript'),
	{
		rules: {
			// Allow unescaped entities in JSX - we'll handle this manually
			'react/no-unescaped-entities': ['error', { forbid: ['>', '}'] }],
			// Allow any type when necessary for external APIs
			'@typescript-eslint/no-explicit-any': 'warn',
		},
	},
];

export default eslintConfig;
