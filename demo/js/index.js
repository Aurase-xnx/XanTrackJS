const video = document.getElementById("myvideo");
const handimg = document.getElementById("handimage");
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

let openHand = false;
let closedHand = false;
let face = false;

let trackButton = document.getElementById("trackbutton");
let nextImageButton = document.getElementById("nextimagebutton");
let updateNote = document.getElementById("updatenote");

let imgindex = 1;
let isVideo = false;
let model = null;

// video.width = 500
// video.height = 400

const modelParams = {
  flipHorizontal: true, // flip e.g for video
  maxNumBoxes: 20, // maximum number of boxes to detect
  iouThreshold: 0.5, // ioU threshold for non-max suppression
  scoreThreshold: 0.6, // confidence threshold for predictions.
};

function startVideo() {
  handTrack.startVideo(video).then(function (status) {
    console.log("video started", status);
    if (status) {
      updateNote.innerText = "Video started. Now tracking";
      isVideo = true;
      runDetection();
    } else {
      updateNote.innerText = "Please enable video";
    }
  });
}

function toggleVideo() {
  if (!isVideo) {
    updateNote.innerText = "Starting video";
    startVideo();
  } else {
    updateNote.innerText = "Stopping video";
    handTrack.stopVideo(video);
    isVideo = false;
    updateNote.innerText = "Video stopped";
  }
}

nextImageButton.addEventListener("click", function () {
  nextImage();
});

trackButton.addEventListener("click", function () {
  toggleVideo();
});

function nextImage() {
  imgindex++;
  handimg.src = "images/" + (imgindex % 9) + ".jpg";
  // alert(handimg.src)
  setTimeout(() => {
    runDetectionImage(handimg);
  }, 500);
}

function runDetection() {
  model.detect(video).then((predictions) => {
    // console.log("Predictions: ", predictions);
    const openHandsPredictions = predictions.filter(predictions => predictions.class == 1);
    const closedHandsPredictions = predictions.filter(predictions => predictions.class == 2);
    const facePredictions = predictions.filter(predictions => predictions.class == 5);
    
    switch (true) {
      case openHandsPredictions.length > 0:
        openHand = true
        // console.log("OPEN HAND : ", openHand)
        gestureDetect();
        break;
      case closedHandsPredictions.length > 0:
        closedHand = true
        // console.log("CLOSED HAND : ", closedHand)
        break;
      // case facePredictions.length > 0:
      //   face = true
      //   // console.log("FACE : ", face)
      //   break;
      default:
        console.log("No open hands detected")
        break;
    }

    
    model.renderPredictions(predictions, canvas, context, video);
    if (isVideo) {
      requestAnimationFrame(runDetection);
    }
  });
}


function runDetectionImage(img) {
  model.detect(img).then((predictions) => {
    console.log("Predictions: ", predictions);
    model.renderPredictions(predictions, canvas, context, img);
  });
}

// Load the model.
handTrack.load(modelParams).then((lmodel) => {
  // detect objects in the image.
  model = lmodel;
  console.log(model);
  updateNote.innerText = "Loaded Model!";
  runDetectionImage(handimg);
  trackButton.disabled = false;
  nextImageButton.disabled = false;
});


async function gestureDetect(){
  console.log("Gesture detection in progress");
  
}

