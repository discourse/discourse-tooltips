import { withPluginApi } from "discourse/lib/plugin-api";
import { hoverExtension } from "discourse/plugins/discourse-tooltips/mixins/topic-hover-extension";
import popoverExtension from "discourse/lib/d-popover";

export default {
  name: "attach-hover-event",

  initialize() {
    withPluginApi("0.8.9", api => {
      api.modifyClass(
        "component:topic-list",
        hoverExtension(".raw-topic-link"),
      );
      api.modifyClass(
        "component:topic-list",
        popoverExtension(".raw-topic-link"),
      );
      api.modifyClass(
        "component:categories-topic-list",
        hoverExtension(".main-link")
      );
      api.modifyClass(
        "component:categories-topic-list",
        popoverExtension(".main-link"),
      );
    });
  }
};
