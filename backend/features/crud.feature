@crud
Feature: Get all meals

	Scenario: Get meal by ID
		Given that a user wants a meal by ID
			When /get_one API endpoint is called with an ID
			Then meal data is returned

	Scenario: Update meal
		Given that a user wants to update a meal
			When /update API endpoint is called with an ID
			Then meal data is updated

	Scenario: Get all meals
		Given that a user wants their meal data
			When /get API endpoint is called
			Then all meals are returned
