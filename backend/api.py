#!.venv/bin/python

"""API Service"""

from calendar import day_name as days
from dataclasses import dataclass
from html import escape
from os import environ, getenv, makedirs, path
from tomllib import load

from fastapi import FastAPI
from peewee import AutoField, CharField, IntegerField, Model, SqliteDatabase
from pydantic import BaseModel
from uvicorn import run

DB_PATH = "./db/"
DB_FILE = "planrr.db"

DEBUG = False


class MealDTO(BaseModel):
    """Menu data model"""

    id: int | None = None
    day: int
    title: str
    description: str | None = None


class Menu(Model):
    """Planrr DB model"""

    id = AutoField()
    day = IntegerField(unique=True)
    title = CharField()
    description = CharField(null=True)

    @dataclass
    class Meta:
        """Metadata"""

        database = SqliteDatabase(DB_PATH + DB_FILE, pragmas={"journal_mode": "wal"})


if not path.exists(DB_PATH):
    if DEBUG:
        print(f"Creating path: {DB_PATH}")
    makedirs(DB_PATH)

if not path.exists(DB_PATH + DB_FILE):
    if DEBUG:
        print(f"Creating database: {DB_FILE}")
    Menu.create_table()

api = FastAPI()


@api.get("/api/version")
def get_version() -> str | None:
    """Returns version"""
    try:
        version = getenv("BACKEND_VERSION")
        if not version:
            with open(file="pyproject.toml", mode="rb") as pyproject:
                version = load(pyproject)["project"]["version"]
                environ["BACKEND_VERSION"] = version
        return escape(str(version))
    except Exception as e:  # pylint: disable=broad-exception-caught
        print(e)
        return None


@api.get("/api/get", response_model=list[MealDTO])
def get() -> list[MealDTO] | None:
    """Get all menus"""
    try:
        if DEBUG:
            print(f"Getting rows: {Menu.select().count(None)}")
        return list(Menu.select().order_by(Menu.day.asc()).dicts())
    except Exception as e:  # pylint: disable=broad-exception-caught
        print(e)
        return None


@api.get("/api/get/{pk}", response_model=MealDTO | None)
def get_one(pk: int) -> MealDTO | None:
    """Get menu by ID"""
    try:
        if DEBUG:
            print(f"Getting row id: {pk}")
        return Menu.get_by_id(pk) or None
    except Exception as e:  # pylint: disable=broad-exception-caught
        print(e)
        return None


@api.post("/api/add", response_model=MealDTO | None)
def add(menu: MealDTO) -> MealDTO | None:
    """Add menu"""
    try:
        if DEBUG:
            print(
                f"Adding row: {list(days)[menu.day]}, {menu.title}, {menu.description}"
            )
        return (
            Menu.create(day=menu.day, title=menu.title, description=menu.description)
            or None
        )
    except Exception as e:  # pylint: disable=broad-exception-caught
        print(e)
        return None


@api.put("/api/update/{pk}", response_model=MealDTO | None)
def update(pk: int, menu: MealDTO) -> MealDTO | None:
    """Update menu by ID"""
    try:
        if DEBUG:
            print(f"Updating row id: {pk}")
        return (
            get_one(pk)
            if Menu.update(day=menu.day, title=menu.title, description=menu.description)
            .where(Menu.id == pk)
            .execute()
            > 0
            else None
        )
    except Exception as e:  # pylint: disable=broad-exception-caught
        print(e)
        return None


@api.delete("/api/delete/{pk}")
def delete(pk: int) -> bool:
    """Delete menu by ID"""
    try:
        if DEBUG:
            print(f"Deleting row: {pk}")
        menu = Menu.get(Menu.id == pk)
        menu.delete_instance()
        return True
    except Exception as e:  # pylint: disable=broad-exception-caught
        print(e)
        return False


if __name__ == "__main__":
    run(app="api:api", host="0.0.0.0", port=5557, reload=True)
