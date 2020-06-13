const mainController = (fastify, _, done) => {
  // All the routes
  const routes = ["plannedweek", "recipes"];

  // Register all routes
  routes.forEach((route) => {
    fastify.register(import(`./${route}/controller.js`), { prefix: route });
  });

  done();
};

export default mainController;
