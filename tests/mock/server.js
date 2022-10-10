const hapi = require("@hapi/hapi");
const inert = require("@hapi/inert");
const path = require("path");

const start = async () => {
  const server = hapi.server({
    port: 3151,
    host: 'localhost',
    router: {
      stripTrailingSlash: true
    },
});

  await server.register([inert]);

  server.route({
    method: "GET",
    path: "/",
    handler: {
      file: function (request) {
        return path.join(__dirname, "./site/index.html");
      },
    },
  });

  server.route({
    method: "GET",
    path: "/{filename*}",
    handler: {
      file: function (request) {
        return path.join(__dirname, `./site/${request.params.filename}.html`);
      },
    },
  });

  server.route({
    method: "GET",
    path: "/styles.css",
    handler: {
      file: function (request) {
        return path.join(__dirname, "./site/styles.css");
      },
    },
  });

  await server.start();

  console.log("Server running at:", server.info.uri);
};

start();
