const popupContainer = document.querySelector("#popup-container");
const messages = [
  "As always, so impressed by your work!",
  "Absolutely beautiful. Love all your creations, you are a talented young woman.",
  "Very beautiful professional job well done.",
  "Kudos for quickly installing panels to create 240 sq ft of storage space in our garage attic!",
  "Esme does GREAT work!!!",
  "Y’all I cannot recommend Esme enough!! She helped me build my dream bookshelf! Bonus: she’s an excellent human and has a super cute doggo! Hire Esme!!",
  "The custom pantry organization system you built has literally changed our lives. Why did we wait so long?",
  "you just made my day.",
  "The precision in Esme's work speaks volumes—every joint, every finish, every deadline met with remarkable consistency.",
  "Best investment we've made in our home—period.",
  "That awkward corner is now our favorite reading nook, thanks to Esme's brilliant solutions and reliable project updates!",
  "Finally, a carpenter who calls when she says she will! Esme brought our ideas into reality with precision and care.",
  "Esme is a true craftsman. Her work is impeccable, and her attention to detail is second to none.",
  "Esme's attention to detail is mind-blowing! The built-in shelving she crafted for our living room is meticulous down to the millimeter. Worth every penny!",
  "We had an awkward space under our stairs for years. One consultation with Esme and now it's our home's most functional storage AND a conversation piece. Brilliant work!.",
  "On time, on budget, with consistent updates throughout—and the bookshelves are magnificent.",
  "The stunning built-ins Esme created for our home office have literally changed how I work. Beautiful, functional, and delivered exactly as promised.",
  "Esme didn't just build storage—she solved problems I didn't even know how to articulate.",
  "The quality of Esme's work speaks for itself—literally had three neighbors ask for her number after seeing our new",
  "Her ability to maximize space is unmatched.",
  "The floating shelves Esme installed in our bathroom seemed impossible given our weird wall angles, but she made it happen!",
  "After a disappointing experience with another carpenter, working with Esme was a revelation. She communicates clearly, delivers on time, and her craftsmanship on our kitchen pantry is absolutely flawless.",

  
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
  <textarea>${message}</textarea>
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
  }, i * 2000);
}
