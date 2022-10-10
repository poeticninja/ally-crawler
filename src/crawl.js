const { PlaywrightCrawler, Dataset, sleep } = require("crawlee");
const cli = require("commander");
const fs = require("fs");
const path = require("path");

const { cleanUrl, scanAllyOnPage } = require("./utils");

// setup cli options and documentation
cli
  .name("crawl")
  .description("a website crawler that collects urls and scans for a11y issues")
  .requiredOption("-u, --url [url...]", "one or more urls to crawl")
  .option(
    "-s,--sleep [milliseconds]",
    "Sets the time before a worker starts the next crawl. This is to help avoid being blocked.",
    "200"
  )
  .option(
    "-m,--max <number>",
    "Sets the max number of requests to crawl. This is useful for testing."
  )
  .option(
    "-o, --output-folder [folder]",
    "the folder to output the results",
    "results"
  )
  .option("--no-ally", "Disables the ally scan.")
  .option("--no-urls", "Disables the url scan.")
  .parse();

const cliOptions = cli.opts();

// setup the crawler settings
const datasetNameUrls = "dataset-urls";
const datasetNameAlly = "dataset-ally";
const sleepSetting = cliOptions.sleep;
const outputFolder = cliOptions.outputFolder;
const urlsToCrawl = [].concat(cliOptions.url);
const outputFileNameUrls = `${datasetNameUrls}.json`;
const outputFileNameAlly = `${datasetNameAlly}.json`;

// setup output folder and file paths
const pathToOutputFolder = path.join(__dirname, "../", outputFolder);
const pathToOutputFileUrls = path.join(outputFolder, outputFileNameUrls);
const pathToOutputFileAlly = path.join(outputFolder, outputFileNameAlly);
const pathToStorageDataset = path.join(__dirname, "../storage");

// if no urls are provided then exit
if (!urlsToCrawl || urlsToCrawl.length === 0) {
  console.log("Please provide a url to crawl. Need help? run crawl --help");
  process.exit(1);
}

// if both no-ally and no-url scans are disabled, exit
if (cliOptions.ally === false && cliOptions.urls === false) {
  console.log("Please enable at least one scan. Need help? run crawl --help");
  process.exit(1);
}

const init = async () => {
  // reset the crawler storage dataset.
  if (fs.existsSync(pathToStorageDataset)) {
    fs.rmSync(path.join(pathToStorageDataset), { recursive: true });
  }
  // reset the output folder.
  if (fs.existsSync(pathToOutputFolder)) {
    fs.rmSync(pathToOutputFolder, { recursive: true });
  }

  // setup the crawler
  const crawler = new PlaywrightCrawler({
    maxRequestsPerCrawl: cliOptions.max && parseInt(cliOptions.max), // set the max if you don't want to crawl a whole site. very useful for testing.
    async requestHandler({ request, page, enqueueLinks, log }) {
      const currentCleanUrl = cleanUrl(request.loadedUrl);
      // log the current url in process
      log.info(currentCleanUrl);

      // if the urls scan is enabled. default is true
      if (cliOptions.urls !== false) {
        // collect all of the urls on the page
        const datasetUrls = await Dataset.open(datasetNameUrls);
        const pageUrl = { url: request.loadedUrl };
        console.log(request.loadedUrl);
        await datasetUrls.pushData(pageUrl);
      }

      // if the ally scan is enabled. default is true
      if (cliOptions.ally !== false) {
        // scan the page for a11y issues
        const datasetAlly = await Dataset.open(datasetNameAlly);
        const allyFromPage = await scanAllyOnPage({ page });
        await datasetAlly.pushData(allyFromPage);
      }

      // sleep to help avoid being blocked
      await sleep(sleepSetting);
      // Add all links from page to RequestQueue
      await enqueueLinks({
        strategy: "same-domain", // only enqueue links on the same domain. the option 'same-hostname' is also available
        transformRequestFunction: (request) => {
          // the initial urls provided to the crawler are not cleaned. so we need to clean them here.
          // example: https://bestcolleges.com/ and https://bestcolleges.com/#main are both added to the queue if not filtered out with if statement
          if (urlsToCrawl.map(cleanUrl).includes(cleanUrl(request.url))) {
            return;
          }
          // transform the request before it is enqueued
          // here we are cleaning the url so that way we don't have duplicates
          request.uniqueKey = cleanUrl(request.url).toLowerCase();
          request.url = cleanUrl(request.url).toLowerCase();
          return request;
        },
      });
    },
  });

  // Run the crawler with initial request
  await crawler.run(urlsToCrawl);

  // create the results folder if it does not exist
  if (!fs.existsSync(pathToOutputFolder)) {
    fs.mkdirSync(pathToOutputFolder);
  }

  const datasetUrls = await Dataset.open(datasetNameUrls);
  const datasetAlly = await Dataset.open(datasetNameAlly);
  const urlsData = await datasetUrls.getData();
  const allyData = await datasetAlly.getData();

  // if the urls scan is enabled. default is true
  if (cliOptions.urls !== false) {
    // write the urls to a file
    fs.writeFileSync(
      pathToOutputFileUrls,
      JSON.stringify(urlsData?.items, null, 2)
    );
  }
  // if the ally scan is enabled. default is true
  if (cliOptions.ally !== false) {
    // write the ally to a file
    fs.writeFileSync(
      pathToOutputFileAlly,
      JSON.stringify(allyData?.items, null, 2)
    );
  }
};

init();
