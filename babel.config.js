module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        targets: {
          esmodules: true,
        },
      },
    ],
    [
      "@babel/preset-react",
      { runtime: "automatic" }, //option so no need to import React from "react"
    ],
  ],
};
