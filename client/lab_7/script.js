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

async function mainEvent() {
  console.log('script loaded');
  const form = document.querySelector('.page_form');
  const but = document.querySelector('.button');
  const resto = document.querySelector('#resto_name');
  const category = document.querySelector('#category');
  but.style.display = 'none';

  const results = await fetch(
    'https://data.princegeorgescountymd.gov/resource/umjn-t2iz.json'
  );
  const arrayFromJson = await results.json();
  // console.log(arrayFromJson);

  if (arrayFromJson.length > 0) { // prevents race condition
    but.style.display = 'block';

    let currentArray = [];
    resto.addEventListener('input', async (event) => { // for restaurant
      console.log(event.target.value);
      // if (currentArray.length < 1) {
      //   return;
      // }
      // const selectResto = currentArray.filter((item) => {
      const selectResto = arrayFromJson.filter((item) => { // filter entire list
        const lowerName = item.name.toLowerCase();
        const lowerValue = event.target.value.toLowerCase();
        return lowerName.includes(lowerValue);
      });
      createHtmlList(selectResto);
    });

    category.addEventListener('input', async (event) => { // For category
      console.log(event.target.value);
      // const selectCat = currentArray.filter((item) => {
      const selectCat = arrayFromJson.filter((item) => { // filter entire list
        const lowerCat = item.name.toLowerCase();
        const lowerCatValue = event.target.value.toLowerCase();
        return lowerCat.includes(lowerCatValue);
      });
      createHtmlList(selectCat);
    });

    form.addEventListener('submit', async (submitEvent) => {
      submitEvent.preventDefault();
      // console.log('form submission');
      currentArray = restoArrayMake(arrayFromJson);
      createHtmlList(currentArray);
    });
  }
}
document.addEventListener('DOMContentLoaded', async () => mainEvent());
