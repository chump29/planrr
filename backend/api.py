#!.venv/bin/python

"""API Service"""

from os import environ, getenv
from tomllib import load

from fastapi import FastAPI
from uvicorn import run


api = FastAPI()


@api.get("/api/version")
def get_version():
    """Returns version"""
    version = getenv("BACKEND_VERSION")
    if not version:
        with open(file="pyproject.toml", mode="rb") as pyproject:
            version = load(pyproject)["project"]["version"]
            environ["BACKEND_VERSION"] = version
    return version


if __name__ == "__main__":
    run(app="api:api", host="0.0.0.0", port=5557, reload=True)
