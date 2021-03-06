const baseURL = 'http://localhost:3000';
const favoritesURL = `${baseURL}/favorites`;
const entertainmentURL = `${baseURL}/entertainment`;
const $divContainer = document.querySelector('.container');

document.addEventListener('click', activateCarousel)

let timer;

function activateCarousel(event){
    if (event.target === document.getElementById("on-button")) {
        carouselCards()
        console.log("Autoscroll turned on!")
    }
    if (event.target === document.getElementById("off-button")) {
        clearInterval(timer);
        console.log("Autoscroll turned off!")
    }
}

function carouselCards() {
    timer = setInterval(function() {
      const $parentContainer = document.querySelector('.container');
      const $divCard = $parentContainer.querySelectorAll('.item');
      $divCard.forEach((card) => {
          card.classList.toggle('sliding-now');
      })
      setTimeout(function() {
        $parentContainer.appendChild($divCard[0]);
      }, 5000);

    }, 5000);
  }

fetch(entertainmentURL)
    .then(response => response.json())
    .then(entertainment_articles => displayStories(entertainment_articles))
    .then(addingEventListeners);

function displayStories(story) {
    story.forEach(showStory)

    const loadingGif = document.querySelector('.loading')
    loadingGif.remove()
};

function showStory(story) {
    const $storyCard = document.createElement("div")
    $storyCard.className = "item";

    const $title = document.createElement('h2')
    $title.textContent = story.title

    const $description = document.createElement('p')
    $description.textContent = story.description

    const $image = document.createElement('img')
    if (story.urlToImage ==  null) {
        $image.src = "https://vcunited.club/wp-content/uploads/2020/01/No-image-available-2.jpg"
        $image.alt = "No image available"
    }
    else {
        $image.src = story.urlToImage
        $image.alt = story.title
    }

    

    const $linkToStory = document.createElement('a')
    $linkToStory.setAttribute('href', story.url)
    $linkToStory.setAttribute('target', '_blank')
    $linkToStory.innerText = "Read full story"

    const $favoritesButton = document.createElement('button')
    $favoritesButton.className = "button"
    $favoritesButton.id = "favorites-button"
    $favoritesButton.textContent = "Add to My Feed"
    // $favoritesButton.onclick = changeButtonText;


    $storyCard.append($title, $description, $image, $linkToStory, $favoritesButton)
    $divContainer.appendChild($storyCard)
};



// function changeButtonText() {
//     const $favoritesButton = document.getElementById("favorites-button");
//     if ($favoritesButton.innerHTML == "Add to My Feed") {
//         $favoritesButton.innerHTML = "Added";
//     }
//     else {
//         $favoritesButton.innerHTML = "Add to My Feed";
//     }
// };

function addingEventListeners() {
    const $cards = document.getElementsByClassName('item')

    Array.from($cards).forEach(card => {
        card.addEventListener('click', (event) => {
            const storyCardDiv = event.target.parentNode
            // const $favoritesButton = storyCardDiv.querySelector("button");

            const $title = storyCardDiv.querySelector('h2').innerText
            const $description = storyCardDiv.querySelector('p').innerText
            const $imageLink = storyCardDiv.querySelector('img').src
            const $storyLink = storyCardDiv.querySelector('a').href
            
            const savedStory = {
                title: $title,
                description: $description,
                link_to_image: $imageLink,
                link_to_story: $storyLink
            }

            fetch(favoritesURL, {
                method: 'POST', 
                body: JSON.stringify(savedStory),
                headers: {
                    "Content-Type": "application/json", 
                    Accept: "application/json"
                } 
            })
                .then(response => response.json())
        })
    })
}
