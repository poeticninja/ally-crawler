## Description

ally-crawler is a website crawler that will scan a website to find all the urls and accessibility issues.

### Install

Make sure you have the correct version of node installed based on the .nvmrc file or the engines section of the package.json file. After than you will need to install the dependencies with `npm install`.

### Run

To run the application use the following command. This will start the application and run the scan on the urls provided. The results will be output to the console and to the results folder as a JSON file.

```bash
node src/crawl --url https://yoursitehere.com
```

### Options

```bash
$ node src/crawl --help
Usage: crawl [options]

a website crawler that collects urls and scans for a11y issues

Options:
  -u, --url [url...]            one or more urls to crawl
  -s,--sleep [milliseconds]     Sets the time before a worker starts the next crawl. This is to help avoid being blocked. (default: "200")
  -m,--max <number>             Sets the max number of requests to crawl. This is useful for testing.
  -c,--concurrency <number>     Sets the max number of concurrent requests happening at a time. (default: "4")
  -o, --output-folder [folder]  the folder to output the results (default: "results")
  --no-ally                     Disables the ally scan.
  --no-urls                     Disables the url scan.
  -h, --help                    display help for command
```

### Reporting

A simple UI has been created to view the report that is generated from the `src/crawl`. To view the report run the following command and then go to the browser [http://localhost:1234]( http://localhost:1234) to see the report.

```bash
npm run report
```

Reporting is done with parcel and react as a single page application.

### Local Example

To see a local example of the crawler running on a site with 5 pages, run the following commands:

```bash
npm run start-example-server
node src/crawl --url http://localhost:3151
```

### Testing

To run the tests use the following command:

```bash
npm run test
```

#### TODO

- Add better styling to the report
- Add history of results generated. A folder structure like this might work, {sitename}-{timestamp}/dataset-ally.json. Currently we delete the whole results folder each time a new crawl is run.
- Add ability to pass in a report file to the report UI. Maybe it just reads all results files in the results folder and you can just choose.
- Add ability to pass your own URL cleaner function options. Currently we remove the hash and query params from the url and compare that url to any others we have already crawled. By passing in `--hash` or `--query` you can keep those in the url. This is useful if you have a site that uses hash routing.