

(function ($) {

	$.newCopyToClipboardDialog = function(openingOptions, zeroClipboardOptions) {
		return new copyToClipboardDialog(openingOptions, zeroClipboardOptions);
	}
	
	function copyToClipboardDialog(openingOptions, zeroClipboardOptions) {

		openingOptions = $.extend({
			close: function(event, ui) {     
				//$(this).dialog('close');
			}
		},openingOptions||{});
		
		var buttontText = "Copy";
		ZeroClipboard.setMoviePath(zeroClipboardOptions.moviePath);


		this.bibTexDialog = $("<div id='textToCopy' style='margin: 0 auto;'>")
			.dialog(openingOptions);
	
		this.bibTexDialog.dialog({ 
			modal: true,
			buttons: [{ 
				id: "copyToClipboardButton",
				title: "Copy to clipboard",
				text: buttontText,
				click: function(event) { 
					event.stopPropagation();
					//$(this).dialog("close"); 
				} 
			}] 
		});
		$("#copyToClipboardButton").wrap("<div id='copyToClipboardButtonContainer' style='position: relative;'>");
		
		var copyToClipboardButton = $('#copyToClipboardButton');
		copyToClipboardButton.parent().click(function() {
			  copyToClipboardButton.click();
		});


		this.openWith = function(textToCopy) {
			/*
			if(this.clip) {
				alert("the clip exists");
				clip.destroy();	
			}
		*/ //this is not working (the cleaning up)!
			
				
		  this.clip = new ZeroClipboard.Client();
		  this.clip.setText(textToCopy);
		  $('#textToCopy').html(textToCopy);
		  this.bibTexDialog.dialog('open');
		  this.clip.glue('copyToClipboardButton', 'copyToClipboardButtonContainer');
		  $('#copyToClipboardButtonContainer').children().last().css("z-index", "3000");
		}
	}

})(jQuery);
