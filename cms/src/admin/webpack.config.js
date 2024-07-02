module.exports = (config, webpack) => {
  return {
    ...config,
    resolve: {
      ...config.resolve,
      fallback: {
        ...config.resolve.fallback,
        crypto: false,
        http: false,
        fs: false,
        zlib: false,
        https: false,
        stream: false,
        path: false,
        timers: false,
        tls: false,
        net: false,
        url: false,
        querystring: false,
      },
    }
  };
};

