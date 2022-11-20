window.onload = () => {
  let camera_button = document.querySelector("#start-camera");
  let video = document.querySelector("#video");
  let click_button = document.querySelector("#click-photo");
  let canvas = document.querySelector("#canvas");
  let upload_btn = document.querySelector("#upload-photo-btn");
  var image_data_url;

  camera_button.addEventListener("click", async function () {
    let stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false,
    });
    video.srcObject = stream;
    //replace canvas with live video when start camera btn is clicked
    document.querySelector("#video").style.display = "initial";
    document.querySelector("#canvas").style.display = "none";
    document.querySelector("#upload-photo-btn").style.display = "none";
  });

  click_button.addEventListener("click", function () {
    canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
    image_data_url = canvas.toDataURL("image/jpeg");
    console.log(image_data_url);
    // data url of the image
    console.log(image_data_url);
    //show upload photo btn and replace live video with taken photo
    document.querySelector("#upload-photo-btn").style.display = "initial";
    document.querySelector("#canvas").style.display = "initial";
    document.querySelector("#video").style.display = "none";
  });

  upload_btn.addEventListener("click", function () {
    //const url = "data:image/png;base6....";
    //var httpPost = new XMLHttpRequest();
    var data = JSON.stringify({ base64image: image_data_url }); // stringify({})
    fetch("image/upload", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: data,
    });
    // httpPost.open("POST", path, false);
    // Set the content type of the request to json since that's what's being sent
    // httpPost.setRequestHeader("Content-Type", "application/json");
    //httpPost.send(data);
  });
};
