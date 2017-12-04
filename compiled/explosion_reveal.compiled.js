"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Explosion_Reveal = function () {
	function Explosion_Reveal() {
		_classCallCheck(this, Explosion_Reveal);
	}

	_createClass(Explosion_Reveal, null, [{
		key: "init",
		value: function init() {
			this.PLUGIN_ID = "image_explosion_reveal";
			this.settings = Object.create(null);
			this.explosion_spritesheet = "";

			this.setup();

			if (this.settings.gifts && this.settings.gifts.length > 0) {
				$(this.ready.bind(this));
			}
		}
	}, {
		key: "setup",
		value: function setup() {
			var plugin = pb.plugin.get(this.PLUGIN_ID);

			if (plugin && plugin.settings) {
				this.settings = plugin.settings;

				this.explosion_spritesheet = plugin.images.spritesheet;
			}
		}
	}, {
		key: "ready",
		value: function ready() {
			var _this = this;

			var $content = $("<div class='the-gifts'></div>");
			var has_unopened = false;

			var _loop = function _loop(i) {
				var key = _this.settings.gifts[i].unique_key;
				var opened = localStorage.getItem("exp_gift_" + key) ? true : false;
				var img = opened ? _this.settings.gifts[i].after_image : _this.settings.gifts[i].before_image;
				var data = !opened ? _this.settings.gifts[i].after_image : "";
				var can_click = _this.settings.gifts[i].url_to_full_size.length > 0 ? 1 : 0;
				var $gift = $("<div><img src='" + img + "' data-can-click='" + can_click + "' data-after-image='" + data + "' data-key='" + key + "' /><div class='click-me-overlay'>Click To View</div><div></div></div>");

				if (img) {
					var preload = new Image();

					preload.src = img;
				}

				$gift.find(".click-me-overlay").on("click", function () {
					window.open(_this.settings.gifts[i].url_to_full_size);
				});

				if (opened && can_click) {
					$gift.find(".click-me-overlay").show();
				}

				$content.append($gift);

				if (!opened) {
					has_unopened = true;
				}
			};

			for (var i = 0; i < this.settings.gifts.length; ++i) {
				_loop(i);
			}

			if (has_unopened) {
				$content.find("img").on("click", function () {
					var $img = $(this);

					if ($img.attr("data-after-image").length == 0) {
						return;
					}

					var $explosion = $img.parent().find("div:last");

					$explosion.css({

						top: $img.height() / 2 - 55 + "px",
						left: $img.width() / 2 - 55 + "px"

					});

					$explosion.css("background-image", "url('" + Explosion_Reveal.explosion_spritesheet + "')");
					$explosion.addClass("image-explosion");

					$img.animate({ opacity: 0.01, duration: 1.2 }, {

						complete: function complete() {

							$img.attr("src", $img.attr("data-after-image"));
							$img.animate({ opacity: 1 });
							$img.off("click");

							setTimeout(function () {
								$explosion.remove();

								if ($img.attr("data-can-click") == "1") {
									$img.parent().find(".click-me-overlay").fadeIn("slow").delay(100);
								}
							}, 750);

							localStorage.setItem("exp_gift_" + $img.attr("data-key"), 1);
						}

					}).delay(100);
				});
			}

			this.container({ title: "Gifts", content: $content }).prependTo("#content");
		}
	}, {
		key: "container",
		value: function container() {
			var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
			    _ref$title = _ref.title,
			    title = _ref$title === undefined ? "" : _ref$title,
			    _ref$content = _ref.content,
			    content = _ref$content === undefined ? "" : _ref$content;

			var html = "";

			html += "<div class=\"container\">";
			html += "<div class=\"title-bar\"><h2>" + title + "</h2></div>";
			html += "<div class=\"content pad-all\"></div>";
			html += "</div>";

			var $html = $(html);

			$html.find(".content").append(content);

			return $html;
		}
	}]);

	return Explosion_Reveal;
}();

Explosion_Reveal.init();
