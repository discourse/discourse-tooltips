import { run } from "@ember/runloop";
import $ from "jquery";
import { eventFrom } from "discourse/plugins/discourse-tooltips/discourse/lib/event-from";

function cleanDom() {
  $(".d-tooltip").remove();
}

function cancel() {
  cleanDom();
}

function renderTooltip($this, text) {
  if (!text) {
    return;
  }

  $this.after(
    `<div class='d-tooltip'><div class='d-tooltip-pointer'></div><div class='d-tooltip-content'>${text}</div></div></div>`
  );

  let $dTooltip = $(".d-tooltip");
  let tooltipWidth = $dTooltip.outerWidth();
  let elementWidth = $this.width();
  let elementHeight = $this.height();
  let elementPos = $this.position();
  let elementX = elementPos.left;
  let y = elementPos.top + elementHeight;
  let x = elementX + elementWidth / 2 - tooltipWidth / 2;

  // make sure left side of the tooltip is not out of the screen
  let $mainLink = $this.hasClass("main-link")
    ? $this
    : $this.parents(".main-link");
  let mainLinkLeftOffset = $mainLink.offset().left;
  if (mainLinkLeftOffset + x < 0) {
    x = elementX;
  }

  $dTooltip.css({ left: `${x}px`, top: `${y}px` });
  $dTooltip.fadeIn(200);
}

export function hoverExtension(selector) {
  return {
    pluginId: "discourse-tooltips",

    didInsertElement() {
      this._super(...arguments);

      cancel();

      $(this.element).on("mouseenter.discourse-tooltips", selector, (e) => {
        if (eventFrom(e) !== "mouse") {
          return;
        }

        // eslint-disable-next-line ember/jquery-ember-run
        cancel();

        const topicId = parseInt(
          e.target.closest("[data-topic-id]").dataset.topicId,
          10
        );

        const topic = this.topics.find((t) => t.id === topicId);

        return renderTooltip($(e.target), topic.excerpt);
      });

      $(this.element).on("mouseleave.discourse-tooltips", selector, (e) => {
        if (eventFrom(e) !== "mouse") {
          return;
        }

        run(() => cleanDom());
      });
    },

    willDestroyElement() {
      this._super(...arguments);

      cancel();

      $(this.element)
        .find(selector)
        .off(
          "mouseenter.discourse-tooltips, mouseleave.discourse-tooltips",
          selector
        );
    },
  };
}
