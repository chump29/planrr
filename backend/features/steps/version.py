#!.venv/bin/python

# pylint: disable=missing-function-docstring, function-redefined, not-callable
# pyright: reportRedeclaration=false
# ruff: noqa: D103, F811

"""Version tests"""

from pathlib import Path
from tomllib import load
from typing import TYPE_CHECKING, Final

from api import PORT, get_version  # pylint: disable=import-error
from behave import given, then, when
from box import Box

if TYPE_CHECKING:
    from functools import _CacheInfo

    from behave.runner import Context
else:
    Context = object
    _CacheInfo = object


@given("a request for the API version")
def step_impl(context: Context) -> None:
    with Path("pyproject.toml").open("rb") as pyproject:
        context.real_version = str(Box(load(pyproject)).project.version)


@when("/version API endpoint is called")
def step_impl(context: Context) -> None:
    context.version = get_version()
    assert context.failed is not True, "/version call failed"


@then("port {port} is used")
def step_impl(_: Context, port: str) -> None:
    assert int(port.replace('"', "")) == PORT, f"Invalid port: {port}"


@then("version is returned")
def step_impl(context: Context) -> None:
    assert context.real_version == context.version, "Invalid version"


@then("version is cached")
def step_impl(_: Context) -> None:
    get_version()
    cache: Final[_CacheInfo] = get_version.cache_info()
    assert cache.hits == 1 and cache.misses == 1, "Version not cached"  # noqa: PT018
