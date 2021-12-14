var apiKey = "qdOthA7CPyz5zOMcgbsihOBCzjb5WIK60FEDRo1h";
var curiosityManifest, 
    opportunityManifest,
    spiritManifest,
    workingManifest,
    currentRover,
    response;
var slideIndex = 1;

$(function() {

    getCuriosityManifest();
    getOpportunityManifest();
    getSpiritManifest();

    $("#roverName").change(function() {
        
        currentRover = $("#roverName").find(":selected").val();

        if (currentRover == "curiosity") {
            workingManifest = curiosityManifest;
        }
        if (currentRover == "opportunity") {
            workingManifest = opportunityManifest;
        }
        if (currentRover == "spirit") {
            workingManifest = spiritManifest;
        }

        if (!($("#sol").val() >= 1)) {
            $("#solValLabel").html("Please select a sol:")
            
            $("#sol").prop("disabled", false);
        } else {
            repopulateCameraSelect();
            $("#cameraSelectLabel").html("Please select a camera:")
        }

    });

    $("#submit").click(function() {

        let x = Boolean(validForm());
        
        if (x == true) {

            var xmlHttp = new XMLHttpRequest();

            xmlHttp.onload = function() {

                //var response;
                if (xmlHttp.status == 200) {

                    response = JSON.parse(xmlHttp.responseText);
                    var imgString = ""; 

                    response.photos.forEach ((photo, index) => {                    
                
                        imgString += "<img class='mySlides' src='" + photo.img_src + "' style='width:100%'>";
                    
                    });

                    $("#slideshowContainer").html(imgString + "<button class='w3-button w3-black w3-display-left' onclick='plusDivs(-1)'>&#10094;</button>" +
                                                              "<button class='w3-button w3-black w3-display-right' onclick='plusDivs(1)'>&#10095;</button>");
                    $("#maxSlideCount").html(" / " + response.photos.length);
                    $("#currentSlideNum").html("");

                }

                showDivs(slideIndex, response.photos);
            };

            var sol = $("#sol").val();
            var camera = $("#cameraSelect").val();
            var url = "https://api.nasa.gov/mars-photos/api/v1/rovers/" + currentRover + "/photos?sol=" + sol + "&camera=" + camera + "&api_key=" + apiKey;
            
            xmlHttp.open("GET", url, true);
            xmlHttp.send();
        }
    })

    $("#sol").change(function() {
        
        repopulateCameraSelect();

    })
})

function repopulateCameraSelect() {

    var solVal = $("#sol").val();
    var selectString = "";    

    if (workingManifest.photos[solVal] == null) {

        $("#cameraSelectLabel").html("No images for this combination.");
        $("#cameraSelect").prop("disabled", true).html("<option>No images for this rover/sol combination.</option>");
        $("#submit").prop("disabled", true);
        return;

    }

    if (workingManifest.photos[solVal] != null) {

        $("#cameraSelectLabel").html("Please select a camera.");
        var cameras = workingManifest.photos[solVal].cameras;

        cameras.forEach(cam => {

            selectString += "<option value='" + cam + "' value='" + cam + "'>" + cam + "</option>";

        });

        $("#submit").prop("disabled", false);
        $("#cameraSelect").prop("disabled", false).html(selectString);

    }
}

function getCuriosityManifest() {

    let xmlHttp = new XMLHttpRequest();
    
    xmlHttp.onload = function() {

        if (xmlHttp.status == 200) {

            curiosityManifest = JSON.parse(xmlHttp.responseText).photo_manifest;
            
            let updatedPhotos = {};
            curiosityManifest.photos.forEach(photo => {
                updatedPhotos[photo.sol] = photo;
            });

            curiosityManifest.photos = updatedPhotos;
            //console.log("Curiosity manifest loaded from the server.");
        }
    };
    
    xmlHttp.open("GET", "https://api.nasa.gov/mars-photos/api/v1/manifests/curiosity?api_key=" + apiKey, true);
    xmlHttp.send();
}

function getOpportunityManifest() {            

    let xmlHttp = new XMLHttpRequest();
    
    xmlHttp.onload = function() {

        if (xmlHttp.status == 200) {

            opportunityManifest = JSON.parse(xmlHttp.responseText).photo_manifest;
            let updatedPhotos = {};

            opportunityManifest.photos.forEach(photo => {

                updatedPhotos[photo.sol] = photo;

            });

            opportunityManifest.photos = updatedPhotos;
            //console.log("Opportunity manifest loaded from the server.");
        }
    };
    
    xmlHttp.open("GET", "https://api.nasa.gov/mars-photos/api/v1/manifests/opportunity?api_key=" + apiKey, true);
    xmlHttp.send();
}

function getSpiritManifest() {         

    let xmlHttp = new XMLHttpRequest();
    
    xmlHttp.onload = function() {

        if (xmlHttp.status == 200) {

            spiritManifest = JSON.parse(xmlHttp.responseText).photo_manifest;
            let updatedPhotos = {};

            spiritManifest.photos.forEach(photo => {

                updatedPhotos[photo.sol] = photo;

            });

            spiritManifest.photos = updatedPhotos;
            //console.log("Spirit manifest loaded from the server.");
        }
    };
    
    xmlHttp.open("GET", "https://api.nasa.gov/mars-photos/api/v1/manifests/spirit?api_key=" + apiKey, true);
    xmlHttp.send();
}

function validForm () {

    var solVal = $("#sol").val();
    
    if (currentRover == null) {

        alert("Please select a rover.")
        return false;

    }

    if (solVal == 0) {

        alert("Please select a valid sol.");
        return false;

    } 
    
    if (!(solVal in workingManifest.photos)) {

        alert(workingManifest.name + " does not contain any photos for the specified sol.\nPlease select a different sol.")
        return false;

    } else {

        return true;

    }
}

function plusDivs(n) {

    console.log(workingManifest);
    showDivs(slideIndex += n);

}

function showDivs(n) {

    var i;
    var x = $(".mySlides");

    console.log(response);

    if (n > x.length) {
        slideIndex = 1;
    }
    if (n < 1) {
        slideIndex = x.length;    
    }

    for (i = 0; i < x.length; i++) {
        
        x[i].style.display = "none";
        currentPhotoObj = response.photos[(slideIndex - 1)];
        //console.log(currentPhotoObj);
        $("#currentSlideNum").html(slideIndex);
        $("#currentSlideRoverName").html("<b>Rover Name:</b> " + currentPhotoObj.rover.name +
                                         "<br><b>Camera Name:</b> " + currentPhotoObj.camera.full_name +
                                         "<br><b>Rover Left Earth:</b> " + currentPhotoObj.rover.launch_date +
                                         "<br><b>Rover Landed on Mars:</b> " + currentPhotoObj.rover.landing_date +
                                         "<br><b>This Photo Was Taken:</b> " + currentPhotoObj.earth_date);

    }
    //console.log(returnedPhotos[slideIndex]);
    x[slideIndex-1].style.display = "block";  
}
