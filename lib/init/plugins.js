module.exports = function setPlugins(plugins, config) {
  if (plugins) {
    const engine = require(config.files.templates.engine);

    plugins.forEach(({ plugin, options }) => {
      require(plugin)(engine, options);
    });
  }
};
