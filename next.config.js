/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["lh3.googleusercontent.com", "res.cloudinary.com"],
    //REMOVE THIS, only to suppress errors on proxy for profile image
    disableStaticImages: true,
  },
  //really not sure if this is needed
  experimental: {
    serverComponentsExternalPackages: ["cloudinary", "graphql-request"],
  },
};

module.exports = nextConfig;
