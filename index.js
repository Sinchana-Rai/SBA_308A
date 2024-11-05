
import * as Carousel from "./Carousel.js"
import axios from "axios";

const breedSelect = document.getElementById("breedSelect");
const speciesSelect = document.getElementById("speciesSelect"); // New dropdown for species selection

const CAT_API_KEY = "live_Pwz1DDFj6lR8faG9VyV09FQbvpJGHDGSuCGU9YTUlBmYHmVOZBsnw3uURi3fQbA0";
const DOG_API_KEY = "live_e1tuq0KHIXezhki0jU3qexK2gkX8oP8GqWF2fCPJUtohPr0H7R9nQxhSfkEiW15e";

async function initialLoad() {
  try {
    let apiUrl;
    let apiKey;

     if (speciesSelect.value === "cat") {
      apiUrl = "https://api.thecatapi.com/v1/breeds";
      apiKey = CAT_API_KEY;
    } else {
      apiUrl = "https://api.thedogapi.com/v1/breeds";
      apiKey = DOG_API_KEY;
    }

    const response = await axios.get(apiUrl, {
      headers: { "x-api-key": apiKey },
    });
    const jsonData = response.data;

    breedSelect.innerHTML = "";
    jsonData.forEach((infos) => {
      const option = document.createElement("option");
      option.value = infos.id;
      option.text = infos.name;
      breedSelect.append(option);
    });
  } catch (error) {
    console.error(error);
  }
}


breedSelect.addEventListener("change", async () => {
  try {
    const breedId = breedSelect.value;
    let apiUrl;
    let apiKey;

    if (speciesSelect.value === "cat") {
      apiUrl = `https://api.thecatapi.com/v1/images/search?limit=10&breed_ids=${breedId}`;
      apiKey = CAT_API_KEY;
    } else {
      apiUrl = `https://api.thedogapi.com/v1/images/search?limit=10&breed_ids=${breedId}`;
      apiKey = DOG_API_KEY;
    }

    const response = await axios.get(apiUrl, {
      headers: { "x-api-key": apiKey },
    });
    const jsonData = response.data;

    Carousel.clear();
    jsonData.forEach((ele) => {
      const url = ele.url;
      const id = ele.id;
      const altText = `Image of the animal ${id}`;
      const createCarousel = Carousel.createCarouselItem(url, altText, id);
      Carousel.appendCarousel(createCarousel);
    });

    Carousel.start();
  } catch (error) {
    console.error(error);
  }
});

initialLoad();
speciesSelect.addEventListener("change", initialLoad);

export async function favourite(imgId) {

    
    const getresposne=  await axios.get('https://api.thedogapi.com/v1/favourites',{ 
     headers: { 
         'Content-Type': 'application/json; charset=UTF-8',
         'x-api-key': API_KEY
     }
 });
 const favourites = getresposne.data;
 
     const existingFavourite = favourites.find(fav => fav.image_id === imgId);
 
     if (existingFavourite) {
         console.log(`Image ${imgId} is exists in our favourites.`);
            await axios.delete(`https://api.thedogapi.com/v1/favourites/${existingFavourite.id}`,{ 
             headers: { 
                 'Content-Type': 'application/json; charset=UTF-8',
                 'x-api-key': API_KEY
             }
         });
       console.log(`Image ${imgId} removed from favourites.`);
     }

     const response=  await axios.post('https://api.thedogapi.com/v1/favourites', {
             image_id: imgId},{ 
                 headers: { 
                     'Content-Type': 'application/json; charset=UTF-8',
                     'x-api-key': API_KEY
                 }
             });
    console.log(response)
 
 }

 getFavouritesBtn.addEventListener("click", async () => {
    try {

        const response=  await axios.get('https://api.thedogapi.com/v1/favourites',{ 
            headers: { 
                'Content-Type': 'application/json; charset=UTF-8',
                'x-api-key': API_KEY
            }
        });
            const favourites = response.data;

            console.log("favourites"+ favourites)
  
      Carousel.clear();
  
      favourites.forEach(fav => {
        if (fav.image) {
          const altText = `Favourite Image ${fav.image.id}`;
          const carouselItem = Carousel.createCarouselItem(fav.image.url, altText, fav.image.id);
          Carousel.appendCarousel(carouselItem);
        }
      });
  
      Carousel.start();
      console.log("Favourites loaded.");
  
    } catch (error) {
      console.error("Error loading favourites:", error);
    }
  });
