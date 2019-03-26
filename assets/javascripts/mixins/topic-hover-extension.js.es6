import { ajax } from "discourse/lib/ajax";
import { showPopover, hidePopover } from "discourse/lib/d-popover";

// How many extra post excerpts to retrieve
const READ_AHEAD = 4;

let _cached = {};
let _promise;

function cancel() {
  if (_promise) {
    _promise.abort();
    _promise = null;
  }
}

export function hoverExtension(selector) {
  return {
    willDestroyElement() {
      this._super(...arguments);

      this.$().off("mouseenter.discourse-tooltips", selector);
      this.$().off("mouseleave.discourse-tooltips", selector);
    },

    didInsertElement() {
      this._super(...arguments);

      if (this.capabilities.touch) {
        return;
      }

      cancel();

      this.$().on("mouseleave.discourse-tooltips", selector, event =>
        hidePopover(event)
      );

      this.$().on("mouseenter.discourse-tooltips", selector, function(event) {
        const $this = $(event.target);
        const $parentTopicId = $this.closest("[data-topic-id]");
        const topicId = parseInt($parentTopicId.attr("data-topic-id"), 10);

        const popover = showPopover(event);

        if (topicId) {
          cancel();

          if (_cached[topicId]) {
            popover.html(_cached[topicId].excerpt);
            return;
          }

          let topicIds = [topicId];

          // Let's actually fetch the next few topic ids too, assuming the user will
          // mouse over more below
          const $siblings = $parentTopicId.nextAll(
            `[data-topic-id]:lt(${READ_AHEAD})`
          );
          $siblings.each((idx, s) => {
            const siblingId = parseInt(s.getAttribute("data-topic-id"), 10);
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

              popover.html(_cached[topicId].excerpt);
            })
            .catch(() => {
              // swallow errors - was probably aborted!
            });
        }
      });
    }
  };
}
