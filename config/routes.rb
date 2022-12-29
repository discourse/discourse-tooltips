# frozen_string_literal: true

DiscourseTooltips::Engine.routes.draw { get "/" => "tooltip_previews#index" }
