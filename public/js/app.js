$(document).on("click", ".card-title", function () {
    $(".comments").empty();
    let thisId = $(this).data("id");
    const $comments = $(`#${thisId}`);
    $.ajax({
        method: "GET",
        url: `/articles/${thisId}`
    }).then(data => {
        console.log(data);
        newCommentCard($comments, data, thisId);
        if (data.comment) {
            $("#titleInput").val(data.comment.title);
            $("#bodyInput").val(data.comment.body);
        }
    })
});

$(document).on("click", "#saveComment", function () {
    let thisId = $(this).data("id");
    $.ajax({
        method: "POST",
        url: `/articles/${thisId}`,
        data: {
            title: $("#titleInput").val().trim(),
            body: $("#bodyInput").val().trim()
        }
    }).then(data => {
        console.log(data);
    })
    $("#titleinput").val("");
    $("#bodyinput").val("");
});


const newCommentCard = (e, data, id) => {
    let card = $(`<div class="card mt-3"></div>`);
    let body = $(`<div class="card-body"></div>`)
    let title = $(`<span id="titleInput" class="card-title" data-id="${id}">${data.headline}</span>`)
    let text = $(`<p class="card-text"></p>`).html(`
        <div class="form-group">
        <label for="comment">Enter comment</label>
        <textarea class="form-control" id="bodyInput"></textarea>
        </div`)
    let btn = $(`<button class="btn btn-secondary btn-sm" data-id="${id}" id="saveComment">Save Comment</button>`)
    body.append(title, text, btn);
    card.append(body);
    e.append(card);
};