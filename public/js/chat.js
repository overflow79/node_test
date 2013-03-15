//Create a chat module to use.
(function () {
  window.Chat = {
    socket : 'http://10.2.8.131/',
  
    initialize : function(socketURL) {
      this.socket = io.connect(socketURL);

      //Send message on button click or enter
      $('#send').click(function() {
        Chat.send();
      });

      $('#message').keyup(function(evt) {
        if ((evt.keyCode || evt.which) == 13) {
          Chat.send();
          return false;
        }
      });

      //Process any incoming messages
      this.socket.on('new', this.add);

      this.socket.on('connect', function() {
        console.log('누군가 들어옴');
      });
      this.socket.on('disconnect', function() {
        console.log('누군가 떠남');
      });
    },


    //Adds a new message to the chat.
    add : function(data) {
      var name = data.name || 'anonymous';
      if ($('#name').val() != name)
         var msg = $('<div class="msg"></div>').append('<div class="name">' + name + '</div>');
      else
         var msg = $('<div class="msg mine"></div>');

      if ($('#name').val() == name)
        msg.append('<div class="text right">' + data.msg + '</div>');
      else
        msg.append('<div class="text left">' + data.msg + '</div>');

      $('#messages')
        .append(msg)
        .animate({scrollTop: $('#messages').prop('scrollHeight')}, 0);
    },
 
    //Sends a message to the server,
    //then clears it from the textarea
    send : function() {
      if (!$('#name').val() || !$('#message').val())
        return false;
      this.socket.emit('msg', {
        name: $('#name').val() ? $('#name').val() : '?',
        msg: $('#message').val()
      });

      $('#message').val('');

      return false;
    }
  };
}());
