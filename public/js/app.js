$(document).on("click", "#showCommentInput", function() {
  let thisId = $(this).attr("data-id");
  let e = $(this);

  $.ajax({
    method: "GET",
    url: `/articles/${thisId}`
  }).then(function(data) {
    data = data[0];
    console.log(data);
    e
      .parent()
      .parent()
      .parent()
      .parent()
      .find("span").html(`
      <div class="mt-3"><input id="titleInput" name="title" placeholder="Title"></div>
      <div class="mt-1"><textarea rows="3" cols="50" id="bodyInput" name="body" placeholder="Add comment"></textarea></div>
      <a class="mt-3 text-white btn btn-danger" data-id="${
        data._id
      }" id="saveComment">Add Comment</a>`);
  });
});

$(document).on("click", "#saveComment", function() {
  let thisId = $(this).attr("data-id");
  $.ajax({
    method: "POST",
    url: `/articles/${thisId}`,
    data: {
      title: $("#titleInput").val(),
      body: $("#bodyInput").val()
    }
  }).then(function(data) {
    console.log(data);
  });

  $("#bodyInput").val("");
  $("#titleInput").val("");

  location.reload();
});
