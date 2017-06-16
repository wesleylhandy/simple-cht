$(document).ready(function () {
  let usersOnline = [];
  let socket = io();
  let userName = '';

  function createTimeStamp(time) {
    //break up js date into time components
    let seconds = time.getSeconds();
    let minutes = time.getMinutes();
    let hours = time.getHours();
    let day = time.getDate();
    let month = time.getMonth();
    let year = time.getFullYear();
    //create function to add zero to single-digit integers
    function addZero(int) {
      return "0" + int;
    }

    if(seconds < 10) seconds = addZero(seconds);
    if(minutes < 10) minutes = addZero(minutes);
    if(hours<10) hours = addZero(hours);
    if(day<10) day = addZero(day);
    if(month<10) month = addZero(month);

    return `${month}/${day}/${year} ${hours}:${minutes}:${seconds}`
  }

  $('form#username-input').submit(function(e){
    e.preventDefault();
    let now = new Date();
    let timeStamp = createTimeStamp(now);
    userName = $("#n").val();

    //future: username validation. keep track of all users in the room and don't allow duplicates

    socket.emit('chat message', JSON.stringify({message: `${userName} just joined the chat`, timeStamp:timeStamp, user: userName}));

    socket.emit('new user', userName);
    
    $('.modal').hide();
    $('.welcome').show();
     var options = {
        strings: [`Welcome ^200 ${userName}`, 'to', "S1mpl3 Ch@t", `Ch@tt1ng 4s '${userName}'`],
        showCursor: false,
        typeSpeed: 2
    }
    $("#title").typed(options);
    $("#n").val('');

  })


  $('form#message-input').submit(function(e){
    e.preventDefault();
    let now = new Date();
    let timeStamp = createTimeStamp(now);

    socket.emit('chat message', JSON.stringify({message: $('#m').val(), timeStamp: timeStamp, user: userName}));

    $('#m').val('');
  });

  //future - create User Object to store color

  socket.on('chat message', function(msg){
    msg = JSON.parse(msg);
    console.log(msg);
    let textDirection = msg.user === userName ? 'flex-end' : 'flex-start';
    let user = msg.user === userName ? 'You' : msg.user;

    $('.messages').prepend($("<li>").css('align-items', textDirection)
      .html(`<span class='message'>${msg.message}</span>
              <span class='msg-data'>
                <span class='user'>${user} -&nbsp</span>
                <span class='timestamp'>${msg.timeStamp}</span>
              </span>`));
  });

  socket.on('user added', function(num) {
    updateUsersOnline(num);
  })

  socket.on('user left', function(num) {
    updateUsersOnline(num);
  });

  socket.on('users online', function(num){
    updateUsersOnline(num);
  })  

  function updateUsersOnline(num) {
    console.log(num);
    $(".online").text(num);
  }
});