import assert from "node:assert";
import { Given, When, Then } from "@cucumber/cucumber";
import { toJsonLd } from "../../../public/utils/jsonld.js";

/** @type {{ name: string, href?: string }[]} */
let crumbs = [];
/** @type {any} */
let jsonLd;

Given("I have the following breadcrumbs:", function (dataTable) {
  crumbs = dataTable.hashes().map((row) => ({
    name: row.name,
    href: row.href || undefined,
  }));
});

When("I convert the breadcrumbs to JSON-LD", function () {
  jsonLd = toJsonLd(crumbs, { origin: "https://example.com" });
});

Then("the JSON-LD should contain {int} items", function (count) {
  assert.ok(jsonLd && Array.isArray(jsonLd.itemListElement));
  assert.strictEqual(jsonLd.itemListElement.length, count);
});
