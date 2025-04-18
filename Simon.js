let gameSeq = [];
let userSeq = [];
let btns = ["yellow", "violet", "green", "aqua"];
let started = false;
let level = 0;
let highestLevel = 0; // Track the highest level achieved
let timeoutId; // To track the timeout for forgetting the sequence
let scoreMultiplier = 1;
let difficulty = "normal"; // Can be "easy", "normal", "hard"
let timerInterval;
let timeLeft = 5; // Default time for normal difficulty

// Sound effects
const sounds = {
    correct: new Audio('https://assets.mixkit.co/active_storage/sfx/2570/2570-preview.mp3'),
    wrong: new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3'),
    levelUp: new Audio('https://assets.mixkit.co/active_storage/sfx/2572/2572-preview.mp3'),
    button: new Audio('https://assets.mixkit.co/active_storage/sfx/2573/2573-preview.mp3')
};

let h2 = document.querySelector("h2");
let highestLevelDisplay = document.createElement("p"); // Create a new element to display the highest level
let timerDisplay = document.createElement("div");
timerDisplay.className = "timer";
document.body.appendChild(highestLevelDisplay); // Add it to the body
document.body.appendChild(timerDisplay);

// Add difficulty selector
const difficultySelector = document.createElement("div");
difficultySelector.className = "difficulty-selector";
difficultySelector.innerHTML = `
    <button class="difficulty-btn" data-difficulty="easy">Easy</button>
    <button class="difficulty-btn active" data-difficulty="normal">Normal</button>
    <button class="difficulty-btn" data-difficulty="hard">Hard</button>
`;
document.body.appendChild(difficultySelector);

// Handle difficulty selection
document.querySelectorAll('.difficulty-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.difficulty-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        difficulty = this.dataset.difficulty;
        updateTimerSettings();
    });
});

function updateTimerSettings() {
    switch(difficulty) {
        case "easy":
            timeLeft = 7;
            break;
        case "normal":
            timeLeft = 5;
            break;
        case "hard":
            timeLeft = 3;
            break;
    }
}

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
    sounds.button.play();
    setTimeout(function () {
        btn.classList.remove("flash");
    }, 500); // Increased duration for better visibility
}

// Make the button black when clicked (used for user input)
function btnBlack(btn) {
    btn.classList.add("black");
    sounds.button.play();
    setTimeout(function () {
        btn.classList.remove("black");
    }, 300);
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
    clearTimeout(timeoutId);
    clearInterval(timerInterval);
    timeLeft = difficulty === "easy" ? 7 : difficulty === "normal" ? 5 : 3;
    updateTimerDisplay();
    
    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            gameOver("timeout");
        }
    }, 1000);
    
    timeoutId = setTimeout(() => {
        gameOver("timeout");
    }, timeLeft * 1000);
}

function updateTimerDisplay() {
    timerDisplay.textContent = `Time: ${timeLeft}s`;
    timerDisplay.style.width = `${(timeLeft / (difficulty === "easy" ? 7 : difficulty === "normal" ? 5 : 3)) * 100}%`;
}

function gameOver(reason) {
    clearInterval(timerInterval);
    clearTimeout(timeoutId);
    
    if (reason === "wrong") {
        sounds.wrong.play();
    }
    
    h2.innerHTML = `Game Over! Your score was <b>${level}</b> <br> Press any key to start again.`;
    document.body.classList.add("game-over");
    
    let allBtns = document.querySelectorAll(".btn");
    allBtns.forEach(btn => btn.classList.add("wrong"));
    
    setTimeout(function () {
        document.body.classList.remove("game-over");
        allBtns.forEach(btn => btn.classList.remove("wrong"));
    }, 500);
    
    reset();
}

// Check the user's answer
function checkAns(idx) {
    if (userSeq[idx] === gameSeq[idx]) {
        // If the user's sequence matches so far
        if (userSeq.length === gameSeq.length) {
            sounds.correct.play();
            // Add success feedback
            let lastBtn = document.querySelector(`#${userSeq[idx]}`);
            lastBtn.classList.add("success");
            setTimeout(() => {
                lastBtn.classList.remove("success");
            }, 500);
            
            // Increase score multiplier for fast responses
            if (timeLeft > (difficulty === "easy" ? 5 : difficulty === "normal" ? 3 : 1)) {
                scoreMultiplier += 0.1;
                h2.innerHTML = `Level ${level} <br> Score Multiplier: x${scoreMultiplier.toFixed(1)}`;
            }
            
            setTimeout(levelUp, 1000);
        }
    } else {
        gameOver("wrong");
    }
}

// Reset the game
function reset() {
    started = false;
    gameSeq = [];
    userSeq = [];
    level = 0;
    scoreMultiplier = 1;
    clearTimeout(timeoutId);
    clearInterval(timerInterval);
    timeLeft = difficulty === "easy" ? 7 : difficulty === "normal" ? 5 : 3;
    updateTimerDisplay();
}

// Add event listeners to all buttons
let allBtns = document.querySelectorAll(".btn");
for (let btn of allBtns) {
    btn.addEventListener("click", btnPress);
}