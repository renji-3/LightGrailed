$(function() {

  $("#sold").on("submit", function(event) {
    event.preventDefault();
    console.log("it's working")

    $(".product-img").css({"opacity": ".35"})

    $.ajax({
      url: "/products/sold/:id",
      method: "POST",
      data: `product_id=${$(".mark-sold").attr('id')}`
    })

  })

});
