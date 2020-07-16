const pingController = (fastify, _, done) => {
  // Used to ping server from client
  fastify.route({
    method: "GET",
    url: "/",
    handler: async (_, res) => {
      res.code(200).send();
    },
  });

  done();
};

export default pingController;
