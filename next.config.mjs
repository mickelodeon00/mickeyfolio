/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },

  images: {
    unoptimized: true,
  },

  // transpilePackages: [
  //   "@tiptap/core",
  //   "@tiptap/react",
  //   "@tiptap/extension-text-style",
  //   "@tiptap/extension-color",
  //   "@tiptap/extension-text-align",
  // ],

  transpilePackages: [
    "prismjs",
    "@tiptap/core",
    "@tiptap/pm",
    "@tiptap/react",
    "@tiptap/starter-kit",
    "@tiptap/extension-text-style",
    "@tiptap/extension-color",
    "@tiptap/extension-image",
    "@tiptap/extension-text-align",
    "@tiptap/extension-highlight",
    "@tiptap/extension-placeholder",
    "@tiptap/extension-code-block-lowlight",
  ],
};

export default nextConfig;

// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   eslint: {
//     ignoreDuringBuilds: true,
//   },
//   typescript: {
//     ignoreBuildErrors: true,
//   },
//   images: {
//     unoptimized: true,
//   },
//   webpack: (config, { isServer }) => {
//     // Handle prismjs properly
//     if (!isServer) {
//       config.resolve.fallback = {
//         ...config.resolve.fallback,
//         fs: false,
//         path: false,
//         crypto: false,
//       };
//     }

//     return config;
//   },
//   transpilePackages: ["prismjs"],
// };

// export default nextConfig;
