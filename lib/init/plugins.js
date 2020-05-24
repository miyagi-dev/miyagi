module.exports = function setPlugins(plugins, config) {
  if (plugins) {
    const engine = require(config.engine.name);

    for (const { plugin, options } of plugins) {
      require(plugin)(engine, options);
    }
  }
};
