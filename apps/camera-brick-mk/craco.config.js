const path = require('path');

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Include shared-ui package for Babel transpilation
      const scopePluginIndex = webpackConfig.resolve.plugins.findIndex(
        ({ constructor }) =>
          constructor && constructor.name === 'ModuleScopePlugin'
      );
      if (scopePluginIndex > -1) {
        webpackConfig.resolve.plugins.splice(scopePluginIndex, 1);
      }

      // Add shared-ui to babel-loader include
      const oneOfRule = webpackConfig.module.rules.find(
        (rule) => rule.oneOf
      );
      if (oneOfRule) {
        const babelLoader = oneOfRule.oneOf.find(
          (rule) =>
            rule.loader &&
            rule.loader.includes('babel-loader') &&
            rule.include
        );
        if (babelLoader) {
          babelLoader.include = [
            babelLoader.include,
            path.resolve(__dirname, '../../packages/shared-ui/src'),
          ];
        }
      }

      return webpackConfig;
    },
  },
};