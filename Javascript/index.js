import { Card } from '../Models/Card.js';

const images = [
    'A.png', 'A.png',
    'B.png', 'B.png',
    'C.png', 'C.png',
    'D.png', 'D.png',
    'E.png', 'E.png',
    'F.png', 'F.png',
    'G.png', 'G.png',
    'H.png', 'H.png',
  ];

  let cards = [];
  let flippedCards = [];
  let lockBoard = false;
  let gameIsPlaying = false
  let seconds = 30;
  let timerIdInterval = null;
  let gameoverIdInterval = null;



  
  // Shuffle utility
  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
  
 
  
  function initGame() {
    seconds = 30
    const shuffledImages = shuffle([...images]);
    const cardElements = document.querySelectorAll('.card img');

    
    cards = [];
  
    cardElements.forEach((imgEl, index) => {
      const card = new Card(index, './Assets/Back of a card.png', `./Assets/${shuffledImages[index]}`);
      cards.push(card);
      
      // Reset card visuals
      imgEl.src = card.backImage;
      imgEl.dataset.index = index;
      imgEl.addEventListener('click', handleCardClick);
    });
  
    startTimer()
    unlockAll()
  }
  
  function handleCardClick(e) {
    if (lockBoard || !gameIsPlaying) return;

    //get the image element and the card associated with it
    const imgEl = e.target;
    const index = imgEl.dataset.index;
    const card = cards[index];
  
    if (card.isFlipped || card.isMatched) return;
  
    // Flip card
    card.isFlipped = true;
    imgEl.src = card.frontImage;
    flippedCards.push({ card, imgEl });
  
    if (flippedCards.length === 2) {
      lockBoard = true;
      setTimeout(() => {
        checkMatch();
      }, 1000);
    }
  }

  function unlockAll(){
    flippedCards = [];
    lockBoard = false;

    let cardElements = document.querySelectorAll(".card img")
    cardElements.forEach((element) => {
        element.style.opacity = 1
    }) 
  }

  function startTimer(){
    const timerElement = document.getElementById("timer");

    //not starting the interval if one is running
    if (timerIdInterval !== null) {
        return;
    }

    timerIdInterval = setInterval(() => {
        if(gameIsPlaying){
            seconds--;
            let mins = Math.floor(seconds / 60);
            let secs = seconds % 60;
            timerElement.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
        }

        if(seconds === 0){
            alert('oopss you ran out of time! Restarting...');
            clearInterval(timerIdInterval)
            timerIdInterval = null;
            initGame()
        }
        
    },     1000);
  }

  function pausePlay(){
    gameIsPlaying = !gameIsPlaying
    gameIsPlaying ? playpauseButton.innerHTML = "Pause" : playpauseButton.innerHTML = "Play"
  }
  
  function checkMatch() {
    const [first, second] = flippedCards;
  
    if (first.card.frontImage === second.card.frontImage) {
      // Matched!
      first.card.isMatched = true;
      second.card.isMatched = true;
      first.imgEl.style.opacity = '0.5';
      second.imgEl.style.opacity = '0.5';
      seconds += 15
    } else {
      // Not matched
      first.card.isFlipped = false;
      second.card.isFlipped = false;
      first.imgEl.src = first.card.backImage;
      second.imgEl.src = second.card.backImage;
    }
  
    flippedCards = [];
    lockBoard = false;
  
    //restart when all cards matched
    if (cards.every(card => card.isMatched)) {
        if (gameoverIdInterval !== null) {
            return;
        }
        
        gameoverIdInterval = setTimeout(() => {
            alert('Game completed! Restarting...');
            clearInterval(gameoverIdInterval)
            clearInterval(timerIdInterval)
            timerIdInterval = null;
            gameoverIdInterval = null;
            initGame();
        }, 500);
    }
  }
  
  // Start the game when DOM is loaded
  document.addEventListener('DOMContentLoaded', initGame);
  const playpauseButton = document.querySelector('#pausePlay')
  playpauseButton.addEventListener('click',pausePlay)
  