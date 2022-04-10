function getRandomIntInclusive(min, max) {
    const newMin = Math.ceil(min);
    const newMax = Math.floor(max);
    return Math.floor(Math.random() * (newMax - newMin + 1)) + newMin;
  }
  
  function restoArrayMake(dataArray) {
    console.log('fired dataHandler');
    console.table(dataArray);
    const range = [...Array(15).keys()];
    const listItems = range.map((item, index) => {
      const restNum = getRandomIntInclusive(0, dataArray.length - 1);
      return dataArray[restNum];
    });
    console.log(listItems);
    return listItems;
  
    // range.forEach((item) => {
    //   console.log('range item', item);
    // });
  }
  
  function createHtmlList(collection) {
    // console.log('fired HTML creator');
    // console.log(collection);
    const targetList = document.querySelector('.resto-list');
    targetList.innerHTML = '';
    collection.forEach((item) => {
      const { name } = item;
      const nameDisplay = name.toLowerCase();
      const injectThisItem = `<li>${nameDisplay}</li>`;
      // const injectThisItem = `<li>${item.name}</li>`;
      targetList.innerHTML += injectThisItem;
    });
  }

  function initMap(targetId) {
    const latLong = [38.7849, 76.8721];
    const map = L.map(targetId).setView(latLong, 13);
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox/streets-v11',
      tileSize: 512,
      zoomOffset: -1,
      accessToken: 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw'
    }).addTo(map);
    return map;
  }
  
  function addMapMarkers(map, collection) {
    // todo: remove existing makers
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        layer.remove();
      }
    });

    collection.forEach((item) => {
      const point = item.geocoded_column_1?.coordinates;
      console.log(item.geocoded_column_1?.coordinates);
      L.marker([point[1], point[0]]).addTo(map);
    });
  }
  
  async function mainEvent() {
    console.log('script loaded');
    const form = document.querySelector('.page_form');
    const but = document.querySelector('.button');
    const resto = document.querySelector('#resto_name');
    const zipcode = document.querySelector('#zipcode');

    const map = initMap('map');
    const retrievalVar = 'restaurants';
    but.style.display = 'none';
  
    // const results = await fetch(
    //   'https://data.princegeorgescountymd.gov/resource/umjn-t2iz.json'
    // );

    if (!localStorage.getItem(retrievalVar)) {
      const results = await fetch('/api/foodServicesPG');
      const arrayFromJson = await results.json();
      console.log(arrayFromJson);
      localStorage.setItem(retrievalVar, JSON.stringify(arrayFromJson.data));
    }
    
    const storedDataString = localStorage.getItem(retrievalVar);
    const storedDataArray = JSON.parse(storedDataString);
    //const arrayFromJson = await results.json();
    // console.log(arrayFromJson);
  
    if (storedDataArray.length > 0) { // prevents race condition
      but.style.display = 'block';
  
      let currentArray = [];
      resto.addEventListener('input', async (event) => { // for restaurant
        console.log(event.target.value);
        // if (currentArray.length < 1) {
        //   return;
        // }
        // const selectResto = currentArray.filter((item) => {
        const selectResto = storedDataArray.filter((item) => { // filter entire list
          const lowerName = item.name.toLowerCase();
          const lowerValue = event.target.value.toLowerCase();
          return lowerName.includes(lowerValue);
        });
        createHtmlList(selectResto);
      });
  
      zipcode.addEventListener('input', async (event) => { // For zipcode
        console.log(event.target.value);
        // const selectCat = currentArray.filter((item) => {
        const selectCat = storedDataArray.filter((item) => { // filter entire list
          const lowerCat = item.name.toLowerCase();
          const lowerCatValue = event.target.value.toLowerCase();
          return lowerCat.includes(lowerCatValue);
        });
        createHtmlList(selectCat);
      });
  
      form.addEventListener('submit', async (submitEvent) => {
        submitEvent.preventDefault();
        // console.log('form submission');
        currentArray = restoArrayMake(storedDataArray);
        console.log(currentArray);
        createHtmlList(currentArray);
        // ADD CLEAR MAP MARKERS
        addMapMarkers(map, currentArray);
      });
    }
  }
  document.addEventListener('DOMContentLoaded', async () => mainEvent());
  