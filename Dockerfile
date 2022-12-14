# ==== CONFIGURE =====
# Use a Node 18 base image
FROM node:18-alpine 
# Set the working directory to /app inside the container
WORKDIR /app

RUN export REACT_APP_API_GATEWAY=$REACT_APP_API_GATEWAY
# Copy app files
COPY . .
RUN echo "export let url = "\'$REACT_APP_API_GATEWAY\'";" > vars.js
# ==== BUILD =====
# Install dependencies (npm ci makes sure the exact versions in the lockfile gets installed)
RUN npm ci 
# Build the app
RUN npm run build
# ==== RUN =======
# Set the env to "production"
ENV NODE_ENV production
EXPOSE 80