import { withSilencedDeprecations } from "discourse/lib/deprecated";
import { withPluginApi } from "discourse/lib/plugin-api";
import { hoverExtension } from "discourse/plugins/discourse-tooltips/mixins/topic-hover-extension";

export default {
  name: "attach-hover-event",

  initialize() {
    withSilencedDeprecations("discourse.hbr-topic-list-overrides", () => {
      withPluginApi("0.8.9", (api) => {
        api.modifyClass(
          "component:topic-list",
          hoverExtension(".raw-topic-link")
        );
        api.modifyClass(
          "component:categories-topic-list",
          hoverExtension(".main-link a.title")
        );
      });
    });
  },
};
