$('#submitBtn').click(() => {

  // Develop map
  const mymap = L.map('mapid').setView([0, 0], 3);
  const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
  const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  const tiles = L.tileLayer(tileUrl, { attribution });
  tiles.addTo(mymap);

  // Develop map markers
  const circle = L.circle([0, 0], {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.5,
    radius: 100000
  }).addTo(mymap);
  circle.bindPopup("Radius of ISS visibility.");

  // ISS Location fetch API
  async function issLocate() {
    let issData = await (
        await fetch('http://api.open-notify.org/iss-now.json')
      ).json();
      return issData;
  }

  function app() {
    issLocate()
      .then(issData => {
        // Store the iss coordinates into their variables
        var issLatitudeCoordinate = Number(issData.iss_position.latitude);
        var issLongitudeCoordinate = Number(issData.iss_position.longitude);

        // The ISS changes position on the map in real time
        mymap.setView([issLatitudeCoordinate, issLongitudeCoordinate], 3);
        circle.setLatLng([issLatitudeCoordinate, issLongitudeCoordinate]);



      })
      .catch(error => console.log(error));
  };
  app();
  setInterval(app, 1000);

});
