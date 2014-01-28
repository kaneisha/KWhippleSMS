var users = '';
var chatRef = new Firebase('https://cheernation.firebaseio.com');
var auth = new FirebaseSimpleLogin(chatRef, function(error, user){
	if(error){
		console.log(error)
	}else if(user){
		users = user;

		loggedIn();
	}else{
		$('#git').click(function(){
			auth.login('github');
		});

		$('#twitter').click(function(){
			auth.login('twitter');
		});

		$('#logout').hide();
	}
});

$('#logout').click(function() {
        auth.logout();
        $('#buttons').show();
        $('nav p').hide();
});

var loggedIn = function(){
	console.log('user');
	if(users.provider === 'twitter'){
		image = users.profile_image_url;
		console.log(users.profile_image_url);
	}
	if(users.provider === 'github'){
		image = users.avatar_url;
	}
	$('#buttons').hide();
	$('#logout').show();
	$('nav p').html('Welcome, ' + users.username);

};

$('#submit').on('click', function(){
	var comment = $('#comments_input').val();
	var user_comment = users.username;

	if(users.provider === 'twitter'){
		var avi = users.profile_image_url;
	}
	if(users.provider === 'github'){
		var avi = users.avatar_url;
	}

	if(users != '' && comment != ''){
		chatRef.push({
			name: user_comment,
			text: comment,
			image: avi
		});
		$('#comments_input').val('');
		console.log('hey');
	}

});

chatRef.on('child_added', function(snapshot){
	var message = snapshot.val();
	//displayChatMessage(message.comment, message.user_comment, message.avi);

	console.log(message.image);

	$('#comments').append('<div id="username"> <img src="' + message.image + '">' + '<h1 id="user">' + message.name + '</div>' + '<p>' + message.text + '</p>' );

	//$('#comment_contain')[0].scrollTop = $('#comment_contain')[0].scrollHeight;
});

	// function displayChatMessage(comment,user_comment,avi){
	// //$('#comments').append('<img src="' + chat.avi + '">');
	// $('#comments').append('<div id="username"> <h1 id="user">' + user_comment + '</div>' + '<p>' + comment + '</p>' );
	// //$('#user_comment').html(comment);
	// console.log('comments: ' + comment);
	// console.log('go');
	//  };






//--------------------------------- Video Player --------------------------------------//

$("#vol").css("display","none");
$('#volume').on('mouseover', function(){
	$("#vol").css("display","block");
});

$('#volume').on('mouseout', function(){
	$("#vol").css("display","none");
});

$('#vol').on('mouseover', function(){
	$("#vol").css("display","block");
});

$('#vol').on('mouseout', function(){
	$("#vol").css("display","none");
});


var camClick = false;
var showCam = false;
var cameraPick = 0;
var vidDuration = 0;
var camConnect = false;
var micClick = false;
var showMic = false;
var micPick = 0;
var recorder = false;
var playing = false;
var recording = false;
var rec_tog = false;
var camTog = false;
var xPos = 0;
var userMove = false;

	var flashReady = function(){
		
		// flash. is a global object

		var tog = false;
		var play = false;
		var moving = true;
		var duration = 0;

         $('#play').click(function(){


 			if(!play){
 				playing = true;
 				flash.connect('rtmp://localhost/SMSServer');
 				// flash.playPause()
 				play = true;
 			}else{
 				// flash.connect('rtmp://localhost/SMSServer');
 				flash.playPause()
 			}

 			if(!tog){
 				$('#play').attr('src', 'images/pause.png');
 				$('#play').css('margin-top', '-3px');
 				tog = true;
 				play = true;
 			}else{
 				$('#play').attr('src', 'images/play.png');
 				$('#play').css('margin-top', '-13px');
 				tog = false;
 			};

        });     

        $("#cam").on('click', function(){
        // $("#microphone").css('margin-left', '-125px');
        // $("#play").css('margin-left', '-180px');
        $("#play").css('margin-left', '-230px');
        $("#cam").css('margin-left', '-150px');
        $("#bar").css('position', 'absolute');
        $("#bar").css('top', '448px');
        $("#bar").css('left', '700px');
         $("#ball").css('z-index', '1');
        $("#ball").css('position', 'absolute');



            camClick = true;


           if(camConnect){
                flash.connect('rtmp://localhost/SMSServer');
            }
            else{
            	showCam = true;
                cameraOps();
                
            };

        }); 

        $("#microphone").on('mouseover', function(){
        // $("#microphone").css('margin-left', '-130px');
        //$("#play").css('margin-left', '-270px');
        //$("#cam").css('margin-left', '-150px');
        $("#bar").css('position', 'absolute');
        $("#bar").css('top', '448px');
        $("#bar").css('left', '700px');
        $("#ball").css('z-index', '1');
        $("#ball").css('position', 'absolute');
        $(".micro_menu li").css('background-color', '#b1b1b1;')
            micClick = true;

           if(camConnect){
                flash.connect('rtmp://localhost/SMSServer');
            }else{
            	showMic = true;
                micOps();
            };

        }); 

        $("#microphone").on('mouseout', function(){
        	$(".micro_menu li").hide();
        });
        $(".micro_menu li").on('mouseover', function(){
        	$(".micro_menu li").css("display", "block");
        });

       $("#rec").on('click', function(){
       		playing = false;
       		if(!camConnect){
       			flash.connect('rtmp://localhost/SMSServer');
       		}else{
       			videoRecord();
       		}

       })

        var vol = $('#volume');
        $('#vol').on('change', function() {

        		vol.val(flash.getVolume());
                var vidVolume = $(this).val() / 100;

                flash.setVolume(vidVolume);

        });


     };

  	var connected = function(success,error){
			console.log(success);

			var play;

			if(success == true){
				console.log('connected', success);
				//flash.startPlaying('hobbit_vp6.flv');
				// play = true;

				if(!playing){
					//flash.startRecording('work', cameraPick, micPick);
					recording = false;
					videoRecord();
				}else{
					flash.startPlaying('hobbit_vp6.flv');
					play = true;
				}

			}else{
				console.log(error);
				 }


		};


	var seekTime = function(time){
		var seek = time;
		//var duration = 10;
		var moving = true;
		
		xPos = (seek / vidDuration) * 276;
		// if(moving){
		// 
		// 	//$('#ball').css('left', xPos + 680);
		// 	$('#ball').offset({left: xPos + 730});
			
		// };

		if(!userMove){
			//Gets position of video ansd moves scrubber 
			$('#ball').offset({left: $('#bar').offset().left + xPos + 15});
		}
	};

	$('#ball').on('mousedown', function(e){
		userMove = true;
		seekMover();
		e.preventDefault();
	
	});
	$(document).on('mouseup', function(e){
		userMove = false;
	});

	function seekMover(){
		
		$(document).on('mousemove', function(e){
			var new_time = ((e.pageX - $('#bar').offset().left) / 276) * vidDuration;
			if(userMove){
				$('#ball').offset({left: e.pageX});

				flash.setTime(new_time);
			}
			e.preventDefault();
		});
	};

			
	var getDuration = function(duration){
		//var vidDuration = duration;
		vidDuration = duration
	};

	var recordingError = function(message,code){

	};

	var globalError = function(message){

	};

	var cameraOps = function(){
		var cams = flash.getCameras();
		console.log(cams);

		if(showCam){
			for(var i = 0, max = cams.length; i < max; i++){
				$('ul#camera').append('<li data-id="'+i+'"><a>' + cams[i] + '</a></li>');
				console.log(cameraPick);
			}

			//showCam = true;
		}

		$(".micro_menu li").on('click', function(){
        	//e.preventDefault();
        	cameraPick = $(this).attr("data-id");
        	console.log(cameraPick);
        });

	}

	var micOps = function(){
		var mics = flash.getMicrophones();
		console.log(mics);

		if(showMic){
			for(var i = 0, max = mics.length; i < max; i++){
				$('ul#mic').append('<li id="'+i+'">' + mics[i] + '</li>');
				console.log("hi");

			}

			//showMic = true;
		}

		$(".micro_menu li").on('click', function(){
        	micPick = $(this).attr("id");
        	console.log(micPick);
        });

	}

	var videoRecord = function(){

		console.log('recording',recording);
		if(recording == false){
			flash.startRecording('work', cameraPick, micPick);
			recording = true;
			console.log(recording);
		}else{
			flash.stopRecording();
			//$('#rec').empty();
			recording = false;
			console.log('stop recording',recording);
		}

		if(!rec_tog){
 				$('#rec').attr('src', 'images/rec_stop.png');
 				rec_tog = true;
 			}else{
 				$('#rec').attr('src', 'images/rec.png');
 				rec_tog = false;
 				flash.stopRecording();
 				// $('#rec').empty();
 				recording = false;
 				console.log('stop recording plz',recording);
 			};

	}
