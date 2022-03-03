$(function() {

  $("#scroll-top").on("click", function(event) {
    event.preventDefault();
    console.log("it's working")

    $("html, body").animate({scrollTop: 0}, 1000);
  });

});
