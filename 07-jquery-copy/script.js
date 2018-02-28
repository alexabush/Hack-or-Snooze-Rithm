$('form').hide();
$(function() {
  $('#submit-nav').on('click', function() {
    if (localStorage.getItem('token') === null) return;
    $('#form__submit').slideDown(1000);
  });

  $('#nav__signin').on('click', function() {
    $('#form__signin').slideDown(1000);
  });

  $('#nav__signup').on('click', function() {
    $('#form__signup').slideDown(1000);
  });

  $('#nav__logout').on('click', function() {
    logOutUser();
    setWelcomeText();
    $('#nav__signin').removeClass('dont-display');
    $('#nav__signup').removeClass('dont-display');
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
    var titleVal = $('#title').val();
    var url = $('#url').val();
    var author = $('#author').val();
    addStory(getUsername(), titleVal, author, url).then(function(res) {
      $formSub.trigger('reset');
      $formSub.slideUp(1000);
    });
  });

  var $formSignin = $('#form__signin');
  $($formSignin).on('submit', function() {
    event.preventDefault();
    var username = $('#username').val();
    var password = $('#password').val();
    login(username, password).then(function(res) {
      localStorage.setItem('token', res.data.token);
      $formSignin.trigger('reset');
      $formSignin.slideUp(1000);
      setWelcomeText(username);
      $('#nav__signin').addClass('dont-display');
      $('#nav__signup').addClass('dont-display');
      $('#nav__logout').removeClass('dont-display');
    });
  });

  var $formSignUp = $('#form__signup');
  $($formSignUp).on('submit', function() {
    event.preventDefault();
    var name = $('#name__signup').val();
    var username = $('#username__signup').val();
    var password = $('#password__signup').val();
    debugger;
    signUpUser(name, username, password)
      .then(function(res) {
        return login(username, password);
      })
      .then(function(res) {
        localStorage.setItem('token', res.data.token);
        $formSignUp.trigger('reset');
        //slide up isn't working, not sure why not
        $formSignUp.slideUp(1000);
        setWelcomeText(username);
        $('#nav__signin').addClass('dont-display');
        $('#nav__signup').addClass('dont-display');
        $('#nav__logout').removeClass('dont-display');
      });
  });

  function appendArticle(title, url, author, username, storyId) {
    var $newArticle = $('<li>', {
      html: `
      <span>
        <i class="far fa-star fa-sm" style="color:lightgrey"></i>
      </span>
      ${title} 
      <span>
        <a href="${url}" target="_blank" class="text-muted">&nbsp;(${url})</a>
      </span>
      <p>
        Posted By: ${username}
        <!-- Author: ${author} -->
      </p>
      <span id='storyId' class='dont-display'>
        ${storyId}
      </span>
    `
    });
    $('ol').append($newArticle);
  }

  $('ol').on('click', '.fa-star', function(event) {
    var storyId = $(event.target)
      .closest('li')
      .find('#storyId')
      .text()
      .trim();
    addFavoriteStory(getUsername(), storyId).then(function(res) {
      $(event.target).toggleClass('far fa-star fas fa-star');
      $(event.target)
        .closest('li')
        .toggleClass('favorite');
    });
  });

  /* AJAX BUSINESSS */
  /*##################################*/
  (function mainExecution() {
    getStories().then(function(stories) {
      const data = stories.data;
      data.slice(34).forEach(function(story) {
        appendArticle(
          story.title,
          story.url,
          story.author,
          story.username,
          story.storyId
        );
        //can be updated to get more info
      });
    });
  })();

  /*POPULATE STORIES FOR NON LOGGED IN USER*/
  function getStories() {
    return $.getJSON('https://hack-or-snooze.herokuapp.com/stories');
  }

  /*CREATE NEW USER ACCOUNT*/
  function signUpUser(name, username, password) {
    // debugger;
    return $.ajax({
      method: 'POST',
      url: 'https://hack-or-snooze.herokuapp.com/users',
      data: {
        data: {
          name,
          username,
          password
        }
      }
    });
    // .then(function(res) {
    //   return login(username, password);
    // })
    // .then(function(res) {
    //   localStorage.setItem('token', res.data.token);
    //   // debugger;
    //   // return getUserInfo(username);
    // });
    // .then(function(res) {
    //   return getUserList();
    // });
    // .then(function(res) {
    //   // debugger;
    //   console.log(res);
    // });
  }
});

/*LOGIN EXISTING USER*/
function login(username, password) {
  // debugger;
  return $.ajax({
    method: 'POST',
    url: 'https://hack-or-snooze.herokuapp.com/auth',
    data: {
      data: {
        username,
        password
      }
    }
  });
}

/*Set Welcome Text*/
function setWelcomeText(username) {
  if (username === undefined) $('#welcome-text').addClass('dont-display');
  else {
    $('#welcome-text').removeClass('dont-display');
    $('#welcome-text').text(`Welcome ${username}`);
  }
}

/*Get Individual User Document*/
function getUserInfo(username) {
  // debugger;
  var token = localStorage.getItem('token');
  return $.ajax({
    method: 'GET',
    url: `https://hack-or-snooze.herokuapp.com/users/${username}`,
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

/*ADD STORY TO LOGGED IN USER*/
function addStory(username, title, author, url) {
  // debugger;
  let token = localStorage.getItem('token');
  return $.ajax({
    method: 'POST',
    url: 'https://hack-or-snooze.herokuapp.com/stories',
    headers: {
      Authorization: `Bearer ${token}`
    },
    data: {
      data: {
        username,
        title,
        author,
        url
      }
    }
  });
}

function getUserList() {
  // debugger;
  let token = localStorage.getItem('token');
  return $.ajax({
    url: 'https://hack-or-snooze.herokuapp.com/users',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

function getUsername() {
  var token = localStorage.getItem('token');
  return JSON.parse(atob(token.split('.')[1])).username;
}

function addFavoriteStory(username, storyId) {
  debugger;
  let token = localStorage.getItem('token');
  return $.ajax({
    method: 'POST',
    url: `https://hack-or-snooze.herokuapp.com/users/${username}/favorites/${storyId}`,
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}
// function getUser(username) {
//   let token = localStorage.getItem('token');
//   return $.ajax({
//     url: 'https://hackorsnoozeapi.herokuapp.com/users/' + username,
//     headers: {
//       Authorization: `Bearer ${token}`
//     }
//   }).then(function(data) {
//     console.log(data);
//   });
// }

// function getStory() {
//   var token = localStorage.getItem('token');
//   return $.ajax({
//     method: 'POST',
//     url: 'https://hack-or-snooze.herokuapp.com/stories',
//     headers: {
//       Authorization: `Bearer ${token}`
//     },
//     data: {
//       data: {
//         title: 'myTitle',
//         author: 'Test',
//         username: 'testingagain',
//         url: 'https://www.myRandomUrl.com'
//       }
//     }
//   });
// }

/* 
LOG OUT
*/

function logOutUser() {
  localStorage.clear();
}
