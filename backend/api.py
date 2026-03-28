#!.venv/bin/python

"""API Service"""

from calendar import day_name as days
from dataclasses import dataclass
from functools import cache
from pathlib import Path
from tomllib import load
from typing import Final

from box import Box
from dotenv import dotenv_values
from fastapi import FastAPI
from nh3 import clean  # pylint: disable=no-name-in-module
from peewee import (
    AutoField,
    CharField,
    IntegerField,
    IntegrityError,
    Model,
    SqliteDatabase,
)
from playhouse.shortcuts import model_to_dict
from pydantic import BaseModel, ConfigDict, Field, PositiveInt, StrictInt, StrictStr
from rich.console import Console
from rich.traceback import install as catch_exceptions
from semver import Version
from uvicorn import run

DEBUG: Final[bool] = False

DB_PATH: Final[str] = "./db/"
DB_FILE: Final[str] = "planrr.db"

console: Console = Console()
catch_exceptions()

if DEBUG:
    console.print("🔎 Debug mode ON")


class MealDTO(BaseModel):
    """Meal domain model"""

    id: PositiveInt | None = Field(strict=True, default=None)
    day: StrictInt = Field(ge=-1, le=6)
    title: StrictStr = Field(max_length=255)
    description: StrictStr | None = Field(max_length=255, default=None)

    model_config = ConfigDict(extra="forbid")


class Menu(Model):
    """Planrr database model"""

    id = AutoField()
    day = IntegerField(unique=True)
    title = CharField()
    description = CharField(null=True)

    @dataclass
    class Meta:
        """Metadata"""

        database: SqliteDatabase = SqliteDatabase(  # noqa: RUF009
            DB_PATH + DB_FILE, pragmas={"journal_mode": "wal"}
        )


def log(msg: str, info: str = "") -> None:
    """Log to console"""
    s: str = f"[bold green]{msg}[/bold green]"
    if not info:
        console.log(s)
    else:
        console.log(f"{s}: [cyan]{info}[/cyan]")


if not Path(DB_PATH).exists():
    if DEBUG:
        log("Creating path", DB_PATH)
    Path(DB_PATH).mkdir(parents=True)

if not Path(DB_PATH + DB_FILE).exists():
    if DEBUG:
        log("Creating database", DB_FILE)
    Menu.create_table()
elif DEBUG:
    log("Using database", DB_PATH + DB_FILE)

api: FastAPI = FastAPI(
    docs_url="/api/docs", openapi_url="/api/openapi.json", redoc_url="/api/redoc"
)


@cache
@api.get("/api/version")
def get_version() -> str | None:
    """Return version"""

    def invalid_version(version: str) -> None:
        """Invalid version"""
        msg: str = f"Invalid version: {version}"
        raise ValueError(msg)

    try:
        with Path("pyproject.toml").open("rb") as pyproject:
            version: str = str(Box(load(pyproject)).project.version).strip('"')
            if not Version.is_valid(version):
                invalid_version(version)
            if DEBUG:
                log("Got version:", version)
            return version
    except Exception:  # pylint: disable=broad-exception-caught
        console.print_exception()
        return None


@api.get("/api/get", response_model=list[MealDTO])
def get() -> list[MealDTO] | None:
    """Get all meals"""
    try:
        if DEBUG:
            log("Getting rows", str(Menu.select().count(None)))
        return list(Menu.select().order_by(Menu.day.asc()).dicts())
    except Exception:  # pylint: disable=broad-exception-caught
        console.print_exception()
        return None


@api.get("/api/get/{pk}", response_model=MealDTO | None)
def get_one(pk: int) -> MealDTO | None:
    """Get meal by ID"""
    try:
        if DEBUG:
            log("Getting row id", str(pk))
        return Menu.get_by_id(pk) or None
    except Exception:  # pylint: disable=broad-exception-caught
        console.print_exception()
        return None


def get_day(day: int) -> str:
    """Get day by number"""
    return list(days)[day]


def sanitize(meal: MealDTO) -> MealDTO | None:
    """Sanitize input"""
    meal.title = clean(meal.title, tags=set())
    meal.description = clean(meal.description, tags=set()) if meal.description else None
    return None if not meal.title else meal


@api.post("/api/add", response_model=MealDTO | None)
def add(meal: MealDTO) -> MealDTO | None:
    """Add meal"""
    m: MealDTO | None = sanitize(meal)
    if not m:
        return None
    m.title = m.title.replace("&amp;", "&")
    if m.description:
        m.description = m.description.replace("&amp;", "&")
    try:
        if DEBUG:
            log(
                "Adding row",
                f"day={get_day(m.day)}, title={m.title}, description={m.description}",
            )
        menu: Menu = Menu.create(day=m.day, title=m.title, description=m.description)
        return MealDTO.model_validate(model_to_dict(menu))
    except IntegrityError:
        if DEBUG:
            log("Row already exists with day", get_day(m.day))
        return None
    except Exception:  # pylint: disable=broad-exception-caught
        console.print_exception()
        return None


@api.put("/api/update/{pk}", response_model=MealDTO | None)
def update(pk: int, meal: MealDTO) -> MealDTO | None:
    """Update meal by ID"""
    m: MealDTO | None = sanitize(meal)
    if not m:
        return None
    m.title = m.title.replace("&amp;", "&")
    if m.description:
        m.description = m.description.replace("&amp;", "&")
    try:
        if DEBUG:
            log("Updating row id", str(pk))
        return (
            get_one(pk)
            if Menu.update(day=m.day, title=m.title, description=m.description)
            .where(Menu.id == pk)
            .execute()
            > 0
            else None
        )
    except Exception:  # pylint: disable=broad-exception-caught
        console.print_exception()
        return None


@api.delete("/api/delete/{pk}")
def delete(pk: int) -> bool:
    """Delete meal by ID"""
    try:
        if DEBUG:
            log("Deleting row", str(pk))
        meal: Menu = Menu.get(Menu.id == pk)
        if meal:
            meal.delete_instance()
    except Exception:  # pylint: disable=broad-exception-caught
        console.print_exception()
        return False
    return True


def validate_port(port: int) -> bool:
    """Validate port number"""
    port_min: int = 1024
    port_max: int = 65535
    return port_min <= port <= port_max


def invalid_port(port: int) -> None:
    """Invalid port"""
    msg: str = f"Invalid port: {port}"
    raise ValueError(msg)


try:
    PORT: Final[int] = int(Box(dotenv_values()).API_PORT)
    if not validate_port(PORT):
        invalid_port(PORT)
    elif DEBUG:
        log("Got port", str(PORT))
except Exception as e:  # pylint: disable=broad-exception-caught
    console.print_exception()
    raise SystemExit(1) from e

if __name__ == "__main__":
    console.print("✨ Running local server...")
    run(app="api:api", host="0.0.0.0", port=PORT, reload=True)  # noqa: S104
