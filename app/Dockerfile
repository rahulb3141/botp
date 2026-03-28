# Use official Node.js runtime image (Alpine = lightweight)
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files first to leverage Docker cache
COPY app/package*.json ./

# Install only production dependencies
RUN npm install --production

# Copy the entire application source
COPY app .

# Expose application port
EXPOSE 3000

# Start Node app
CMD ["node", "src/index.js"]
