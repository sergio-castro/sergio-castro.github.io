

(function ($) {

	$.configurePublications = function(allPublicationsId, publicationsDistribution) {
		var bibTex = $('#'+allPublicationsId).find('.BibTex');
		
		for (var i = 0; i < publicationsDistribution.length; i++) {
			var entry = publicationsDistribution[i];
		    addAllBibTexWithTypeTo(bibTex, entry.publicationType, entry.target);
		}
		
		newBibTexDialog();
		$('.bibTexIcon').click(function(){ 
			openBibTexDialog($(this).next().next().find('.BibTex').html()); //Change this. It is imperatively stated how to arrive to the description node. VERY WEAK INDEED. (the image is a sibling of the description node, located to nodes after ...)
		});
		
		$(".abstractLabel").click(function() {
			$(this).next().slideToggle("slow");	
		});
	}
		
	function publicationType(bibTex) {
		return (bibTex.match(/\s*\@(\w+)\{/)[1]).toLowerCase();
	}
	
	function bibTexIs(bibTex, aPublicationType) {
		return (publicationType(bibTex)) == aPublicationType;
	}
	
	function bibTexEntryNodes(bibTex) {
		var pubDetails = $(bibTex).closest('.Pub');
		var pubTitle = pubDetails.prev();
	

		return formatBibTexEntryNodes(pubTitle.add(pubDetails));
	}
	
	function parseBibTex(text) {
		window.warning = '';
		var bibTex = new BibTex();
		bibTex.content = text;
		try {
			bibTex.parse();
		} catch(e) {
			throw e;
		}
		return bibTex;
	}
	
	
	function formatBibTexEntryNodes(bibTexEntryNodes) {
		var publicationsWithPDF = ['article', 'conference','inproceedings', 'techreport', 'mastersthesis'];
		
		bibTexEntryNodes.remove();
		var descriptionNode = $(bibTexEntryNodes.get(0)).css("float", "left");
		var contentNode = $(bibTexEntryNodes.get(1));
		var formattedNodes =  descriptionNode;
		
		var bibTexNode = contentNode.find('.BibTex');
	
	
		var bibtexData = parseBibTex(bibTexNode.html()).data[0];

		var aPublicationType = bibtexData['entryType'];
	
		if ( $.inArray(aPublicationType, publicationsWithPDF) != -1 ) {
			
			var fileName = bibtexData['cite'] + '.pdf';
			//alert(fileName);
			formattedNodes = formattedNodes.add("<a href='files/publications/"+fileName+"'><img src='img/pdf.gif' class='im publicationIcon pdfIcon' title='Download publication' alt='PDF' longdesc='PDF' style='float: right' /></a>");
		}
		
		formattedNodes = formattedNodes.add("<img src='img/bibtex-text-x-icone-5790-32.png' class='im publicationIcon bibTexIcon' title='BibTex' alt='BibTex' style='float: right'>");
		
		formattedNodes =  formattedNodes.add("<div class='clearfloat'>");
		
		//adding the abstract if any
		var abstract = bibtexData['abstract'];
		if(abstract) {
			contentNode.append("<div class='abstractLabel' title='click me to read the abstract'>Abstract</div><div class='abstractContent'>"+abstract+"</div>");
		}
		
		formattedNodes =  formattedNodes.add(contentNode);
		
		return formattedNodes;
	}
	
	
	function addAllBibTexWithTypeTo(allBibTex, type, to) {
		var filtered = allBibTex.filter(function() {
			return bibTexIs(this.innerHTML, type);
		});
		var list = $('<dl>');
		filtered.each(function() {
			//addBibTexTo(this, to);
			list.append(bibTexEntryNodes(this));
		});
		$('#'+to).append(list);
	}
	
	
	
	

	function newBibTexDialog() {
		$.bibTexDialog = $.newCopyToClipboardDialog({
			autoOpen: false,
			title: 'BibTex',
			width: 400,
			height: 400
		},{
			moviePath: 'js/ZeroClipboard10.swf'
		});
	}
	
	function openBibTexDialog(text) {
		//alert($.bibTexDialog);
		$.bibTexDialog.openWith(text);
	}
	
	
})(jQuery);
