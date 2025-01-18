let gameSeq = [];
let userSeq = [];
let btns = ["yellow", "violet", "green", "aqua"];
let started = false;
let level = 0;
let highestLevel = 0; // Track the highest level achieved
let timeoutId; // To track the timeout for forgetting the sequence

let h2 = document.querySelector("h2");
let highestLevelDisplay = document.createElement("p"); // Create a new element to display the highest level
document.body.appendChild(highestLevelDisplay); // Add it to the body

// Start the game when a key is pressed
document.addEventListener("keypress", function () {
    if (!started) {
        console.log("Game started");
        started = true;
        levelUp();
    }
});

// Flash a button (used for game sequence)
function btnFlash(btn) {
    btn.classList.add("flash");
    setTimeout(function () {
        btn.classList.remove("flash");
    }, 250); // Flash duration
}

// Make the button black when clicked (used for user input)
function btnBlack(btn) {
    btn.classList.add("black");
    setTimeout(function () {
        btn.classList.remove("black");
    }, 250); // Black flash duration
}

// Increase the level and generate the next sequence
function levelUp() {
    userSeq = []; // Reset the user sequence for the new level
    level++;
    h2.innerText = `Level ${level}`;

    // Update the highest level if the current level is higher
    if (level > highestLevel) {
        highestLevel = level;
        highestLevelDisplay.innerText = `Highest Level: ${highestLevel}`; // Update the display
    }

    // Randomly choose a button and add it to the game sequence
    let randIndx = Math.floor(Math.random() * 4); // Random index (0 to 3)
    let randColor = btns[randIndx];
    let randBtn = document.querySelector(`#${randColor}`); // Use ID to select the button
    gameSeq.push(randColor); // Add the color to the game sequence
    console.log("Game Sequence:", gameSeq);

    // Flash the randomly chosen button
    btnFlash(randBtn);

    // Start a timeout for forgetting the sequence
    startTimeout();
}

// Handle button clicks
function btnPress() {
    if (!started) return; // Ignore clicks if the game hasn't started

    // Reset the timeout whenever the user clicks a button
    clearTimeout(timeoutId);
    startTimeout();

    let btn = this;
    let userColor = btn.getAttribute("id"); // Get the color of the clicked button
    userSeq.push(userColor); // Add the color to the user sequence
    console.log("User Sequence:", userSeq);

    btnBlack(btn); // Make the button black when clicked

    // Check if the user's sequence matches the game sequence
    checkAns(userSeq.length - 1);
}

// Start a timeout for forgetting the sequence
function startTimeout() {
    // Clear any existing timeout
    clearTimeout(timeoutId);

    // Set a new timeout (e.g., 5 seconds)
    timeoutId = setTimeout(function () {
        h2.innerHTML = `Game Over! You forgot the sequence. <br> Your score was <b>${level}</b> <br> Press any key to start again.`;
        document.body.style.backgroundColor = "red";
        setTimeout(function () {
            document.body.style.backgroundColor = "white";
        }, 150);
        reset(); // Reset the game
    }, 5000); // 5 seconds timeout
}

// Check the user's answer
function checkAns(idx) {
    if (userSeq[idx] === gameSeq[idx]) {
        // If the user's sequence matches so far
        if (userSeq.length === gameSeq.length) {
            // If the user has completed the sequence, move to the next level
            setTimeout(levelUp, 1000);
        }
    } else {
        // If the user's sequence is wrong, end the game
        h2.innerHTML = `Game Over! Your score was <b>${level}</b> <br> Press any key to start again.`;
        document.body.style.backgroundColor = "red";
        setTimeout(function () {
            document.body.style.backgroundColor = "white";
        }, 150);
        reset(); // Reset the game
    }
}

// Reset the game
function reset() {
    started = false;
    gameSeq = [];
    userSeq = [];
    level = 0;
    clearTimeout(timeoutId); // Clear the timeout
}

// Add event listeners to all buttons
let allBtns = document.querySelectorAll(".btn");
for (let btn of allBtns) {
    btn.addEventListener("click", btnPress);
}