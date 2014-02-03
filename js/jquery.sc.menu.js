
/*
$(document).ready(function() { 
alert("JQuery");
});
*/
/*
function inspectObject(obj) {
	var s='';
	for (var i in obj) {
		s+=i.toString();
	}
	alert(s);
}
*/


/*
* FOLLOWING THE "CONVENTION OVER CONFIGURATION PRINCIPLE" *
the site map, main menu, and anchor in the content are coordinated following these rules:

- anchor contents just have a semantic connotation (e.g., "research")
- anchors are not explicitly declared. Instead, IDs of headers will be used
- menu names have the same name than the highest level header in each content + the prefix "Menu"
- Map names have the same name than every header in the content + the prefix "Map"
- When clicking on a map link, the corresponding menu button (that is the button with id: mapName - prefix "Map" + prefix "Menu" should be implicitly "clicked")
*/



(function ($) {
	
	
	
	function configureHeaders() {
		/*
		$(".siteMapAnchor").each(function() {
			$(this).wrap("<a name="+this.id+"></a>");
		});
		*/
		$('h2.siteMapAnchor').click(function() {
			$(this).next().toggle('slow');
			$(this).toggleClass('minimizedSection');
		});
	}
	
	function toContentName(headerName) {
		var rexp = /(\w+)_([\w]+)$/;  
		/*the match produces an array with 3 values (since there are two parenthesis in rexp) 
		the first value is the match
		the second the first parenthesis
		the third the next parenthesis
		*/
		return headerName.match(rexp)[1]; 
	}
	
	function contentNameToMenuName(contentName) {
		return contentName + "_menu";
	}
	
	function contentNameToHeaderName(contentName) {
		return contentName + "_header";
	}
	
	function contentNameToMapName(contentName) {
		return contentName + "_map"; //add the "Map" suffix to the name
	}
	
	
	function mapNameToMenuName(mapName) {
		return contentNameToMenuName(toContentName(mapName));
	}
	
	
	function headerNameToMapName(headerName) {
		return contentNameToMapName(toContentName(headerName));
	}
	
	function mapNameToHeaderName(mapName) {
		return contentNameToHeaderName(toContentName(mapName));
	}
	
	$.fn.siteMapHtml = function(limit) {
		var currentLevel;
		var nodeHtml = '';
		var ending;
		var children;
		if(!this.is(':header')) {
			currentLevel = 1;
			children = this.find('h1.siteMapAnchor');
			nodeHtml = "\
		<ul>\
			<li id='siteMapRoot' class='open'><a href='#'>Site map</a>";
			closing = "\
			</li>\
		</ul>";
		
		} else {
			currentLevel = parseInt(this[0].tagName.substr(1));
			var thisHeader='h'+currentLevel;
			var nextHeader = 'h'+(currentLevel+1);
			children = this.parent().find(nextHeader+'.siteMapAnchor');
			//nodeHtml = "<li id='"+contentNameToMapName(this[0].id)+"' class='mapLink "+thisHeader+"MapLink'><a href='#" + this[0].id + "'>"+this.text()+"</a>";
			//alert(toContentName(this[0].id));
			nodeHtml = "<li id='"+headerNameToMapName(this[0].id)+"' class='mapLink "+thisHeader+"MapLink'><a href='#" + this[0].id + "'>"+this.text()+"</a>";
			closing = "</li>";
			
		}
		if(children.length > 0 && currentLevel < limit) {
			nodeHtml += '<ul>';
			children.each(function() {
				var childrenHtml = $(this).siteMapHtml(limit);
				nodeHtml += childrenHtml;
			});
			nodeHtml += '</ul>';
		} else {
		}
		
		
		nodeHtml += closing;
		
		return nodeHtml;
	}
	
	
	function addSiteMap() {
	
		var siteMapHtml = $("body").siteMapHtml(3);
		

		
		$("#siteMapContainer").jstree({
	        "core" : { "initially_open" : [ "siteMapRoot" ] },
	        "themes" : {
				"url" : "styles/themes-jstree/apple/style.css",
	            "theme" : "apple",
	            "dots" : true,
	            "icons" : true
	        },
        	"plugins" : [ "themes", "html_data" ],
			"html_data" : {
	            "data" : siteMapHtml /* "\
	<ul>\
		<li id='siteMapRoot' class='open'><a href='#'>Site map</a>\
			<ul>\
				<li id='homeMap'><a href='#home'>Contact me</a></li>\
				<li id='researchMap'><a href='#research'>Research</a></li>\
				<li id='publicationsMap'><a href='#publications'>Publications</a>\
					<ul>\
						<li id='journalsMap'><a href='#journals'>Journals</a>\
						<li id='conferencesMap'><a href='#conferences'>Conferences</a>\
						<li id='workshopsMap'><a href='#workshops'>Workshops</a>\
					</ul>\
				</li>\
                <li id='teachingMap'><a href='#teaching'>Teaching</a></li>\
                <li id='personalMap'><a href='#personal'>Personal</a></li>\
			</ul>\
		</li>\
	</ul>"*/
	        }
	    });


/*
		$("#siteMapRoot > ul > li").click(
			function() {
				$("#"+mapNameToMenuName(this.id)).click();
				return true;
			}
		);
*/	

	
		var semaphore = false;
		
		$(".h1MapLink").click(
			function() {
					$("#"+mapNameToMenuName(this.id)).click();
					return true;
			}
		);
		
		$('.h2MapLink').click(
			
			function(event) {
				//alert($(event.target).closest('.mapLink').hasClass('h3MapLink'));
				//alert($(this).hasClass('h3MapLink'));
				if(! ($(event.target).closest('.mapLink')[0] == this) )
					return true;
				
				
				//alert($(event.target).hasClass('h2MapLink'));
			  //event.stopPropagation();
			  //if($(this).hasClass('h2MapLink')) { //avoiding children events
				  if(!semaphore) {
					semaphore = true;
					$("#"+mapNameToHeaderName(this.id)).highlight(function() {
						semaphore = false;
					});
					return true;
				  } else {
					return false;
				  }
			  //}
			}
		);


		$("#siteMapContainer").draggable({
			"start" : function() { $(this).appendTo('body'); } 
		});
	
	}

	
	
	function errorMessage(msg) {
		//var formattedMessage = "<p>"+msg+"</p>";
		var formattedMessage = msg;
		$("#errorMessage").show().html(formattedMessage);	
	}

	function improveAlignment() {
		$('#loadingImage').alignBoth();
		//$("#myPicture").vAlign();
		
		//$(".menuText").vAlign();
	}

	function configureZoom() {
			/*
		$('.ui-state-default').hover(
			function(){ $(this).addClass('ui-state-hover'); }, 
			function(){ $(this).removeClass('ui-state-hover'); }
		);
		*/
		
		$('.zoom').hover(
			function(){ $(this).addClass('ui-state-hover'); }, 
			function(){ $(this).removeClass('ui-state-hover'); }
		);
			
/*
		$('.ui-state-default').click(function(){
			$(this).toggleClass('ui-state-active');
		});
*/

		$('.zoom').click(function(){

			$('.zoom').toggle("fast");
			$("#banner").slideToggle("slow");
			$("#footer").slideToggle("slow");
			
		});
	}
	
	function startSlides() {
		$('#bannerSlides').slides({
				container: 'slidesContainer',
				effect: 'fade',
				crossfade: true,
				generatePagination: false,
				fadeSpeed: 1000,
				//preload: true, /*WARNING: UNCOMMENTING THIS BREAK THE ANIMATION IN IEXPLORER. SOMETIMES THE IMAGES DO NOT APPEAR AT ALL */
				preloadImage: 'img/ajax-loader.gif',
	
				//preloadImage: 'img/ecuadorForrest.jpg',
				play: 120000, //every 120 seconds
				bigTarget: true
				//pause: 2500,
				//hoverPause: true,
		});
	}

	//since javascript is active, let's improve a bit the presentation
	var noJSMainContent = null; /* Global variable */
	function transformDomJS() {
		noJSMainContent = $("#noJSMainContent"); 
		var content = $("<div id='JSMainContent'>").append(noJSMainContent.clone().find(".contentWrapper").hide().css("position", "absolute"));
		noJSMainContent.parent().append(content);
		noJSMainContent.remove();
	}
	
	function transformDomNoJS() {
		$("*").unbind();
		
		var JSMainContent = $("#JSMainContent");
		JSMainContent.parent().append(noJSMainContent.show());
		JSMainContent.remove();
		
		
		$('.JSOnlyContent').hide();
		$('body').attr('id','noJS');
	}
	
	function verifyTransition(newMenuId) {
			var selectedMenus = $('.selectedMenu');
			if(selectedMenus.length == 1 && selectedMenus[0].id == newMenuId) {
				//errorMessage("<p>everything is fine</p>");
				return true;
			} else {
				onCrash();
				return false;
			}
	}

	var crash = false;
	function onCrash(err) {
		if(!crash) {
			crash = true;
			//alert('error: '+err);
		errorMessage("<p>An error has occurred.<br/>"+
						"In order to prevent an unexpected presentation this web page has switched to No JavaScript mode</p>"
					);
		transformDomNoJS();
		}
	}

	function configureMenu() {
		var semaphoreMenu = false;
		
		var previousVisibleMenu = null;
		$(".menuItem").click(function() {
			if(crash)
				return false;
			try {
				if(!semaphoreMenu) {
					semaphoreMenu = true;
					var selectedMenu = this;
				
					if(this!=previousVisibleMenu) {
						selectMenu(selectedMenu);
						var newMenuId = selectedMenu.id;
						var newContentId=toContentName(newMenuId); 
	
						if(previousVisibleMenu!=null) {
		
							var previousMenuId = previousVisibleMenu.id;
							var previousContentId=toContentName(previousMenuId); 
							unselectMenu(previousVisibleMenu);
							
							/*
							$("#"+previousContentId).fadeOut("fast", function() {
								
							});
							$("#"+newContentId).fadeIn("normal", function() {
								semaphoreMenu = false;
							});
							*/
							$("#"+previousContentId).hide();
							$("#"+previousContentId).css("position", "absolute");
							$("#"+newContentId).css("position", "relative");
							$("#"+newContentId).show();
							
							semaphoreMenu = false;
						} else {
							/*
							$("#"+newContentId).fadeIn("slow", function() {
								semaphoreMenu = false;
							});
							*/
							$("#"+newContentId).css("position", "relative");
							$("#"+newContentId).show();
							semaphoreMenu = false;
							
						}
	
						//$("div#JSMainContent").height($("#"+newContentId).height());

						previousVisibleMenu = this;
						//verifyTransition(newMenuId);
					}
					else {
						//alert('menu already selected');	
						semaphoreMenu = false;
					}
				}
				
				return true;
				
			}
			catch(err) {
				onCrash(err);
			}
		});
		
	
		

		var selectMenu = function(menuItem) {
			$(menuItem).removeClass("unselectedMenu");
			$(menuItem).addClass("selectedMenu");
			$(menuItem).find(".menuBackground:not(:hidden)").fadeOut('fast');
			$(menuItem).find(".selectedMenuBackground").fadeIn('fast');
			
			//$(menuItem).find(".selectedMenuBackground").css("z-index",maxZIndex);
			
			$(menuItem).removeClass("mouseOverMenu");  
			//$(menuItem).find(".mouseOverMenuBackground").css("z-index",minZIndex);  
		}
	
		var unselectMenu = function(menuItem) {
			$(menuItem).removeClass("selectedMenu");
			$(menuItem).addClass("unselectedMenu");
			
			$(menuItem).find(".menuBackground:not(:hidden)").hide();
			$(menuItem).find(".unselectedMenuBackground").show();
			//$(menuItem).find(".selectedMenuBackground").css("z-index",minZIndex);  
		}
	
		var onMenuOver = function() {
			if (!$(this).hasClass("selectedMenu")) {
				$(this).addClass("mouseOverMenu");

				$(this).find(".menuBackground:not(:hidden)").hide();
				
				$(this).find(".mouseOverMenuBackground").show();
				//$(this).find(".mouseOverMenuBackground").css("z-index",maxZIndex);  
			}
			return false;
		}
	
		var onMenuOut = function() {
			if (!$(this).hasClass("selectedMenu")) {
				$(this).removeClass("mouseOverMenu");
				$(this).find(".menuBackground:not(:hidden)").hide();
				$(this).find(".unselectedMenuBackground").show();
				//$(this).find(".mouseOverMenuBackground").css("z-index",minZIndex);  
			}
			return false;
		}
	
		$(".menuItem").hover(onMenuOver, onMenuOut); //this is supposed to cancel the events in the children of the DOM node
	}
	
	/*
	 ******************************************************************************************************
	 *
	*** MAIN CONTENT ***
	 *
	 ******************************************************************************************************
	 */	
	
	
	
	function configureContent() {
		configureTeaching();
		
		var publicationsDistribution = [
			{publicationType: 'article', target: 'journalsContent'},
			{publicationType: 'conference', target: 'conferencesContent'},
			{publicationType: 'inproceedings', target: 'publishedWorkshopsContent'},
			{publicationType: 'unpublished', target: 'unpublishedWorkshopsContent'},
			{publicationType: 'techreport', target: 'technicalReportsContent'},
			{publicationType: 'misc', target: 'seminarsContent'},
			{publicationType: 'mastersthesis', target: 'thesesContent'}
		];
		$.classifyPublications('allPublications', publicationsDistribution);
	}
		
		
	function configureTeaching() {
		$('#teachingTable').dataTable({
		"bAutoWidth": false,
		"bFilter": false,	
		"bLengthChange": false,
		"bInfo": false,
		"bPaginate": false,
		"aoColumns": [
			{ "asSorting": [ "desc", "asc" ] },
			{  },
			{  },
			{  }
		]
		});
	}
	
		
	/*
	 ******************************************************************************************************
	 *
	*** INITIALIZATION ***
	 *
	 ******************************************************************************************************
	 */
	
	$(function() {
		improveAlignment();
		configureZoom(); 
		startSlides();
		transformDomJS();
		configureContent();
		configureHeaders();
		configureMenu();
		addSiteMap();
		
		/*
		
		$('#banner, .imageBanner, .slidesContainer, #menuBar, h2.siteMapAnchor').corner({
    tl: { radius: 18 }, tr: { radius: 18 }, bl: { radius: 18 }, br: { radius: 18 }, antiAlias: true 

}); 
$('#footer').corner({
    bl: { radius: 8 }, br: { radius: 8 }, antiAlias: true 

});
	*/	
		
		$("#home_menu").click();
	});
	
	
	
})(jQuery);
