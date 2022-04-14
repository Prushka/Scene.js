# https://dev.to/karanpratapsingh/dockerize-your-react-app-4j2e
FROM node:17-alpine3.14 AS build
ENV NODE_ENV production
# Add a work directory

WORKDIR /app
COPY . ./
WORKDIR /app/docs
ENV PATH /app/node_modules/.bin:$PATH
RUN yarn install --frozen-lockfile
RUN npm run build

# Bundle static assets with nginx
FROM nginx:1.21.6-alpine as production
ENV NODE_ENV production
# Copy built assets from builder
COPY --from=build /app/docs/build /usr/share/nginx/html
# Add your nginx.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Expose port
EXPOSE 80
# Start nginx
CMD ["nginx", "-g", "daemon off;"]