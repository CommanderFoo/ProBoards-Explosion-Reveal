class Explosion_Reveal {

	static init(){
		this.PLUGIN_ID = "image_explosion_reveal";
		this.settings = Object.create(null);
		this.explosion_spritesheet = "";

		this.setup();

		if(this.settings.gifts && this.settings.gifts.length > 0){
			$(this.ready.bind(this));
		}
	}

	static setup(){
		let plugin = pb.plugin.get(this.PLUGIN_ID);

		if(plugin && plugin.settings){
			this.settings = plugin.settings;

			this.explosion_spritesheet = plugin.images.spritesheet;
		}
	}

	static ready(){
		let $content = $("<div class='the-gifts'></div>");
		let has_unopened = false;

		for(let i = 0; i < this.settings.gifts.length; ++ i){
			let key = this.settings.gifts[i].unique_key;
			let opened = (localStorage.getItem("exp_gift_" + key))? true : false;
			let img = (opened)? this.settings.gifts[i].after_image : this.settings.gifts[i].before_image;
			let data = (!opened)? this.settings.gifts[i].after_image : "";
			let can_click = (this.settings.gifts[i].url_to_full_size.length > 0)? 1 : 0;
			let $gift = $("<div><img src='" + img + "' data-can-click='" + can_click + "' data-after-image='" + data + "' data-key='" + key + "' /><div class='click-me-overlay'>Click To View</div><div></div></div>");

			if(img){
				let preload = new Image();

				preload.src = img;
			}

			$gift.find(".click-me-overlay").on("click", () => {
				window.open(this.settings.gifts[i].url_to_full_size);
			});

			if(opened && can_click){
				$gift.find(".click-me-overlay").show();
			}

			$content.append($gift);

			if(!opened){
				has_unopened = true;
			}
		}

		if(has_unopened){
			$content.find("img").on("click", function(){
				let $img = $(this);

				if($img.attr("data-after-image").length == 0){
					return;
				}

				let $explosion = $img.parent().find("div:last");

				$explosion.css({

					top: (($img.height() / 2) - 55) + "px",
					left: (($img.width() / 2) - 55) + "px"

				});

				$explosion.css("background-image", "url('" + Explosion_Reveal.explosion_spritesheet + "')");
				$explosion.addClass("image-explosion");

				$img.animate({opacity: 0.01, duration: 1.2}, {

					complete: () => {

						$img.attr("src", $img.attr("data-after-image"));
						$img.animate({opacity: 1});
						$img.off("click");

						setTimeout(function(){
							$explosion.remove();

							if($img.attr("data-can-click") == "1"){
								$img.parent().find(".click-me-overlay").fadeIn("slow").delay(100);
							}
						}, 750);

						localStorage.setItem("exp_gift_" + $img.attr("data-key"), 1);
					}

				}).delay(100);
			});
		}

		this.container({title: "Gifts", content: $content}).prependTo("#content");
	}

	static container({title = "", content = ""} = {}){
		let html = "";

		html += "<div class=\"container\">";
		html += "<div class=\"title-bar\"><h2>" + title + "</h2></div>";
		html += "<div class=\"content pad-all\"></div>";
		html += "</div>";

		let $html = $(html);

		$html.find(".content").append(content);

		return $html;
	}

}

Explosion_Reveal.init();