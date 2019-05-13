# frozen_string_literal: true

DiscourseTooltips::Engine.routes.draw do
  get "/" => 'tooltip_previews#index'
end
