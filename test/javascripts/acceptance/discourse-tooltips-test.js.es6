import { acceptance } from "helpers/qunit-helpers";

acceptance("Discourse Tooltips", {
  pretend(server, helper) {
    server.get("/tooltip-previews", () => {
      return helper.response(200, {
        excerpts: {
          11557: {
            excerpt: "hello world",
          },
        },
      });
    });
  },
});

QUnit.test("display and hide", (assert) => {
  visit("/latest");

  andThen(() => {
    assert.equal(find(".d-tooltip").length, 0, "tooltip is hidden");
  });

  andThen(() => {
    let topic = find("tr[data-topic-id=11557].topic-list-item .raw-topic-link");
    topic.trigger("mouseenter");
  });

  andThen(() => {
    assert.equal(find(".d-tooltip").length, 1, "tooltip is shown");
    assert.equal(find(".d-tooltip-content").text(), "hello world");

    let topic = find("tr[data-topic-id=11557].topic-list-item .raw-topic-link");
    topic.trigger("mouseleave");
  });

  andThen(() => {
    assert.equal(find(".d-tooltip").length, 0, "tooltip is hidden again");
  });
});
