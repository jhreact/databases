var sanitizeString = function (s) {
  if (s){
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  }
}

var app = {
  init: function(){
    this.server = "http://127.0.0.1:8080/classes/chatterbox";
    this.username = prompt(('What is your name?') || 'anonymous');
    this.rooom = 'lobby';
    this.friendNames = [];
    app.updateMessages();

    $("#send .submit").on('click', function(e){
      e.preventDefault();
      app.handleSubmit();
    });
    $("#clearFriends").on('click', function(e){
      e.preventDefault();
      $('#friendsList').empty();
    });
  },
  send: function(message){
    $.ajax({
      url: app.server,
      type: "POST",
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function(data){
        app.updateMessages();
      },
      error: function(data){
        console.log("not success");
      }
    });
  },
  updateMessages: function(){
    $.ajax({
      url: app.server,
     // data: { order: '-createdAt'},
      type: "GET",
      contentType: 'application/json',
      success: function(data){
        app.clearMessages();
        var messages = data.results;
        for (var i = 0; i < messages.length; i++){
          console.log(messages[i]);
          app.addMessage(messages[i]);
        }

      },
      error: function(data){
        console.log("failed retrieving messages");
      }
    });
    setTimeout(app.updateMessages, 1000);
  },

  clearMessages: function(){
    $("#chats").empty();
  },

  addMessage: function(message){
    // Making every message before we append it to the DOM the id of the messages username
    // Check if user is in friends list before apending, if it is in friends list apply bold style
    console.log("YO, here's the message:");
    console.log(message);
    var messageUsername = $("<span>", {class: 'username ' + sanitizeString(message.username)}).text(sanitizeString(message.username));
    messageUsername.on('click', function(){
      var friendName = this.innerHTML;
      this.friendNames.push(friendName);
      app.addFriend(friendName);
      $('.'+friendName).css('font-weight', 'bold');  //Apply css style to message from friends
    });
    var messageText = $("<span>", {class: 'usertext'}).text(sanitizeString(message.text));
    var messageHTML = $("<li>").append(messageUsername, ': ', messageText);
    $("#chats").append(messageHTML);

    if ($.inArray(sanitizeString(message.username), this.friendNames)){
      $('.'+friendName).css('font-weight', 'bold');  //Apply css style to message from friends
    }

  },

  addRoom: function(room){
    $('#roomSelect').append("<li>"+room+"</li>");
  },

  addFriend: function(username){
    $('#friendsList').append("<li>"+username+"</li>");
  },


  handleSubmit: function(){
   var messageText = $('#message').val();
   $("#message").val('');
   var message = {
    'username': this.username,
    'text': messageText,
    'roomname': this.room
   };
   app.send(message);
  },
};


