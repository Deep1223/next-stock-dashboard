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
      },
      {
        source: '/stockmaster',
        destination: '/view/stockmaster',
      },
      {
        source: '/stockhistory',
        destination: '/view/stockhistory',
      },
    ];
  },
};

export default nextConfig;
