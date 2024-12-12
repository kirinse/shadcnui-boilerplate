FROM node:20-slim AS builder
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app
COPY . /app

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install
RUN pnpm run build

FROM nginx:alpine
ARG API_URL

COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
RUN sed -i "s#_API_URL_#${API_URL}#g" /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /app/dist
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
