#!/usr/bin/env -S docker build . --tag=planrr-backend --file

FROM ghcr.io/astral-sh/uv:python3.14-alpine AS build

WORKDIR /backend

ENV UV_LINK_MODE=copy
ENV UV_NO_DEV=1
ENV UV_PYTHON_DOWNLOADS=0

COPY pyproject.toml uv.lock *.py healthcheck.sh /backend/
RUN --mount=type=cache,target=/root/.cache/uv \
    --mount=type=bind,source=uv.lock,target=uv.lock \
    --mount=type=bind,source=pyproject.toml,target=pyproject.toml \
    uv sync --no-install-project

RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync --frozen

RUN rm uv.lock

# -=-

FROM python:3.14-alpine

WORKDIR /backend

COPY --from=build /backend .

RUN mkdir ./db

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PATH="/backend/.venv/bin:$PATH"

HEALTHCHECK --interval=60s --start-interval=5s CMD source /backend/healthcheck.sh

EXPOSE 5557

CMD ["fastapi", "run", "/backend/api.py", "--port", "5557"]
