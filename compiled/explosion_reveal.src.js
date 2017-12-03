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
		let total = 0;

		for(let i = 0; i < this.settings.gifts.length; ++ i){
			if(!localStorage.getItem("exp_gift_" + this.settings.gifts[i].unique_key)){
				$content.append("<div><img src='" + this.settings.gifts[i].before_image + "' data-after-image='" + this.settings.gifts[i].after_image + "' data-key='" + this.settings.gifts[i].unique_key + "' /><div></div></div>");

				total ++;
			}
		}

		if(!total){
			return;
		}

		$content.find("img").on("click", function(e){

			let $img = $(this);
			let $explosion = $img.parent().find("div");

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

					setTimeout($explosion.remove, 750);

					localStorage.setItem("exp_gift_" + $img.attr("data-key"), 1);
				}

			}).delay(0.3);
		});

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

