// Click triggers app to run
$('#submitBtn').click(() => {

  // Storing the User Input values into variables
  var city = $('#city').val();
  var state = $('#state').val();
  var userLocation = city + ",+" + state;

  // User Location fetch API
  async function userLocate() {
    userLocateUrl = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + userLocation + '&key=YOUR_KEY';
    let userData = await (
      await fetch(userLocateUrl)
    ).json();
    return userData;
  }

  // ISS Location fetch API
  async function issLocate() {
    let issData = await (
        await fetch('http://api.open-notify.org/iss-now.json')
      ).json();
      return issData;
  }

  /**** Using data from JSON files calls ****/
  // Resolve International Space Station location (Latitude, Longitude)
  function app() {
    issLocate()
      .then(issData => {
        // Store the iss coordinates into their variables
        var issLatitudeCoordinate = Number(issData.iss_position.latitude);
        var issLongitudeCoordinate = Number(issData.iss_position.longitude);

          // Resolve User location (latitude, longitude)
          userLocate()
            .then(userData => {
              // Store the User coordinates into their variables
              var userLatitudeCoordinate = Number(userData.results[0].geometry.location.lat);
              var userLongitudeCoordinate = Number(userData.results[0].geometry.location.lng);

              // Calculating
              var iLa = issLatitudeCoordinate;
              var iLo = issLongitudeCoordinate;
              var uLa = userLatitudeCoordinate;
              var uLo = userLongitudeCoordinate;
              [iLa, iLo, uLa, uLo] = [iLa, iLo, uLa, uLo].map(coordinate => coordinate/180*Math.PI);
              let distance = 3963.0 * Math.acos(Math.sin(iLa)*Math.sin(uLa)+Math.cos(iLa)*Math.cos(uLa)*Math.cos(uLo-iLo));
              distance = Math.round(distance);
              $('.distance h4').html("Distance");
              $('.distance span').html(distance + "miles");

              // Output the coordinates into the index.html file
              $('.userCoordinates h5').html("User Coordinates");
              $('.issCoordinates h5').html("ISS Coordinates");
              $('.userCoordinates span').html(
                "Latitude: " + parseInt(userLatitudeCoordinate) +
                "<br/>Longitude: " + parseInt(userLongitudeCoordinate)
              );
              $('.issCoordinates span').html(
                "Latitude: " + issLatitudeCoordinate +
                "<br/>Longitude: " + issLongitudeCoordinate
              );

              //const marker = L.marker([userLatitudeCoordinate, userLongitudeCoordinate]).addTo('mapid');
              //marker.bindPopup(city).openPopup();

            })
            .catch(error => console.log(error));
          // Catching errors if they occur
      })
      .catch(error => console.log(error));
  };
  app();
  setInterval(app, 1000);
});
