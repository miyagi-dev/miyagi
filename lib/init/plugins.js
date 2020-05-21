module.exports = function setPlugins(plugins, config) {
  if (plugins) {
    const engine = require(config.engine.name);

    plugins.forEach(({ plugin, options }) => {
      require(plugin)(engine, options);
    });
  }
};
