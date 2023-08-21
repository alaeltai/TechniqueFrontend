module.exports = {
  transpileDependencies: ["vuetify"],

  pluginOptions: {
    i18n: {
      locale: "en-GB",
      fallbackLocale: "en-GB",
      localeDir: "locales",
      enableInSFC: false,
      enableBridge: false,
    },
  },

  css: {
    extract:
      process.env.NODE_ENV === "production"
        ? {
            ignoreOrder: true,
          }
        : false,
  },

  publicPath: process.env.VUE_APP_PUBLIC_PATH,
};
