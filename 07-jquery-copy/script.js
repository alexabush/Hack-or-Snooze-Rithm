$("form").hide();
$(function() {
  $("#submit-nav").on("click", function() {
    $($form).slideDown(1000);
  });

  $("#fav-nav").on("click", function() {
    //debugger;
    event.preventDefault();
    var $favNavTitle = $(this);
    if ($favNavTitle.text() == $favNavTitle.data("text-swap")) {
      $favNavTitle.text($favNavTitle.data("text-original"));
    } else {
      $favNavTitle.data("text-original", $favNavTitle.text());
      $favNavTitle.text($favNavTitle.data("text-swap"));
    }
    $("li:not(.favorite)").toggleClass("dont-display");
  });

  var $form = $("form");
  $($form).on("submit", function() {
    event.preventDefault();
    var $titleVal = $("#title").val();
    var $url = $("#url").val();
    var $urlSplit = $url.split("/");
    var $hostUrl = $urlSplit[2];

    var $newArticle = $("<li>", {
      html: `
      <span><i class="far fa-star fa-sm" style="color:lightgrey"></i>
      </span>
      ${$titleVal} <span><a href="${$url}" target="_blank" class="text-muted">&nbsp;(${$hostUrl})</a>
    `
    });
    $("ol").append($newArticle);
    $form.trigger("reset");
    $form.slideUp(1000);
  });

  $("ol").on("click", ".fa-star", function(event) {
    $(event.target).toggleClass("far fa-star fas fa-star");

    $(event.target)
      .closest("li")
      .toggleClass("favorite");
  });
});
