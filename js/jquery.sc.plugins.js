
(function($) {
	
	$.fn.highlight = function(callback) {
		var bc = this.css('backgroundColor');
		this.animate({ backgroundColor: '#B2E2DA' }, 500);
		return this.animate({ backgroundColor: bc }, {
			'duration': 500,
			'complete': callback
		});
	};
	
	$.fn.sc_duplicate = function() {
		return this.after(this.sc_cloneChangingId());
	}

	$.fn.sc_cloneChangingId = function() {
		var idTag = "id";
		return this.clone().attr(idTag, this.attr(idTag)+'_cloned');
	}
	
	//found somewhere in Internet ...
	// VERTICALLY ALIGN FUNCTION
	$.fn.vAlign = function() {
		return this.each(function(i){
		var ah = $(this).height();
		var ph = $(this).parent().height();
		var mh = (ph - ah) / 2;
		//$(this).css('margin-top', mh);
		$(this).css('padding-top', mh);
		});
	};

	//adapted from above
	// HORIZONTAL ALIGN FUNCTION
	$.fn.hAlign = function() {
		return this.each(function(i){
		var ah = $(this).width();
		var ph = $(this).parent().width();
		var mh = (ph - ah) / 2;
		$(this).css('left', mh);
		});
	};
	
	$.fn.alignBoth = function() {
		return this.hAlign().vAlign();;
	}

})(jQuery);


