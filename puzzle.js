document.getElementById('imageUpload').addEventListener('change', handleImageUpload);

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

function createPuzzle(image) 
  const puzzleContainer = document.getElementById('puzzleContainer');
  puzzleContainer.innerHTML = ''; // Clear any existing puzzle pieces

  const pieceWidth = image.width / 5; // Calculate piece width based on image size
  const pieceHeight = image.height / 3; // Calculate piece height based on image size

  let pieces = [];
  for (let y = 0; y < 5; y++) {
    for (let x = 0; x < 3; x++) {
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
      piece.dataset.position = `<span class="math-inline">\{x\}\-</span>{y}`;

      // Add a unique ID to each piece (1-15, excluding the empty space)
      const pieceID = x + y * 5 + 1; // Calculate the ID for the piece
      if (pieceID < 15) {
        piece.setAttribute('id', `piece-${pieceID}`);
      }

      pieces.push(piece);
    }
  }

  shuffle(pieces);
  pieces.forEach(piece => puzzleContainer.appendChild(piece));

  // Add event listeners for dragging and dropping pieces
  puzzleContainer.addEventListener('dragstart', handleDragStart);
  puzzleContainer.addEventListener('dragover', handleDragOver);
  puzzleContainer.addEventListener('drop', handleDrop);

  // Add event listeners for moving pieces with mouse click and drag
  puzzleContainer.addEventListener('mousedown', handleMouseDown);
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', handleMouseUp);

  // Function to handle drag start event
  function handleDragStart(event) {
    const draggedPiece = event.target;
    if (!draggedPiece.classList.contains('puzzlePiece')) return;

    draggedPiece.style.cursor = 'grab';
    event.dataTransfer.setData('text/plain', draggedPiece.id);
  }

  // Function to handle drag over event
  function handleDragOver(event) {
    event.preventDefault();
  }

  // Function to handle drop event
  function handleDrop(event) {
    event.preventDefault();

    const droppedPieceID = event.dataTransfer.getData('text/plain');
    const droppedPiece = document.getElementById(droppedPieceID);
    if (!droppedPiece) return;

    const targetPosition = event.target.dataset.position;
    const currentPosition = droppedPiece.dataset.position;

    // Calculate the difference in positions
    const dx = targetPosition.split('-')[0] - currentPosition.split('-')[0];
    const dy = targetPosition.split('-')[1] - currentPosition.split('-')[1];

    // Check if the move is valid (within the same row or column)
    if (Math.abs(dx) <= 1 && Math.abs(dy) <= 1) {
      // Swap positions of the pieces
      const targetPiece = document.querySelector(`[data-position="${targetPosition}"]`);
      targetPiece.dataset.position = currentPosition;
      droppedPiece.dataset.position = targetPosition;

      // Swap the pieces in the DOM
      puzzleContainer.insertBefore(droppedPiece, targetPiece);
    }

    droppedPiece.style.cursor = 'default';
  }