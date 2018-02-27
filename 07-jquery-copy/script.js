$('form').hide();
$(function() {
  $('#submit-nav').on('click', function() {
    $($form).slideDown(1000);
  });

  $('#fav-nav').on('click', function() {
    //debugger;
    event.preventDefault();
    var $favNavTitle = $(this);
    if ($favNavTitle.text() == $favNavTitle.data('text-swap')) {
      $favNavTitle.text($favNavTitle.data('text-original'));
    } else {
      $favNavTitle.data('text-original', $favNavTitle.text());
      $favNavTitle.text($favNavTitle.data('text-swap'));
    }
    $('li:not(.favorite)').toggleClass('dont-display');
  });

  var $form = $('form');
  $($form).on('submit', function() {
    event.preventDefault();
    var $titleVal = $('#title').val();
    var $url = $('#url').val();
    appendArticle($titleVal, $url);
    // var $urlSplit = $url.split('/');
    // var $hostUrl = $urlSplit[2];

    // var $newArticle = $('<li>', {
    //   html: `
    //   <span><i class="far fa-star fa-sm" style="color:lightgrey"></i>
    //   </span>
    //   ${$titleVal} <span><a href="${$url}" target="_blank" class="text-muted">&nbsp;(${$hostUrl})</a>
    // `
    $form.trigger('reset');
    $form.slideUp(1000);
  });

  function appendArticle(title, url) {
    var $newArticle = $('<li>', {
      html: `
      <span><i class="far fa-star fa-sm" style="color:lightgrey"></i>
      </span>
      ${title} <span><a href="${url}" target="_blank" class="text-muted">&nbsp;(${url})</a>
    `
    });
    $('ol').append($newArticle);
  }

  $('ol').on('click', '.fa-star', function(event) {
    $(event.target).toggleClass('far fa-star fas fa-star');

    $(event.target)
      .closest('li')
      .toggleClass('favorite');
  });

  /* AJAX FUNNY BUSINESSS */
  /*##################################*/

  // for (let i = 0; i < 10; i++) {
  //   getStory().then(function(data) {
  //     var title = data.data.title;
  //     var url = data.data.url;
  //     var author = data.data.author;
  //     var updatedAt = data.data.updatedAt;
  //     appendArticle(title, url);
  //     // console.log(title, url, author, updatedAt);
  //     // console.log(data);
  //   });
  // }

  function getStories() {
    return $.getJSON('https://hack-or-snooze.herokuapp.com/stories');
  }

  getStories().then(function(stories) {
    // debugger;
    const data = stories.data;
    const uniqueStories = [];

    // data.forEach(obj => {
    //   // if ()
    // });
    // stories.keys().forEach(key => {
    //   if (unique)
    // })

    data.slice(34).forEach(function(story) {
      appendArticle(story.title, story.url);
    });
  });
});
