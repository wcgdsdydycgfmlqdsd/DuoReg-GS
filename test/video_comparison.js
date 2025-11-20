	// Written by Lukas Radl, April 2024
	// Adapted from the following sources
	// Ref-NeRF     https://dorverbin.github.io/refnerf/
	// Reconfusion  https://reconfusion.github.io/
	// DICS         https://github.com/abelcabezaroman/definitive-image-comparison-slider
	var position = 0.25
	var leftButtonDown = false
	var strokeColor = "#FFFFFF44";
	var vidShow = 0;
	// var currentSceneFLIP = 'garden'; // This part is old and can be ignored
	// currentButtonFLIP = 'btn_flip0';
	// This changeFLIP block seems for a different functionality and can be ignored if not used.
	function changeFLIP(flip_t) {
	    document.getElementById(currentButtonFLIP).classList.remove('button-17-selected');
	    document.getElementById(currentButtonFLIP).classList.add('button-17');
	    currentButtonFLIP = 'btn_flip' + flip_t;
	    document.getElementById(currentButtonFLIP).classList.remove('button-17');
	    document.getElementById(currentButtonFLIP).classList.add('button-17-selected');
	    if (flip_t == 1){
	        vidShow = 0;
	    }
	    else if (flip_t == 7) {
	        vidShow = 1;
	    }
	    else {
	        vidShow = 2;
	    }
	}
	// --- START OF THE RELEVANT PART ---
	// !! MODIFY HERE: Set your default scene !!
	var currentSceneFLIP = 'horns';  // Match the default selected button in HTML 
	var currentMethodFLIP = '3DGS';
	function changeSceneFLIP(scene) {
	    var video = document.getElementById('flipvideo');
	    var sceneName = scene.toLowerCase();
	    var new_src = 'video/' + sceneName + '_' + currentMethodFLIP + '_video_loop.mp4';

	    console.log('changeSceneFLIP called with:', scene);
	    console.log('Current scene:', currentSceneFLIP);
	    console.log('New scene name:', sceneName);
	    console.log('Video path:', new_src);

	    if (currentSceneFLIP === sceneName) {
	        console.log('Same scene, returning');
	        return;
	    }

	    // Update button styles - remove old selection
	    var oldButton = document.getElementById('btn_' + currentSceneFLIP + '_flip');
	    if (oldButton) {
	        oldButton.classList.remove('button-17-selected');
	        oldButton.classList.add('button-17');
	        console.log('Removed selection from old button:', 'btn_' + currentSceneFLIP + '_flip');
	    } else {
	        console.log('Old button not found:', 'btn_' + currentSceneFLIP + '_flip');
	    }

	    // Update current scene
	    currentSceneFLIP = sceneName;

	    // Update button styles - add new selection
	    var newButton = document.getElementById('btn_' + currentSceneFLIP + '_flip');
	    if (newButton) {
	        newButton.classList.remove('button-17');
	        newButton.classList.add('button-17-selected');
	        console.log('Added selection to new button:', 'btn_' + currentSceneFLIP + '_flip');
	    } else {
	        console.log('New button not found:', 'btn_' + currentSceneFLIP + '_flip');
	    }

	    // Load new video
	    console.log('Loading video:', new_src);
	    video.src = new_src;
	    video.load(); // Explicitly load the new video
	}
	function changeMethodFLIP(method) {
	    console.log('changeMethodFLIP called with:', method);
	    console.log('Current method:', currentMethodFLIP);

	    if (currentMethodFLIP === method) {
	        console.log('Same method, returning');
	        return;
	    }

	    // Update button styles - remove old selection
	    var oldButton = document.getElementById('btn_' + currentMethodFLIP + '_method');
	    if (oldButton) {
	        oldButton.classList.remove('button-17-selected');
	        oldButton.classList.add('button-17');
	        console.log('Removed selection from old method button:', 'btn_' + currentMethodFLIP + '_method');
	    } else {
	        console.log('Old method button not found:', 'btn_' + currentMethodFLIP + '_method');
	    }

	    // Update current method
	    currentMethodFLIP = method;

	    // Update button styles - add new selection
	    var newButton = document.getElementById('btn_' + currentMethodFLIP + '_method');
	    if (newButton) {
	        newButton.classList.remove('button-17');
	        newButton.classList.add('button-17-selected');
	        console.log('Added selection to new method button:', 'btn_' + currentMethodFLIP + '_method');
	    } else {
	        console.log('New method button not found:', 'btn_' + currentMethodFLIP + '_method');
	    }

	    // Load new video
	    var video = document.getElementById('flipvideo');
	    var new_src = 'video/' + currentSceneFLIP + '_' + currentMethodFLIP + '_video_loop.mp4';
	    console.log('Loading method video:', new_src);
	    video.src = new_src;
	    video.load(); // Explicitly load the new video
	}
	function resizeAndPlay(element)
	{
	  var cv = document.getElementById(element.id + "Merge");
	  cv.width = element.videoWidth/2;
	  cv.height = element.videoHeight;
	  element.play();
	  element.style.height = "0px";  // Hide video without stopping it
	  playVids(element.id);
	}
	// --- END OF THE RELEVANT PART ---
	function playVids(videoId) {
	    var videoMerge = document.getElementById(videoId + "Merge");
	    var vid = document.getElementById(videoId);
	    var vidWidth = vid.videoWidth/2;
	    var subVidHeight = vid.videoHeight;
	    var interm_pos = 0;
	    var mergeContext = videoMerge.getContext("2d");
	    if (vid.readyState > 3) {
	        vid.play();
	        function trackLocation(e) {
	            bcr = videoMerge.getBoundingClientRect();
	            interm_pos = ((e.pageX - bcr.x) / bcr.width);
	            if (Math.abs(interm_pos - position) < 0.1) {
	                strokeColor = "#FFFFFFAA";
	            }
	            else {
	                strokeColor = "#FFFFFF44";
	            }
	            if (leftButtonDown && Math.abs(interm_pos - position) < 0.5)
	            {
	                position = interm_pos;
	            }
	        }
	        function trackTrue(e) {
	            if(e.which === 1) {leftButtonDown = true;}
	            else {leftButtonDown=false;}
	        }
	        function trackFalse(e) {
	            if(e.which === 1) leftButtonDown = false;
	        }
	        videoMerge.addEventListener("mousemove",  trackLocation, false); 
	        videoMerge.addEventListener("mousedown",  trackTrue, false); 
	        videoMerge.addEventListener("mouseup",  trackFalse, false); 
	        videoMerge.addEventListener("mouseleave", function() {strokeColor = "#FFFFFF44";})
	        function drawLoop() {
	            mergeContext.drawImage(vid, 0, vidShow * subVidHeight, vidWidth, subVidHeight, 0, 0, vidWidth, subVidHeight);
	            var colStart = (vidWidth * position).clamp(0.0, vidWidth);
	            var colWidth = (vidWidth - (vidWidth * position)).clamp(0.0, vidWidth);
	            mergeContext.drawImage(vid, colStart+vidWidth, vidShow * subVidHeight, colWidth, subVidHeight, colStart, 0, colWidth, subVidHeight);
	            requestAnimationFrame(drawLoop);
	            var currX = vidWidth * position;
	            // Draw border
	            mergeContext.beginPath();
	            mergeContext.moveTo(vidWidth*position, 0);
	            mergeContext.lineTo(vidWidth*position, subVidHeight);
	            mergeContext.closePath()
	            mergeContext.strokeStyle = strokeColor;
	            mergeContext.lineWidth = 2;            
	            mergeContext.stroke();
	            var arrowPosY2 = subVidHeight / 2;
	            var arrowW = subVidHeight / 70;
	            var arrowL = subVidHeight / 150;
	            var arrowoffsetL = subVidHeight / 150;
	            mergeContext.beginPath();
	            mergeContext.moveTo(currX + arrowL + arrowoffsetL, arrowPosY2 - arrowW/2);
	            mergeContext.lineTo(currX + 2*arrowL + arrowoffsetL, arrowPosY2 );
	            mergeContext.lineTo(currX + arrowL + arrowoffsetL, arrowPosY2 + arrowW/2);
	            mergeContext.strokeStyle = strokeColor;
	            mergeContext.stroke();
	            mergeContext.beginPath();
	            mergeContext.moveTo(currX - arrowL - arrowoffsetL, arrowPosY2 - arrowW/2);
	            mergeContext.lineTo(currX - 2*arrowL - arrowoffsetL, arrowPosY2 );
	            mergeContext.lineTo(currX - arrowL - arrowoffsetL, arrowPosY2 + arrowW/2);
	            mergeContext.strokeStyle = strokeColor;
	            mergeContext.stroke();
	        }
	        requestAnimationFrame(drawLoop);
	    } 
	}
	Number.prototype.clamp = function(min, max) {
	  return Math.min(Math.max(this, min), max);
	};