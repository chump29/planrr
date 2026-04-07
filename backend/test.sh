#!/usr/bin/env -S bash -e

export DB_FILE=planrr_test.db

uv run coverage run --module behave --stop
echo
uv run coverage report

