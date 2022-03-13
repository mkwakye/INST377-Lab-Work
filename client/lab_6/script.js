async function dataHandler(pgArray) {
  console.table(pgArray);
}

async function mainEvent() {
  console.log('script loaded');
  const form = document.querySelector('.main_form');
  const but = document.querySelector('.button');
  but.style.display = 'none';

  const results = await fetch('https://data.princegeorgescountymd.gov/resource/umjn-t2iz.json');
  const arrayFromJson = await results.json();

  if (arrayFromJson.data.length > 0) {
    form.addEventListener('submit', async (submitEvent) => {
      but.style.display = 'block';
      submitEvent.preventDefault();
      console.log('form submission');
      dataHandler(arrayFromJson.data);
    });
  }
}
document.addEventListener('DOMContentLoaded', async () => dataHandler());
// this actually runs first! It's calling the function above
document.addEventListener('DOMContentLoaded', async () => mainEvent()); // the async keyword means we can make API requests

/*

async function mainEvent() { // the async keyword means we can make API requests
  const form = document.querySelector('.main_form');
  form.addEventListener('submit', async (submitEvent) => {
    // async has to be declared all the way to get an await
    submitEvent.preventDefault(); // This prevents your page from refreshing!
    console.log('form submission'); // this is substituting for a "breakpoint"
    const results = await fetch('/api/foodServicesPG'); // This accesses some data from our API
    const arrayFromJson = await results.json(); // This changes it into data we can use - an object
    console.table(arrayFromJson.data); // this is called "dot notation"
  });
}

document.addEventListener('DOMContentLoaded', async () => mainEvent());
// the async keyword means we can make API requests
*/
