$('#volume').click(function(){
	$("#vol").css("display","block");
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

	var flashReady = function(){
		
		// flash. is a global object

		var tog = false;
		var play = false;
		var moving = true;
		var duration = 0;

         $('#play').click(function(){

         	console.log('click this button');

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
        $("#microphone").css('margin-left', '-125px');
        $("#play").css('margin-left', '-180px');
        $("#cam").css('margin-left', '-190px');

            camClick = true;


           if(camConnect){
                flash.connect('rtmp://localhost/SMSServer');
            }
            else{
            	showCam = true;
                cameraOps();
                
            };

        }); 

        $("#microphone").on('click', function(){
        $("#microphone").css('margin-left', '-130px');
        $(".micro_menu li").css('background-color', '#b1b1b1;')
            micClick = true;

           if(camConnect){
                flash.connect('rtmp://localhost/SMSServer');
            }else{
            	showMic = true;
                micOps();
            };

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
        $('#volume').on('change', function() {

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

		if(moving){
			xPos = (seek / vidDuration) * 276;
			$('#ball').css('left', xPos + 680);
			
		}
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
				$('.micro_menu').append('<li data-id="'+i+'">' + cams[i] + '</li>');
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
				$('.micro_menu').append('<li id="'+i+'">' + mics[i] + '</li>');
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
			console.log("hi");
		}else{
			flash.stopRecording();
			//$('#rec').empty();
			recording = false;
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
 			};

	}
