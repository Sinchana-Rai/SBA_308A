
import * as Carousel from "./Carousel.js"
import axios from "axios";

const breedSelect = document.getElementById("breedSelect");

const API_KEY =
  "live_e1tuq0KHIXezhki0jU3qexK2gkX8oP8GqWF2fCPJUtohPr0H7R9nQxhSfkEiW15e";


async function initialLoad() {

try{
    const response = await axios.get('https://api.thedogapi.com/v1/breeds')
    const jsonData = response.data;

    console.log(jsonData);

    for(let infos of jsonData) {
        const options = document.createElement("option");
        options.value = infos.id; 
        options.text = infos.name; 
        breedSelect.append(options);
    }
} catch (error){
    console.log(error)
}
}
initialLoad();


breedSelect.addEventListener("change", () => {
    const breedId = breedSelect.value;

    fetch(`https://api.thedogapi.com/v1/images/search?limit=10&breed_ids=${breedId}&api_key=${API_KEY}`)
        .then(response => response.json())
        .then(jsonData => {
            console.log(jsonData);
            Carousel.clear();

            jsonData.forEach(ele => {
                const url = ele.url;
                const dogID = ele.id;
                const altText = 'Image of the Dog' + dogID;
                const createCarousel = Carousel.createCarouselItem(url, altText, dogID);
                Carousel.appendCarousel(createCarousel);
            });

            Carousel.start();
        })
        .catch(error => {
            console.log(error);
        });


});


