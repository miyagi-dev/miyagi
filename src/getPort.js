module.exports = () => {
  let port = 8000;

  process.argv.slice(2).forEach(arg => {
    const splitted = arg.split("=");

    if (splitted[0] === "port") {
      port = splitted[1];
    }
  });

  return port;
};
