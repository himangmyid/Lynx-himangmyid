import { pluginQRCode } from "@lynx-js/qrcode-rsbuild-plugin";
import { pluginReactLynx } from "@lynx-js/react-rsbuild-plugin";
import { defineConfig } from "@lynx-js/rspeedy";
import { pluginSass } from "@rsbuild/plugin-sass";
export default defineConfig({
  source: {
    entry: "./src/App.tsx",
  },
  plugins: [pluginReactLynx(), pluginSass({}), pluginQRCode()],
  environments: {
    web: {},
    lynx: {},
  },
});