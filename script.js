const popupContainer = document.querySelector("#popup-container");
const messages = [
  "As always, so impressed by your work!",
  "Absolutely beautiful. Love all your creations, you are a talented young woman.",
  "Very beautiful professional job well done.",
  "Kudos for quickly installing panels to create 240 sq ft of storage space in our garage attic!",
  "Esme does GREAT work!!!",
  "Y’all I cannot recommend Esme enough!! She helped me build my dream bookshelf! Bonus: she’s an excellent human and has a super cute doggo! Hire Esme!!",
  "you make babies smile.",
  "you just made my day.",
  "i like the way you are.",
  "you are stunning.",
  "i am really glad we met.",
  "you're a great listener.",
  "you're inspiring.",
  "you look great today.",
  "you smell really good.",
  "you're one of a kind.",
  "you radiate warmth.",
  "you are effervescent.",
  "your energy is infectious!",
  "you’re truly a gem",
  "your Instagram is goals",
  "you have a cute nose",
  "and cute eyes",
  "i’m your biggest fan",
  "you’re basically superman",
  "your passion motives me",
  
  // Add more messages here
];

// Generate a random number between min and max
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Create and display a pop-up window
function createPopup(message) {
  const popup = document.createElement("div");
  popup.classList.add("popup");

  // Set the pop-up's position
  const x = getRandomNumber(0, window.innerWidth - 200);
  const y = getRandomNumber(0, window.innerHeight - 200);
  popup.style.left = `${x}px`;
  popup.style.top = `${y}px`;

  // Set the pop-up's content
  popup.innerHTML = `
    <input type="text" value="${message}">
    <button class="close-button">Close</button>
  `;

  popupContainer.appendChild(popup);

  // Close the pop-up when the close button is clicked
  const closeButton = popup.querySelector(".close-button");
  closeButton.addEventListener("click", function() {
    popup.style.display = "none";
  });

  popup.style.display = "block";
}

// Display pop-ups at different times
for (let i = 0; i < 100; i++) {
  setTimeout(function() {
    createPopup(messages[i % messages.length]);
  }, i * 1000);
}
