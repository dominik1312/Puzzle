// puzzle.js
document.getElementById('fileInput').addEventListener('change', handleImageUpload);

let moveCount = 0;

function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.src = e.target.result;
        img.onload = function() {
            createPuzzle(img);
        };
    };
    reader.readAsDataURL(file);
}

function createPuzzle(image) {
    const puzzleContainer = document.getElementById('puzzleContainer');
    puzzleContainer.innerHTML = ''; // Clear any existing puzzle pieces
    moveCount = 0; // Reset move counter
    updateMoveCounter(); // Update the counter display

    const pieceWidth = 100;
    const pieceHeight = 100;

    let pieces = [];
    for (let y = 0; y < 4; y++) {
        for (let x = 0; x < 4; x++) {
            if (x === 3 && y === 3) break; // Leave one empty space

            const canvas = document.createElement('canvas');
            canvas.width = pieceWidth;
            canvas.height = pieceHeight;
            const context = canvas.getContext('2d');

            context.drawImage(
                image,
                x * pieceWidth, y * pieceHeight, pieceWidth, pieceHeight,
                0, 0, pieceWidth, pieceHeight
            );

            const piece = document.createElement('div');
            piece.classList.add('puzzlePiece');
            piece.style.backgroundImage = `url(${canvas.toDataURL()})`;
            piece.style.backgroundPosition = `-${x * pieceWidth}px -${y * pieceHeight}px`;
            piece.dataset.position = `${x}-${y}`;

            pieces.push(piece);
        }
    }

    shuffle(pieces);
    pieces.forEach(piece => puzzleContainer.appendChild(piece));

    // Add an empty space
    const emptyPiece = document.createElement('div');
    emptyPiece.classList.add('puzzlePiece');
    emptyPiece.style.backgroundColor = '#f0f0f0';
    puzzleContainer.appendChild(emptyPiece);

    // Add event listeners for swapping pieces
    puzzleContainer.addEventListener('click', swapPieces);
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function swapPieces(event) {
    const clickedPiece = event.target;
    if (!clickedPiece.classList.contains('puzzlePiece')) return;

    const emptyPiece = document.querySelector('#puzzleContainer .puzzlePiece:last-child');
    const emptyIndex = Array.from(emptyPiece.parentElement.children).indexOf(emptyPiece);
    const clickedIndex = Array.from(clickedPiece.parentElement.children).indexOf(clickedPiece);

    const validMoves = [
        emptyIndex - 1, emptyIndex + 1, // Left and Right
        emptyIndex - 4, emptyIndex + 4  // Up and Down
    ];

    if (validMoves.includes(clickedIndex) &&
        (clickedIndex === emptyIndex - 1 && emptyIndex % 4 !== 0 ||
         clickedIndex === emptyIndex + 1 && (emptyIndex + 1) % 4 !== 0 ||
         clickedIndex === emptyIndex - 4 || clickedIndex === emptyIndex + 4)) {
        // Swap pieces
        [clickedPiece.style.order, emptyPiece.style.order] = [emptyPiece.style.order, clickedPiece.style.order];
        emptyPiece.parentElement.insertBefore(emptyPiece, clickedPiece.nextSibling);
        moveCount++; // Increment move count
        updateMoveCounter(); // Update the counter display
    }
}

function updateMoveCounter() {
    document.getElementById('moveCounter').textContent = `Mozgatások száma: ${moveCount}`;
}
window.onload = function () {
  
    var seconds = 00; 
    var tens = 00; 
    var appendTens = document.getElementById("tens")
    var appendSeconds = document.getElementById("seconds")
    var buttonStart = document.getElementById('button-start');
    var buttonStop = document.getElementById('button-stop');
    var buttonReset = document.getElementById('button-reset');
    var Interval ;
  
    buttonStart.onclick = function() {
      
      clearInterval(Interval);
       Interval = setInterval(startTimer, 10);
    }
    
      buttonStop.onclick = function() {
         clearInterval(Interval);
    }
    
  
    buttonReset.onclick = function() {
       clearInterval(Interval);
      tens = "00";
        seconds = "00";
      appendTens.innerHTML = tens;
        appendSeconds.innerHTML = seconds;
    }
    
     
    
    function startTimer () {
      tens++; 
      
      if(tens <= 9){
        appendTens.innerHTML = "0" + tens;
      }
      
      if (tens > 9){
        appendTens.innerHTML = tens;
        
      } 
      
      if (tens > 99) {
        console.log("seconds");
        seconds++;
        appendSeconds.innerHTML = "0" + seconds;
        tens = 0;
        appendTens.innerHTML = "0" + 0;
      }
      
      if (seconds > 9){
        appendSeconds.innerHTML = seconds;
      }
    
    }
    
  
  }
