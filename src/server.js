require("dotenv").config();

const Hapi = require("@hapi/hapi");
const albums = require("./api/albums");
const songs = require("./api/songs");

const AlbumsService = require("./services/postgres/AlbumsService");
const SongsService = require("./services/postgres/SongsService");

const AlbumValidator = require("./validator/albums");
const SongValidator = require("./validator/songs");

const init = async () => {
  const albumService = new AlbumsService();
  const songService = new SongsService();

  // configure server
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });

  // register plugins
  await server.register([
    {
      plugin: albums,
      options: {
        service: albumService,
        validator: AlbumValidator,
      },
    },
    {
      plugin: songs,
      options: {
        service: songService,
        validator: SongValidator,
      },
    },
  ]);

  // start server
  await server.start();
  console.log(`Server is up and running on ${server.info.uri} 🚀`);
};

init();
