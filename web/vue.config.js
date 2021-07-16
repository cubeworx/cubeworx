module.exports = {
  chainWebpack: (config) => {
    config
      .plugin('html')
      .tap((args) => {
        const properties = args[0];
        properties.title = 'CubeWorx';
        return args;
      });
  },
  devServer: {
    proxy: {
      '^/api': {
        target: 'http://localhost:3000',
      },
      '^/socket.io': {
        target: 'http://localhost:3000',
        ws: true,
      },
    },
  },
};
