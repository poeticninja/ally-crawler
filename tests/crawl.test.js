const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const { test, expect } = require("@playwright/test");

test.describe.configure({ mode: "serial" });

test.describe("run the shell command to crawl each page", () => {
  let resultsUrls;
  let resultsAlly;

  test.beforeAll(async () => {
    // shell command to crawl the url
    const runCrawler = `node ${path.join(
      __dirname,
      "../src/crawl.js"
    )} --url http://localhost:3151 -o tests/results`;

    // run the shell command
    execSync(runCrawler);

    // load the results from the json file after the crawl is complete
    resultsUrls = JSON.parse(
      fs.readFileSync(
        path.join(__dirname, "./results/dataset-urls.json"),
        "utf8"
      )
    );
    // load the results from the json file after the crawl is complete
    resultsAlly = JSON.parse(
      fs.readFileSync(
        path.join(__dirname, "./results/dataset-ally.json"),
        "utf8"
      )
    );
  });

  test("should create the urls dataset", () => {
    expect(resultsUrls).toBeTruthy();
  });

  test("should create the ally dataset", () => {
    expect(resultsAlly).toBeTruthy();
  });

  test("url data should return 4 results with correct urls", () => {
    // expect the results to equal 4 because there are 4 pages on the site
    expect(resultsUrls.length).toBe(4);

    // expect the reults objects to have a url property
    expect(resultsUrls[0]).toHaveProperty("url");
    // expect the results array to all be unique based on url property
    expect(resultsUrls).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ url: "http://localhost:3151/" }),
      ])
    );
    expect(resultsUrls).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ url: "http://localhost:3151/about" }),
      ])
    );
    expect(resultsUrls).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ url: "http://localhost:3151/contact" }),
      ])
    );
    expect(resultsUrls).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ url: "http://localhost:3151/blog" }),
      ])
    );
  });

  test("ally data should return 18 results with correct urls", () => {
    // expect the results to equal 4 because there are 4 pages on the site
    expect(resultsAlly.length).toBe(18);

    // expect the reults objects to have a url property
    expect(resultsAlly[0]).toHaveProperty("url");
    // expect the results array to all be unique based on url property
    expect(resultsAlly).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ url: "http://localhost:3151/" }),
      ])
    );
    expect(resultsAlly).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ url: "http://localhost:3151/about" }),
      ])
    );
    expect(resultsAlly).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ url: "http://localhost:3151/contact" }),
      ])
    );
    expect(resultsAlly).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ url: "http://localhost:3151/blog" }),
      ])
    );
  });

  test("ally data should have 18 total violations", () => {
    // expect the results to equal 18 because there are 18 violations on the site
    expect(resultsAlly.length).toBe(18);
  });

  test("ally data should have 6 image alt tag missing issues", () => {
    // expect the results to equal 6 because there are 6 image alt tag missing issues on the site
    const imageAltTagMissing = resultsAlly.filter(
      (violation) => violation.violationId === "image-alt"
    );

    expect(imageAltTagMissing.length).toBe(6);
  });

  test("ally data should have 4 inputs missing labels missing issues", () => {
    // expect the results to equal 4 because there are 4 inputs missing labels missing issues on the site
    const inputsMissingLabels = resultsAlly.filter(
      (violation) => violation.violationId === "label"
    );

    expect(inputsMissingLabels.length).toBe(4);
  });

  test("ally data should have 8 contrast issues", () => {
    // expect the results to equal 8 because there are 8 contrast issues on the site
    const contrastIssues = resultsAlly.filter(
      (violation) => violation.violationId === "color-contrast"
    );

    expect(contrastIssues.length).toBe(8);
  });
});
