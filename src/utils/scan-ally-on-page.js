const AxeBuilder = require("@axe-core/playwright").default;

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

module.exports = scanAllyOnPage;
