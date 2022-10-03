const withPreact = require('next-plugin-preact')

/** @type {import('next').NextConfig} */
const nextConfig = withPreact({
    poweredByHeader: false,
    reactStrictMode: true,
    swcMinify: true,
    webpack: (config, {dev, isServer}) => {
        if (!dev && !isServer) {
            // Replace React with Preact only in client production build
            Object.assign(config.resolve.alias, {
                react: 'preact/compat',
                'react-dom/test-utils': 'preact/test-utils',
                'react-dom': 'preact/compat',
            })
        }

        return config
    },
    images: {
        domains: ['assets.blamejared.com'],
    },
})

module.exports = nextConfig
