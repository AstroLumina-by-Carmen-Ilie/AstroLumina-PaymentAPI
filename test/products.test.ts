// Unit tests for the product catalog: all six products listed, every price
// ID wired from env, and unknown keys resolving to undefined.
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import "./setup-env.js";
import {
  getAvailableProducts,
  getProduct,
} from "../src/types/products.js";

const EXPECTED_PRODUCTS = [
  "soarele-stralucirea-ta",
  "ghid-saturn-in-berbec",
  "astrograma-natala-si-karmica",
  "astrograma-relationala",
  "astrograma-previzionala",
  "eveniment-constelatii",
];

describe("getAvailableProducts", () => {
  it("lists exactly the six known products", () => {
    assert.deepEqual(getAvailableProducts().sort(), [...EXPECTED_PRODUCTS].sort());
  });
});

describe("getProduct", () => {
  it("returns name, priceId and description for every product", () => {
    for (const key of EXPECTED_PRODUCTS) {
      const product = getProduct(key);
      assert.ok(product, `missing product ${key}`);
      assert.ok(product.name.length > 0);
      assert.ok(product.priceId.startsWith("price_"));
      assert.ok(product.description.length > 0);
    }
  });

  it("wires the natal-karmic price ID from env", () => {
    assert.equal(
      getProduct("astrograma-natala-si-karmica")?.priceId,
      "price_test_natal_karmic",
    );
  });

  it("returns undefined for an unknown product key", () => {
    assert.equal(getProduct("no-such-product"), undefined);
  });
});
