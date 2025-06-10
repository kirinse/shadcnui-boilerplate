FROM node:23-slim AS builder
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app
COPY . /app

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install
RUN pnpm run build

RUN apt-get update && apt-get install -y ca-certificates curl --no-install-recommends

# RUN curl -L -o /app/dist/WeChatSetup-3.9.11.25.exe https://github.com/astxng/wcf-client-rust/releases/download/v39.3.3-8/WeChatSetup-3.9.11.25.exe

# RUN curl -L -o /app/dist/WCApp_v39.3.3-8_windows_x64.zip https://github.com/astxng/wcf-client-rust/releases/download/v39.3.3-8/WCApp_v39.3.3-8_windows_x64.zip

FROM nginx:alpine

COPY docker/templates /etc/nginx/templates
# RUN sed -i "s#_API_URL_#${API_URL}#g" /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /app/dist
# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]
