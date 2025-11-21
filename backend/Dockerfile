# Stage 1: Use a standard Node.js image
FROM node:18-alpine

# Install build dependencies for native modules like sqlite3
RUN apk add --no-cache build-base python3

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to leverage Docker cache
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 3001

# Command to run the application
CMD ["node", "server.js"]
