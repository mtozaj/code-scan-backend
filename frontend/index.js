window.onload = () => {
  let camera_button = document.querySelector("#start-camera");
  let video = document.querySelector("#video");
  let click_button = document.querySelector("#click-photo");
  let canvas = document.querySelector("#canvas");
  let compile_btn = document.querySelector("#compile-btn");
  let input_image = document.querySelector("#input-image");
  let preview_image = document.querySelector("#preview-img");

  input_image.addEventListener("change", function () {
    var files = input_image.files[0]; 
    if (files) {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(files);
      fileReader.addEventListener("load", function () {
        preview_image.src =  this.result;
        var data = JSON.stringify({ base64image: this.result }); // stringify({})
        fetch("image/upload", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: data,
        });
        document.querySelector("#preview-img").style.display = "initial";
        document.querySelector("#video").style.display = "none";

      });    
    }

  });


  camera_button.addEventListener("click", async function () {
    let stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false,
    });
    video.srcObject = stream;
    //replace canvas with live video when start camera btn is clicked
    document.querySelector("#video").style.display = "initial";
    document.querySelector("#preview-img").style.display = "none";
  });

  click_button.addEventListener("click", function () {
    canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
    const image_data_url = canvas.toDataURL("image/jpeg");
    // data url of the image
    preview_image.src =  image_data_url;
    var data = JSON.stringify({ base64image: image_data_url }); // stringify({})
    fetch("image/upload", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: data,
    });
    //show upload photo btn and replace live video with taken photo
    document.querySelector("#preview-img").style.display = "initial";
    document.querySelector("#video").style.display = "none";
    document.querySelector("#canvas").style.display = "none";

  });


  compile_btn.addEventListener("click", function () {
    var e = document.getElementById("lang");
    var value = parseInt(e.value);
    var data = JSON.stringify({ languageID: value });
    fetch("/compile", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: data,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        document.querySelector(".compiled-output").textContent = data.output;
      });
  });
};
