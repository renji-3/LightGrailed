$(function() {

  $("#message-form").on("submit", function(event) {
    event.preventDefault();
    console.log("it's working")

    $.ajax({
      url: "/messages",
      method: "POST",
      data: {message: $("#text-message").val(), product_id: $(".favproduct").attr('id')}
    })
    this.reset();
  })
});
