module.exports = {
  future: {
    webpack5: true,
  },
  webpack: (config) => {
    config.module.rules.push({
      test: [/\.gif$/, /\.jpe?g$/, /\.png$/, /\.svg$/],
      loader: require.resolve("url-loader")
    });

    return config;
  }
};
