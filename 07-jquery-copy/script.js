$('form').hide();
$(function() {
  $('#submit-nav').on('click', function() {
    $('#form__submit').slideDown(1000);
  });

  $('#nav__signin').on('click', function() {
    $('#form__signin').slideDown(1000);
  });

  $('#nav__signup').on('click', function() {
    $('#form__signup').slideDown(1000);
  });

  $('#fav-nav').on('click', function() {
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

  var $formSub = $('#form__submit');
  $($formSub).on('submit', function() {
    event.preventDefault();
    var $titleVal = $('#title').val();
    var $url = $('#url').val();
    appendArticle($titleVal, $url);
    $formSub.trigger('reset');
    $formSub.slideUp(1000);
  });

  var $formSignin = $('#form__signin');
  $($formSignin).on('submit', function() {
    event.preventDefault();
    var $username = $('#username').val();
    var $password = $('#password').val();
    login($username, $password);
    $formSignin.trigger('reset');
    $formSignin.slideUp(1000);
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
    const data = stories.data;
    data.slice(34).forEach(function(story) {
      appendArticle(story.title, story.url);
    });
  });
});

/*
LOGIN AJAX
*/

function login(username, password) {
  $.ajax({
    method: 'POST',
    url: 'https://hack-or-snooze.herokuapp.com/auth',
    data: {
      data: {
        username: username,
        password: password
      }
    }
  }).then(function(data) {
    // debugger;
    // console.log(data);
    localStorage.setItem('token', data.data.token);
  });
}

// login().then(function(data) {
//   localStorage.setItem('token', data.data.token);
// });

function getStory() {
  var token = localStorage.getItem('token');
  return $.ajax({
    method: 'POST',
    url: 'https://hack-or-snooze.herokuapp.com/stories',
    headers: {
      Authorization: `Bearer ${token}`
    },
    data: {
      data: {
        title: 'myTitle',
        author: 'Test',
        username: 'testingagain',
        url: 'https://www.myRandomUrl.com'
      }
    }
  });
}

// getStory().then(function(data) {
//   console.log(data);
// });
