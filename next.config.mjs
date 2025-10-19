/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/category',
        destination: '/view/category',
      },
      {
        source: '/researchstudy',
        destination: '/view/researchstudy',
      },
      {
        source: '/researchtype',
        destination: '/view/researchtype',
      }
    ];
  },
};

export default nextConfig;
