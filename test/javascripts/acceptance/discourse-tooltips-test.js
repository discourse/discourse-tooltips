import {
  acceptance,
  query,
  visible,
} from "discourse/tests/helpers/qunit-helpers";
import { test } from "qunit";
import { triggerEvent, visit } from "@ember/test-helpers";

acceptance("Discourse Tooltips", function (needs) {
  needs.pretender((server, helper) => {
    server.get("/tooltip-previews", () => {
      return helper.response(200, {
        excerpts: {
          11557: {
            excerpt: "hello world",
          },
        },
      });
    });
  });

  test("display and hide", async function (assert) {
    await visit("/latest");
    assert.ok(!visible(".d-tooltip"), "tooltip is hidden");

    let topicLink = query(".topic-list-item:first-child .raw-topic-link");

    await triggerEvent(topicLink, "mouseover");
    assert.ok(visible(".d-tooltip"), "tooltip is shown");
    assert.equal(query(".d-tooltip-content").textContent.trim(), "hello world");

    await triggerEvent(topicLink, "mouseout");
    assert.notOk(visible(".d-tooltip"), "tooltip is hidden again");
  });
});
