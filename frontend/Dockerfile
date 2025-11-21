# --- Stage 1: Build the React App ---
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application source code
COPY . .

# Build the static files
RUN npm run build

# --- Stage 2: Serve with Nginx ---
FROM nginx:stable-alpine

# Copy the built static files from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy our custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
