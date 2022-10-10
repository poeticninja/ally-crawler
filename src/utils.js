const AxeBuilder = require("@axe-core/playwright").default;
const URL = require("url");

// this cleans the url by removing the query string and hash
const cleanUrl = (url) => {
  const urlObject = URL.parse(url);
  return urlObject.protocol + "//" + urlObject.host + urlObject.pathname;
};

// acceesbility scanner using axe-core
const scanAllyOnPage = async ({ page }) => {
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();

  return {
    url: results.url,
    violations: results.violations,
  };
};

module.exports = {
  cleanUrl,
  scanAllyOnPage,
};
