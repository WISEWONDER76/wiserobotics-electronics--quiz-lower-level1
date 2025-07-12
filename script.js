const questions = [
    // LEDs (5 questions)
    { question: "What is an LED?", options: ["A loud speaker", "A tiny light", "A soft pillow"], correct: 1, topic: "LEDs" },
    { question: "Which part of an LED lights up?", options: ["Its legs", "Its body", "All of it"], correct: 1, topic: "LEDs" },
    { question: "Do LEDs use a lot of power?", options: ["Yes, very much", "No, just a little", "Only sometimes"], correct: 1, topic: "LEDs" },
    { question: "What does an LED need to light up?", options: ["Water", "Electricity", "Sunshine"], correct: 1, topic: "LEDs" },
    { question: "Can you put an LED in backwards?", options: ["Yes, it will still light up", "No, it won't light up", "It will sing"], correct: 1, topic: "LEDs" },

    // Resistors (4 questions)
    { question: "What does a resistor do to electricity?", options: ["Makes it go super fast", "Slows it down a little", "Makes it shiny"], correct: 1, topic: "Resistors" },
    { question: "A resistor protects lights from getting too much ____.", options: ["Air", "Water", "Electricity"], correct: 2, topic: "Resistors" },
    { question: "How can you tell different resistors apart?", options: ["By their smell", "By their color bands", "By their taste"], correct: 1, topic: "Resistors" },
    { question: "Are resistors big or small?", options: ["Usually tiny", "Always very big", "As big as a house"], correct: 0, topic: "Resistors" },

    // Switches (4 questions)
    { question: "What does a switch do?", options: ["Makes noise", "Turns things on or off", "Draws pictures"], correct: 1, topic: "Switches" },
    { question: "When a switch is OFF, can electricity go through?", options: ["Yes", "No", "Only some"], correct: 1, topic: "Switches" },
    { question: "When a switch is ON, electricity can ____.", options: ["Stop", "Flow", "Hide"], correct: 1, topic: "Switches" },
    { question: "Is a light switch in your house a type of switch?", options: ["Yes, exactly", "No, it's magic", "Only for big lights"], correct: 0, topic: "Switches" },

    // Jumpers (4 questions)
    { question: "What are jumper wires for?", options: ["Jumping high", "Connecting parts together", "Eating spaghetti"], correct: 1, topic: "Jumpers" },
    { question: "Why do jumpers come in many colors?", options: ["To be pretty", "To help us know where to connect", "To trick us"], correct: 1, topic: "Jumpers" },
    { question: "Do jumper wires need to be soldered?", options: ["Yes, always", "No, just push them in", "Only on Tuesdays"], correct: 1, topic: "Jumpers" },
    { question: "Can a jumper wire carry electricity?", options: ["Yes", "No", "Only cold electricity"], correct: 0, topic: "Jumpers" },

    // Breadboards (4 questions)
    { question: "What is a breadboard for?", options: ["Making toast", "Building circuits without glue", "Playing games"], correct: 1, topic: "Breadboards" },
    { question: "Do you need special tools to use a breadboard?", options: ["Yes, a big hammer", "No, just your fingers", "Only a spoon"], correct: 1, topic: "Breadboards" },
    { question: "Are the holes on a breadboard connected?", options: ["Yes, like little tunnels", "No, they are all separate", "Only some of them"], correct: 0, topic: "Breadboards" },
    { question: "Is it easy to change a circuit on a breadboard?", options: ["Yes, you can move things easily", "No, it's stuck forever", "Only a little bit"], correct: 0, topic: "Breadboards" },

    // Batteries (4 questions)
    { question: "What does a battery give to your toys?", options: ["Light", "Power", "Noise"], correct: 1, topic: "Batteries" },
    { question: "A battery has a positive (+) and a ____ (-) side.", options: ["Happy", "Negative", "Silly"], correct: 1, topic: "Batteries" },
    { question: "What happens if you put a battery in backwards?", options: ["It works better", "It won't work", "It sings a song"], correct: 1, topic: "Batteries" },
    { question: "Is a phone battery a type of battery?", options: ["Yes", "No", "Only a small one"], correct: 0, topic: "Batteries" }
];

let currentQuestionIndex = 0;
let correctAnswersCount = 0; 
let selectedAnswer = null;
let studentName = '';
let backgroundMusic = null;
let successAudio = null;

const TOTAL_QUESTIONS = questions.length;

function startQuiz() {
    studentName = document.getElementById('studentNameInput').value.trim();
    if (studentName === '') {
        alert('Please enter your name to start the quiz!');
        return;
    }

    shuffleArray(questions); // Shuffle all questions at the start

    document.getElementById('startScreen').style.display = 'none';
    document.getElementById('quizScreen').style.display = 'block';
    
    if (backgroundMusic) {
        backgroundMusic.play().catch(e => console.error("Error playing background music:", e));
    }
    loadQuestion();
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; 
    }
}

function loadQuestion() {
    const q = questions[currentQuestionIndex];
    document.getElementById('questionNumber').textContent = `Question ${currentQuestionIndex + 1} of ${TOTAL_QUESTIONS}`;
    document.getElementById('question').textContent = q.question;
    
    const optionsDiv = document.getElementById('options');
    optionsDiv.innerHTML = '';
    
    const shuffledOptions = [...q.options]; 
    const originalCorrectIndex = q.correct; 

    const indexedOptions = shuffledOptions.map((text, idx) => ({ text, originalIdx: idx }));
    shuffleArray(indexedOptions); 

    // Find the new index of the correct answer in the shuffled options
    q.shuffledCorrect = indexedOptions.findIndex(item => item.originalIdx === originalCorrectIndex);


    indexedOptions.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'option';
        div.textContent = item.text;
        div.onclick = () => selectOption(index);
        optionsDiv.appendChild(div);
    });
    
    document.getElementById('submitBtn').style.display = 'inline-block';
    document.getElementById('submitBtn').disabled = true;
    document.getElementById('skipBtn').style.display = 'inline-block';
    selectedAnswer = null;
    
    updateProgress();
    updateCurrentScoreDisplay(); 
}

function selectOption(index) {
    selectedAnswer = index;
    const options = document.querySelectorAll('.option');
    options.forEach((option, i) => {
        option.classList.remove('selected');
        if (i === index) {
            option.classList.add('selected');
        }
    });
    document.getElementById('submitBtn').disabled = false;
}

function submitAnswer() {
    if (selectedAnswer === null) {
        alert('Please select an answer or skip the question.');
        return;
    }

    const q = questions[currentQuestionIndex];
    if (selectedAnswer === q.shuffledCorrect) {
        correctAnswersCount++; 
    }
    
    goToNextQuestion();
}

function skipQuestion() {
    goToNextQuestion();
}

function goToNextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < TOTAL_QUESTIONS) {
        loadQuestion();
    } else {
        showResults();
    }
}

function updateProgress() {
    const progress = ((currentQuestionIndex) / TOTAL_QUESTIONS) * 100; 
    document.getElementById('progressBar').style.width = progress + '%';
}

function updateCurrentScoreDisplay() {
    const currentPercentage = TOTAL_QUESTIONS > 0 ? (correctAnswersCount / TOTAL_QUESTIONS) * 100 : 0;
    document.getElementById('currentScore').textContent = `Score: ${currentPercentage.toFixed(0)}%`;
}

function showResults() {
    document.getElementById('quizScreen').style.display = 'none';
    document.getElementById('resultScreen').style.display = 'block';
    
    if (backgroundMusic) {
        backgroundMusic.pause();
        backgroundMusic.currentTime = 0; 
    }

    const finalPercentage = TOTAL_QUESTIONS > 0 ? (correctAnswersCount / TOTAL_QUESTIONS) * 100 : 0;
    const finalScoreElement = document.getElementById('finalScore');
    const performanceElement = document.getElementById('performance');
    const studentNameDisplay = document.getElementById('studentNameDisplay');
    const badgeContainer = document.getElementById('badgeContainer');

    studentNameDisplay.textContent = `Little Engineer: ${studentName}!`;
    finalScoreElement.textContent = `${finalPercentage.toFixed(0)}%`; 
    badgeContainer.innerHTML = '';

    let badgeClass = '';
    let performanceMessage = '';

    if (finalPercentage >= 80) {
        finalScoreElement.className = 'final-score excellent';
        performanceMessage = '<h3>Awesome job! 🌟</h3><p>You\'re an electronics superstar!</p>';
        badgeClass = 'gold';
        playSuccessMusic();
    } else if (finalPercentage >= 60) {
        finalScoreElement.className = 'final-score good';
        performanceMessage = '<h3>Great work! 👍</h3><p>You\'re learning so much!</p>';
        badgeClass = 'silver';
    } else {
        finalScoreElement.className = 'final-score needs-improvement';
        performanceMessage = "<h3>Keep trying! 📚</h3><p>You'll get even better next time!</p>";
        badgeClass = 'bronze';
    }

    performanceElement.innerHTML = performanceMessage;
    
    const badgeElement = document.createElement('div');
    badgeElement.className = `badge ${badgeClass}`;
    badgeElement.textContent = `${badgeClass.charAt(0).toUpperCase() + badgeClass.slice(1)} Badge`;
    badgeContainer.appendChild(badgeElement);
}

function playSuccessMusic() {
    if (successAudio) {
        successAudio.play().catch(e => console.error("Error playing success audio:", e));
    }
}

function restartQuiz() {
    currentQuestionIndex = 0;
    correctAnswersCount = 0; 
    selectedAnswer = null;
    studentName = '';
    document.getElementById('studentNameInput').value = '';
    document.getElementById('resultScreen').style.display = 'none';
    document.getElementById('startScreen').style.display = 'block';
    document.getElementById('progressBar').style.width = '0%';
    
    if (successAudio) {
        successAudio.pause();
        successAudio.currentTime = 0;
    }
    if (backgroundMusic) {
        backgroundMusic.pause();
        backgroundMusic.currentTime = 0;
    }

    shuffleArray(questions); // Reshuffle for a new game
    updateCurrentScoreDisplay(); 
}

document.addEventListener('DOMContentLoaded', function() {
    updateCurrentScoreDisplay(); 
    // No need to shuffle here, as it's done in startQuiz

    backgroundMusic = document.getElementById('backgroundMusic');
    successAudio = document.getElementById('successAudio');
    const volumeControl = document.getElementById('volumeControl');

    // Set initial volume
    backgroundMusic.volume = volumeControl.value;
    successAudio.volume = volumeControl.value;

    volumeControl.addEventListener('input', function() {
        if (backgroundMusic) {
            backgroundMusic.volume = this.value;
        }
        if (successAudio) {
            successAudio.volume = this.value;
        }
    });

    // Set initial volumes to 0 and allow user interaction to enable sound
    // backgroundMusic.volume = 0; 
    // successAudio.volume = 0; 
});