
window.addEventListener('load', function() {
  var topics = ['food', 'transportation', 'more'];
  topics.forEach(function(topic) {
      var posts = JSON.parse(localStorage.getItem(topic + '-posts'));
      if (posts) {
          var messageContainer = document.getElementById(topic + '-messages');
          posts.forEach(function(post) {
              createPostElement(messageContainer, post);
              
          });
      }
      
  });
  
});

//Google Sign-In Auth
function onSignIn(googleUser) {
  var profile = googleUser.getBasicProfile();
  console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
  console.log('Name: ' + profile.getName());
  console.log('Image URL: ' + profile.getImageUrl());
  console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
  // Perform server-side authentication with the ID token.
}
function signOut() {
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    console.log('User signed out.');
  });
}

function createPostElement(container, post) {



  var newPost = document.createElement('div');
  newPost.classList.add('post');
  var username = "username"; // You can replace "User" with the actual username
  newPost.innerHTML = '<strong>' + username + '</strong>: ' + post.message;
  var replyInput = document.createElement('input');
  replyInput.type = 'text';
  replyInput.placeholder = 'Reply to this post...';
  var replyButton = document.createElement('button');
  replyButton.textContent = 'Reply';
  replyButton.onclick = function() {
      var replyText = replyInput.value;
      if (replyText.trim() === "") return; // Do not post empty replies
      createReplyElement(15, newPost, { message: replyInput.value });
  };
  
  newPost.appendChild(replyInput);
  newPost.appendChild(replyButton);

  
  container.appendChild(newPost);
  // Automatically delete post after 10 seconds
  setTimeout(function() {
      container.removeChild(newPost);
      // Remove post from local storage
      var topic = container.id.split('-')[0];
      var posts = JSON.parse(localStorage.getItem(topic + '-posts'));
      posts = posts.filter(function(p) {
          return p.message !== post.message;
      });
      localStorage.setItem(topic + '-posts', JSON.stringify(posts));
  }, 60000);
}

function createReplyElement(padding, container, reply) {
  //var padding = padding + 10; // Indentation (nested replies)
  var newReply = document.createElement('div');
  newReply.style.paddingLeft = padding + 'px';
  newReply.classList.add('reply');
  var username = "User"; // You can replace "User" with the actual username
  newReply.innerHTML = '<div class="reply-box">'+'<strong>' + username + '</strong>:' + reply.message + '</div>' ;
  var replyInput = document.createElement('input');
  replyInput.type = 'text';
  replyInput.placeholder = 'Reply to this comment...';
  newReply.appendChild(replyInput);
  var replyButton = document.createElement('button');
  replyButton.textContent = 'Reply';
  newReply.appendChild(replyButton);
  container.appendChild(newReply);
  
  
  replyButton.onclick = function() {
      var replyText = replyInput.value;
      if (replyText.trim() === "") return; // Do not post empty replies
          createReplyElement(padding, newReply, { message: replyInput.value }); //New Reply is the container
  };
  
}

function openPage(evt, pageName) {
  var i, pages, navLinks;
  pages = document.getElementsByClassName("chat-container");
  for (i = 0; i < pages.length; i++) {
      pages[i].style.display = "none";
  }
  navLinks = document.getElementsByClassName("navbar")[0].getElementsByTagName("a");
  for (i = 0; i < navLinks.length; i++) {
      navLinks[i].classList.remove("active");
  }
  document.getElementById(pageName).style.display = "block";
  evt.currentTarget.classList.add("active");
}

function openChat(evt, chatName) {
  var i, tabContent, tablinks;
  tabContent = document.getElementsByClassName("innerchat-container");
  for (i = 0; i < tabContent.length; i++) {
      tabContent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
      tablinks[i].classList.remove("active");
  }
  document.getElementById(chatName).style.display = "block";
  evt.currentTarget.classList.add("active");
}

function sendPost(chatName) {
  var inputElement = document.getElementById(chatName + "-input");
  var message = inputElement.value;
  if (message.trim() === "") return; // Do not post empty messages
  var messageContainer = document.getElementById(chatName + "-messages");
  createPostElement(messageContainer, { message: message });
  // Save posts to local storage
  var posts = JSON.parse(localStorage.getItem(chatName + '-posts')) || [];
  posts.push({ message: message });
  localStorage.setItem(chatName + '-posts', JSON.stringify(posts));
  inputElement.value = '';
  
}

document.getElementsByClassName("navbar")[0].getElementsByTagName("a")[0].click(); // Open Home page by default