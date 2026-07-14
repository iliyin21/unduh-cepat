FROM node:22-bookworm

RUN apt-get update && \
    apt-get install -y python3 python3-pip python3-venv ffmpeg && \
    python3 -m venv /opt/venv && \
    /opt/venv/bin/pip install --upgrade pip && \
    /opt/venv/bin/pip install yt-dlp

ENV PATH="/opt/venv/bin:$PATH"

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

EXPOSE 8080

CMD ["npm", "start"]
