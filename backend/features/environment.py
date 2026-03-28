#!.venv/bin/python

# pylint: disable=missing-function-docstring
# ruff: noqa: D103

"""Environment setup"""

from typing import TYPE_CHECKING

from api import add, delete, MealDTO, Menu  # pylint: disable=import-error

if TYPE_CHECKING:
    from behave.model import Feature
    from behave.runner import Context
else:
    Feature = object
    Context = object


def before_feature(context: Context, feature: Feature) -> None:
    if "crud" not in feature.tags:
        return
    for menu in (
        Menu.select().where(Menu.title == "TESTME").iterator()
    ):  # * clean up old data
        delete(menu.id)
    context.meal = add(MealDTO(day=-1, title="TESTME", description="TESTME"))
    assert context.meal, "Could not add meal data"


def after_feature(context: Context, feature: Feature) -> None:
    if "crud" not in feature.tags:
        return
    if not context.meal:
        return
    assert delete(context.meal.id), "Could not delete meal data"
