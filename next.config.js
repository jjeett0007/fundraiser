/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    domains: [
      "images.unsplash.com",
      "lh3.googleusercontent.com",
      "encrypted-tbn3.gstatic.com",
      "miro.medium.com",
      "res.cloudinary.com"
    ],
  },
};

// if (process.env.NEXT_PUBLIC_TEMPO) {
//   nextConfig["experimental"] = {
//     // NextJS 13.4.8 up to 14.1.3:
//     // swcPlugins: [[require.resolve("tempo-devtools/swc/0.86"), {}]],
//     // NextJS 14.1.3 to 14.2.11:
//     // swcPlugins: [[require.resolve("tempo-devtools/swc/0.90"), {}]],
//     // NextJS 15+:
//     swcPlugins: [[require.resolve("tempo-devtools/swc/1.0"), {}]],

//     // NextJS 15+ (Not yet supported, coming soon)
//   };
// }

module.exports = nextConfig;
