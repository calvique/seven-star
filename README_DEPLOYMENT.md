# Seven Star deployment

Backend build command on Render: `npm ci --include=dev && npm run build`. This is intentional because TypeScript and the `@types/*` compiler packages are development dependencies required during the build even when `NODE_ENV=production` is set for the running service.
