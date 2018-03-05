FROM node:8.2.1

ENV NODE_ENV=production
ENV HOST 0.0.0.0
ENV GOOGLE_APPLICATION_CREDENTIALS=server/gcp_credentials.json
ENV BASE_URL=https://prizm-196904.appspot.com

RUN mkdir -p /app
COPY . /app
WORKDIR /app
# Expose the app port
EXPOSE 8080

RUN npm install
RUN npm run build
CMD ["npm", "start"]