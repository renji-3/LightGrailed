$(function() {

  $(".favproduct").on("click", function(event) {
    event.preventDefault();
    console.log("it's working")

    if ($(this).hasClass("far")) {
      $(this).addClass("fas").css("color", "red");
      $(this).removeClass("far");

      $.ajax({
        url: "/favourites",
        method: "POST",
        data: `product_id=${$(this).attr('id')}`,
      })

    } else {
      $(this).addClass("far").css("color", "black")
      $(this).removeClass("fas");

      $.ajax({
        url: "/favourites/delete",
        method: "DELETE",
        data: `product_id=${$(this).attr('id')}`,
      })

    }
  });

});
