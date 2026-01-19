FROM node:20-bullseye

# Install LibreOffice (needed for libreoffice-convert -> soffice)
RUN apt-get update \
  && apt-get install -y --no-install-recommends libreoffice \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install dependencies first (better caching)
COPY package*.json ./
RUN npm install --omit=dev

# Copy rest of the backend
COPY . .

ENV NODE_ENV=production
ENV PORT=10000

EXPOSE 10000

# Your package.json start -> node src/index.js
CMD ["npm", "start"]
