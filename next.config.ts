/** @format */

import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	experimental: {
		serverComponentsExternalPackages: ['@prisma/client'],
	},
	webpack: (config, { isServer }) => {
		if (isServer) {
			config.externals.push('@prisma/client');
		}
		return config;
	},
	/* config options here */
};

export default nextConfig;
