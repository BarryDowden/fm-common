"use strict";

const expect = require("chai").expect;
const logger = require("../lib/logger");

describe("logger", () => {

  it("should be an object reference", () => {
    expect(logger).to.be.an('object');
  });

  it("should expose an info function", () => {
    expect(logger).itself.to.respondTo('info');
  });

  it("should expose an fatal function", () => {
    expect(logger).itself.to.respondTo('fatal');
  });

  it("should expose a warn function", () => {
    expect(logger).itself.to.respondTo('warn');
  });

  it("should expose an error function", () => {
    expect(logger).itself.to.respondTo('error');
  });

});