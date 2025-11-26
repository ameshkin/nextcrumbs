Feature: Breadcrumb JSON-LD
  As a consumer of the nextcrumbs library
  I want to generate valid JSON-LD for breadcrumb trails
  So that search engines can understand my site structure

  Scenario: Simple breadcrumb trail
    Given I have the following breadcrumbs:
      | name     | href       |
      | Home     | /          |
      | Products | /products  |
    When I convert the breadcrumbs to JSON-LD
    Then the JSON-LD should contain 2 items
