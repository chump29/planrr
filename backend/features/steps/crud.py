#!.venv/bin/python

# pylint: disable=missing-function-docstring, function-redefined, not-callable
# pyright: reportRedeclaration=false
# ruff: noqa: D103, F811

"""CRUD tests"""

from typing import TYPE_CHECKING

from api import get, get_one, update  # pylint: disable=import-error
from behave import given, then, when

if TYPE_CHECKING:
    from behave.runner import Context
else:
    Context = object


@given("that a user wants a meal by ID")
def step_impl(_: Context) -> None:
    pass


@when("/get_one API endpoint is called with an ID")
def step_impl(context: Context) -> None:
    context.meal = get_one(context.meal.id)
    assert not context.failed, "/get_one call failed"


@then("meal data is returned")
def step_impl(context: Context) -> None:
    assert context.meal, "Invalid query results"


@given("that a user wants to update a meal")
def step_impl(_: Context) -> None:
    pass


@when("/update API endpoint is called with an ID")
def step_impl(context: Context) -> None:
    context.meal.description = "TESTME2"
    context.meal = update(pk=context.meal.id, meal=context.meal)
    assert not context.failed, "/update call failed"


@then("meal data is updated")
def step_impl(context: Context) -> None:
    assert context.meal.description == "TESTME2", "Could not update description"


@given("that a user wants their meal data")
def step_impl(_: Context) -> None:
    pass


@when("/get API endpoint is called")
def step_impl(context: Context) -> None:
    context.meals = get()
    assert not context.failed, "/get call failed"


@then("all meals are returned")
def step_impl(context: Context) -> None:
    assert context.meals, "Invalid query results"
