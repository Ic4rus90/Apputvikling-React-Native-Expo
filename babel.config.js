// Denne filen er NØDT til å være javascript, den virker ikke ellers
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    "plugins": [
      [
        "module-resolver", {
          "root": [
            "./src"
          ],
          "extensions": [
            ".ios.js", ".android.js", ".js", ".ts", ".tsx", ".json"
          ],
          "alias": {
            "tests": [
              "./tests/"
            ],
            "@components": "./src/components"
          }
        }
      ],
      ['react-native-reanimated/plugin', {
        relativeSourceLocation: true
      }
      ]
    ]
  };
};