import { acceptance } from "discourse/tests/helpers/qunit-helpers";

acceptance("Discourse Tooltips", function (needs) {
  needs.pretender((server, helper) => {
    server.get("/tooltip-previews", () => {
      return helper.response(200, {
        excerpts: {
          11557: {
            excerpt: "hello world"
          }
        }
      });
    });
  });

  test("display and hide", assert => {
    visit("/latest");

    andThen(() => {
      assert.equal(find(".d-tooltip").length, 0, "tooltip is hidden");
    });

    andThen(() => {
      let topic = find(".topic-list-item[data-topic-id=11557] .raw-topic-link");
      topic.trigger("mouseenter");
    });

    andThen(() => {
      assert.equal(find(".d-tooltip").length, 1, "tooltip is shown");
      assert.equal(find(".d-tooltip-content").text(), "hello world");

      let topic = find(".topic-list-item[data-topic-id=11557] .raw-topic-link");
      topic.trigger("mouseleave");
    });

    andThen(() => {
      assert.equal(find(".d-tooltip").length, 0, "tooltip is hidden again");
    });
  });
});
