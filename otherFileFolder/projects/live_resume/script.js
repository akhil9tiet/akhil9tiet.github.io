$(document).ready(function() {
    $(".tile").height($("#name").width());
    $(".carousel").height($("#name").width());
     $(".item").height($("#name").width());
     
    $(window).resize(function() {
    if(this.resizeTO) clearTimeout(this.resizeTO);
	this.resizeTO = setTimeout(function() {
		$(this).trigger('resizeEnd');
	}, 10);
    });
    
    $(window).bind('resizeEnd', function() {
    	$(".tile").height($("#name").width());
        $(".carousel").height($("#name").width());
        $(".item").height($("#name").width());
    });

});