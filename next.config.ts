/** @format */

import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	experimental: {
		serverComponentsExternalPackages: ['@prisma/client'],
	},
	/* config options here */
};

export default nextConfig;
