FROM node:20-alpine AS build
ENV NODE_ENV=development
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:20-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build /app/dist ./dist
RUN apk add --no-cache curl \
    && npm install -g serve@14.2.1
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
