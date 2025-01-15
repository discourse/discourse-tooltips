import { htmlSafe } from "@ember/template";
import DTooltip from "float-kit/components/d-tooltip";

const triggers = {
  mobile: ["hover"],
  desktop: ["hover"],
};

<template>
  <DTooltip @triggers={{triggers}} @untriggers={{triggers}} @placement="bottom">
    <:trigger>
      {{yield}}
    </:trigger>
    <:content>
      <div class="d-tooltip-content">
        {{htmlSafe @outletArgs.topic.excerpt}}
      </div>
    </:content>
  </DTooltip>
</template>
