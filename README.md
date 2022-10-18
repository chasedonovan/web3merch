This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Create APP (inital setup)

1. yarn create next-app --typescript

2. create src folder

3. move public and styles to src

4. add to tsconfig.json compileroptions (easier import from root)

"baseUrl": "./src",
"paths": { "@public/_": ["../public/_"] }

5. Add folders to src: components, services and utils

6. Add to next.config.js

/\*_ @type {import('next').NextConfig} _/
const nextConfig = {
reactStrictMode: true,
webpack: function (config, options) {
config.experiments = {
...config.experiments,
asyncWebAssembly: true,
syncWebAssembly: true,
};
return config;
},
}
module.exports = nextConfig

7. Run in terminal:

yarn add @dcspark/cardano-multiplatform-lib-browser
yarn add @emurgo/cardano-serialization-lib-browser

8. Add tailwind

yarn add -D tailwindcss postcss autoprefixer

9. Add tailwind config

yarn tailwindcss init -p

10. Setup tailwind.config.js:

/** @type {import('tailwindcss').Config} \*/
module.exports = {
content: [
"./pages/**/_.{js,ts,jsx,tsx}",
"./components/\*\*/_.{js,ts,jsx,tsx}",
],
theme: {
extend: {},
},
plugins: [],
}

11. Setup tailwind in styles/globals.css:

import 'tailwindcss/tailwind.css';

12. Add postcss-cli:

yarn addyarn postcss postcss-cli
