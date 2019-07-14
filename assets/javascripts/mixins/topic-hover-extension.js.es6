import { ajax } from "discourse/lib/ajax";

// How many extra post excerpts to retrieve
const READ_AHEAD = 4;

let _cached = {};
let _promise;
let _inside = false;

function cleanDom() {
  $(".d-tooltip").remove();
  _inside = false;
}

function cancel() {
  if (_promise) {
    _promise.abort();
    _promise = null;
  }
  cleanDom();
}

function renderTooltip($this, text) {
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
    didInsertElement() {
      this._super(...arguments);

      if (this.capabilities.touch) {
        return;
      }

      cancel();

      $(this.element).on("mouseenter.discourse-tooltips", selector, function(
        e
      ) {
        let $this = $(this);
        let $parentTopicId = $(e.currentTarget).closest("[data-topic-id]");
        let topicId = parseInt($parentTopicId.attr("data-topic-id"));
        if (topicId) {
          cancel();
          _inside = true;

          if (_cached[topicId]) {
            return renderTooltip($this, _cached[topicId].excerpt);
          }

          let topicIds = [topicId];

          // Let's actually fetch the next few topic ids too, assuming the user will
          // mouse over more below
          let $siblings = $parentTopicId.nextAll(
            `[data-topic-id]:lt(${READ_AHEAD})`
          );
          $siblings.each((idx, s) => {
            let siblingId = parseInt(s.getAttribute("data-topic-id"));
            if (!_cached[siblingId]) {
              topicIds.push(siblingId);
            }
          });

          _promise = ajax("/tooltip-previews", {
            data: { topic_ids: topicIds }
          });
          _promise
            .then(r => {
              if (r && r.excerpts) {
                _.merge(_cached, r.excerpts);
              }

              if (_inside) {
                renderTooltip($this, _cached[topicId].excerpt);
              }
            })
            .catch(() => {
              // swallow errors - was probably aborted!
            });
        }
      });

      $(this.element).on("mouseleave.discourse-tooltips", selector, () =>
        cleanDom()
      );
    },

    willDestroyElement() {
      this._super(...arguments);

      if (this.capabilities.touch) {
        return;
      }

      cancel();

      $(this.element)
        .find(selector)
        .off(
          "mouseenter.discourse-tooltips, mouseleave.discourse-tooltips",
          selector
        );
    }
  };
}
