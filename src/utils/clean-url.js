const URL = require("url");

// this cleans the url by removing the query string and hash
const cleanUrl = (url) => {
  const urlObject = URL.parse(url);
  return urlObject.protocol + "//" + urlObject.host + urlObject.pathname;
};

module.exports = cleanUrl;
