$(function() {

	var newSelection = "";
	
	$("#eps-nav a").click(function(){
	
		$("#eps-nav a").removeClass("current");
		$(this).addClass("current");
		
		newSelection = $(this).attr("rel");
		
		$(".ep").not("."+newSelection).slideUp();
		$("."+newSelection).slideDown();
		
	});
	
});