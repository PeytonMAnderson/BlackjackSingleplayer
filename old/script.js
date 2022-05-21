//Create Canvas
const canvas = document.querySelector('.myCanvas');
const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;
const ctx = canvas.getContext('2d');
ctx.fillStyle = 'rgb(0,0,0)';
ctx.fillRect(0,0,width,height);

//const colorPicker = document.querySelector('input[type="color"]');
//const sizePicker = document.querySelector('input[type="range"]');
//const output = document.querySelector('.output');
//const clearBtn = document.querySelector('button');
//sizePicker.addEventListener('input', () => output.textContent = sizePicker.value);
canvas.addEventListener('mousedown', () => pressed = true);
canvas.addEventListener('mouseup', () => pressed = false);

//clearBtn.addEventListener('click', () => {
//  ctx.fillStyle = 'rgb(0,0,0)';
//  ctx.fillRect(0,0,width,height);
//});

//Initialize Variables
var curX;
var curY;
var offsetX;
var offsetY;
var ratioX;
var ratioY;
updateOffset();
let pressed = false;
var pad = 5;

if(width > height) {
  var fontSize = height/16;
  var pad = height/64;
  var cardSize = height/8;
} else if (height > width) {
  var fontSize = width/20;
  var pad = width/80;
  var cardSize = width/8;
} else {
  var fontSize = height/16;
  var pad = height/64;
  var cardSize = height/8;
}


//Current card on top of deck
var i = 0;

//Value of gamestate 0 = unset, 1 = betting, 2 = dealing, 3 = playing, 4 = round over
var gameState = 0;

//Player Values
let playerCardsNum = 0;
let playerTotal = 0;
let playerBet = 0;
let playerHand = new Array();
let playerBank = 2000;

//Dealer Values
let dealerCardsNum = 0;
let dealerTotal = 0;
let dealerHand = new Array();


//Create deck of cards
let deck = [ 1, 2, 3, 4, 5, 6, 7, 8 , 9 , 10, 11, 12, 13,
            14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26,
            27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39,
            40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52 ];

// update mouse pointer coordinates on canvas
document.addEventListener('mousemove', e => {
  curX = e.clientX/ratioX-offsetX/ratioX;
  curY = e.clientY/ratioY-offsetY/ratioY;
});

//If window changes, update canvas offsets
window.onscroll=function(e){ updateOffset(); }
window.onresize=function(e){ updateOffset(); }

//If player clicks screen
canvas.addEventListener('click', function(evt) {
    updateOffset();
    if(gameState == 1) {
      betOrFold();
    } else if(gameState == 2) {
      dealGame();
    } else if(gameState == 3) {
      hitOrStay();
    } else if(gameState == 4) {
      endTheRound();
    } else if(gameState == 5) {
      playerCardsNum = 0;
      playerTotal = 0;
      playerBet = 0;
      dealerCardsNum = 0;
      dealerTotal = 0;
      playerHand.length = 0;
      dealerHand.length = 0;
      i = 0;
      shuffle(deck);
      drawBetScreen();
    }
}, false);

function betOrFold() {
  //Right Side of Screen
  if(curX >= width-width/4 && curX <= width) {
    if(curY >= height-height/8 && curY <= height) {
      //Fold Button
      playerBank = playerBank + playerBet;
      playerBet = 0;
      drawBetScreen();
    } else if(curY >= height-height/4-pad && curY <= height-height/8-pad) {
      //$1
      if(playerBank >= 1) {
        playerBet = playerBet + 1;
        playerBank = playerBank - 1;
        draw_text('Bet: $'+playerBet, '255,255,255', '0,0,0', "italic bold " + fontSize/2 + "pt Tahoma", 'center', width-width/8, height-height/2-height/8-pad*5, width/4);
        draw_text('Payout: $'+playerBet*2, '255,255,255', '0,0,0', "italic bold " + fontSize/2 + "pt Tahoma", 'center', width-width/8, height-height/2-height/8-(fontSize/2)*1.5-pad*6, width/4);
        draw_text('Bank: $'+playerBank, '255,255,255', '0,0,0', "italic bold " + fontSize + "pt Tahoma", 'center', width/2, height-pad, width/2-2);
      }
    } else if(curY >= height-height/4-height/8-pad*2 && curY <= height-height/4-pad*2) {
      //$10
      if(playerBank >= 10) {
        playerBet = playerBet + 10;
        playerBank = playerBank - 10;
        draw_text('Bet: $'+playerBet, '255,255,255', '0,0,0', "italic bold " + fontSize/2 + "pt Tahoma", 'center', width-width/8, height-height/2-height/8-pad*5, width/4);
        draw_text('Payout: $'+playerBet*2, '255,255,255', '0,0,0', "italic bold " + fontSize/2 + "pt Tahoma", 'center', width-width/8, height-height/2-height/8-(fontSize/2)*1.5-pad*6, width/4);
        draw_text('Bank: $'+playerBank, '255,255,255', '0,0,0', "italic bold " + fontSize + "pt Tahoma", 'center', width/2, height-pad, width/2-2);
      }
    } else if(curY >= height-height/2-pad*3 && curY <= height-height/4-height/8-pad*3) {
      //$100
      if(playerBank >= 100) {
        playerBet = playerBet + 100;
        playerBank = playerBank - 100;
        draw_text('Bet: $'+playerBet, '255,255,255', '0,0,0', "italic bold " + fontSize/2 + "pt Tahoma", 'center', width-width/8, height-height/2-height/8-pad*5, width/4);
        draw_text('Payout: $'+playerBet*2, '255,255,255', '0,0,0', "italic bold " + fontSize/2 + "pt Tahoma", 'center', width-width/8, height-height/2-height/8-(fontSize/2)*1.5-pad*6, width/4);
        draw_text('Bank: $'+playerBank, '255,255,255', '0,0,0', "italic bold " + fontSize + "pt Tahoma", 'center', width/2, height-pad, width/2-2);
      }
    } else if(curY >= height-height/2-height/8-pad*4 && curY <= height-height/2-pad*4) {
      //$1000
      if(playerBank >= 1000) {
        playerBet = playerBet + 1000;
        playerBank = playerBank - 1000;
        draw_text('Bet: $'+playerBet, '255,255,255', '0,0,0', "italic bold " + fontSize/2 + "pt Tahoma", 'center', width-width/8, height-height/2-height/8-pad*5, width/4);
        draw_text('Payout: $'+playerBet*2, '255,255,255', '0,0,0', "italic bold " + fontSize/2 + "pt Tahoma", 'center', width-width/8, height-height/2-height/8-(fontSize/2)*1.5-pad*6, width/4);
        draw_text('Bank: $'+playerBank, '255,255,255', '0,0,0', "italic bold " + fontSize + "pt Tahoma", 'center', width/2, height-pad, width/2-2);
      }
    }
  //Left Side of Screen
  } else if(curX >= 0 && curX <= width/4) { 
    if(curY >= height-height/8 && curY <= height) {
      //Bet Button
      dealGame();
    }
  }
}

async function dealGame() {
  gameState = 0;
  await drawDealScreen();
  await delay(500);
  if(playerTotal == 21) {
    gameState = 4;
    endTheRound();
  } else {
    gameState = 3;
    drawPlayScreen();
  }
}

function hitOrStay() {
  gameState = 3;
  if(curY >= height-height/8 && curY <= height) {
    if(curX >= 0 && curX <= width/4) {
      addPlayerCard();
      draw_text('Current Hand: '+playerTotal, '255,255,255', '0,0,0', "italic bold " + fontSize/2 + "pt Tahoma", 'center', width/8, height-height/8-pad, width/4);
    } else if(curX >= width-width/4 && curX <= width) {
      gameState = 4;
      endTheRound();
    }
  }
}

async function endTheRound() {
  gameState = 0;
  buildCard(dealerHand[0], width/2+pad, height/64);
  draw_text('Dealer Hand: '+dealerTotal, '255,255,255', '0,0,0', "italic bold " + fontSize/2 + "pt Tahoma", 'center', width/8, height-(fontSize/2)*1.5-height/8-pad*2, width/4);
  await delay(500);
  while(dealerTotal < 17) {
    addDealerCard();
    draw_text('Dealer Hand: '+dealerTotal, '255,255,255', '0,0,0', "italic bold " + fontSize/2 + "pt Tahoma", 'center', width/8, height-(fontSize/2)*1.5-height/8-pad*2, width/4);
    await delay(500);
  }
  //If Player Busts
  if(playerTotal == 'BUST') {
    lostGame();
  
  //If Player Natrual Blackjack
  } else if (playerTotal == 21 && playerHand.length == 2) {
    //If Dealer Also Natural Blackjack
    if(dealerTotal == 21 && dealerHand.length == 2) {
      tiedGame();  
    } else {
      wonGame(true);
    }
  //Then compare Player to Dealer 
  } else {
    //If Dealer Has Natural Blackjack
    if(dealerTotal == 21 && dealerHand.length == 2) {
    
    //If Dealer Won Hand
    } else if (dealerTotal > playerTotal) {
      lostGame();
    //If Dealer Tied with Player
    } else if (dealerTotal == playerTotal) {
      tiedGame();
    //Dealer Lost against Player
    } else {
      wonGame(false);
    }
  }
  gameState = 5;
}

function wonGame(naturalBJ) {
  draw_text('W', '0,255,0', '0,0,0', "italic bold " + fontSize*4 + "pt Tahoma", 'center', width/2, height/2+fontSize*2, width/2);
  if(naturalBJ == true) {
    playerBank = playerBank + playerBet*3;
  } else {
    playerBank = playerBank + playerBet*2;
  }
}

function tiedGame() {
  draw_text('T', '255,127,0', '0,0,0', "italic bold " + fontSize*4 + "pt Tahoma", 'center', width/2, height/2+fontSize*2, width/2);
  playerBank = playerBank + playerBet;
  draw_text('Bank: $'+playerBank, '255,255,255', '0,0,0', "italic bold " + fontSize + "pt Tahoma", 'center', width/2, height-pad, width/2-2);
}

function lostGame() {
  draw_text('L', '255,0,0', '0,0,0', "italic bold " + fontSize*4 + "pt Tahoma", 'center', width/2, height/2+fontSize*2, width/2);
}

// covert degrees to radians
function degToRad(degrees) {
  return degrees * Math.PI / 180;
};

//Update canvas offsets and canvas scale
function updateOffset() {
    var rect = canvas.getBoundingClientRect();
    offsetX = rect.left;
    offsetY = rect.top;
    ratioX = (rect.right-rect.left)/width;
    ratioY = (rect.bottom-rect.top)/height;
}

//Create card graphics
function buildCard(value, cardPosX, cardPosY) {
    ctx.fillStyle = 'rgb(255,255,255)';
    ctx.fillRect(cardPosX, cardPosY, cardSize, cardSize*1.5);
    let cardSuite = calcSuite(value);
    let cardValue = calcFaceValue(value);
    if(cardValue != undefined) {
      if (cardSuite == "Hearts" || cardSuite == "Diamonds") {
        ctx.fillStyle = 'rgb(255,0,0)';
        ctx.font = "italic bold " + fontSize + "pt Tahoma";
        ctx.textAlign = 'start';
        ctx.fillText(cardValue, cardPosX, cardPosY+cardSize/2, cardSize);
        if(cardSuite == "Hearts") {
          make_image('https://cdn.glitch.global/49c43ddd-2b58-4c85-a71b-d68711b76a74/heart.png?v=1649389709696', cardPosX, cardPosY+(cardSize*0.5), cardSize, cardSize);
        }
        if(cardSuite == "Diamonds") {
          make_image('https://cdn.glitch.global/49c43ddd-2b58-4c85-a71b-d68711b76a74/diamond.png?v=1649389707365', cardPosX, cardPosY+(cardSize*0.5), cardSize, cardSize);
        }
      } else {
        ctx.fillStyle = 'rgb(0,0,0)';
        ctx.font = "italic bold " + fontSize + "pt Tahoma";
        ctx.textAlign = 'start';
        ctx.fillText(cardValue, cardPosX, cardPosY+cardSize/2, cardSize);
        if(cardSuite == "Spades") {
          make_image('https://cdn.glitch.global/49c43ddd-2b58-4c85-a71b-d68711b76a74/spade.png?v=1649389711914', cardPosX, cardPosY+(cardSize*0.5), cardSize, cardSize);
        }
        if(cardSuite == "Clubs") {
          make_image('https://cdn.glitch.global/49c43ddd-2b58-4c85-a71b-d68711b76a74/club.png?v=1649389703140', cardPosX, cardPosY+(cardSize*0.5), cardSize, cardSize);
        }
      }
    } else {
        ctx.fillStyle = 'rgb(0,0,0)';
        ctx.fillRect(cardPosX-1, cardPosY-1, 102, 152);
    }
}

//Calcuate suite of current card
function calcSuite(cardValue) {
  if(cardValue >= 1 && cardValue <= 13)
    return "Clubs";
  if(cardValue >= 14 && cardValue <= 26)
    return "Spades";
  if(cardValue >= 27 && cardValue <= 39)
    return "Hearts";
  if(cardValue >= 40 && cardValue <= 52)
    return "Diamonds";
}

//Calculate number value of current card for each suite
function calcValue(cardValue) {
  if(cardValue >= 1 && cardValue <= 13)
    return cardValue;
  if(cardValue >= 14 && cardValue <= 26)
    return cardValue-13;
  if(cardValue >= 27 && cardValue <= 39)
    return cardValue-26;
  if(cardValue >= 40 && cardValue <= 52)
    return cardValue-39;
}

//Calculate the blackjack value of the current hand
function calcBlackjackValue(newHand) {
  let totalValue = 0;
  let aces = 0;
  for(let k = 0; k < newHand.length; k++) {
    let currentCard = calcValue(newHand[k]);
    if (currentCard >= 0 && currentCard <= 9) {
      //If new card busts but hand has ace, use ace
      if(totalValue + currentCard + 1 > 21 && aces >= 1) {
        totalValue = totalValue - 10 + currentCard + 1;
        aces--;
      } else {
        totalValue = totalValue + currentCard + 1;  
      }
    }
    //If new card is Face card, add 10
    if (currentCard >= 10 && currentCard <= 12) {
      //If new card busts but hand has ace, use ace
      if(totalValue + 10 > 21 && aces >= 1) {
        totalValue = totalValue;
        aces--;
      } else {
        totalValue = totalValue + 10;  
      }  
    }
    //If new card is Ace, add 11
    if(currentCard == 13) {
      if(totalValue + 11 <= 21) {
        totalValue = totalValue + 11;
        aces++;
      } else if(totalValue + 11 > 21) {
        totalValue = totalValue + 1;
      }
    }
    if(totalValue > 21) {
      return 'BUST';
    }
  }
  return totalValue;
}

//Calculate what number/letter appears on the card
function calcFaceValue(cardValue) {
    let crudeValue = calcValue(cardValue);
    if(crudeValue >= 1 && crudeValue <= 9) {
      crudeValue++;
      return crudeValue;
    }
    if(crudeValue == 10)
      return "J";
    if(crudeValue == 11)
      return "Q";
    if(crudeValue == 12)
      return "K";
    if(crudeValue == 13)
      return "A";
}

//Randomly shuffle the current deck of cards
function shuffle(array) {
  let currentIndex = array.length,  randomIndex;
  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
}

//Create an image at given location
function make_image(imageSRC, xwidth, yheight, xSize, ySize)
{
  let base_image = new Image();
  base_image.src = imageSRC;
  base_image.onload = function(){
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(base_image, xwidth, yheight, xSize, ySize);
  }
}

function make_button(string, colorStringText, fontString, bLocX, bLocY, bsizeX, bsizeY, colorStringButton) {
    ctx.fillStyle = 'rgb(' + colorStringButton + ')';
    ctx.fillRect(bLocX, bLocY, bsizeX, bsizeY);
    draw_text(string, colorStringText, colorStringButton, fontString, 'center', bLocX+bsizeX/2, bLocY+bsizeY/2+fontSize/2, bsizeX);
}

function draw_text(string, rgbString, rgbBack, fontString, alignString, posX, posY, widthTotal) {
    //let R = getRandomInt(255);
    //let G = getRandomInt(255);
    //let B = getRandomInt(255);
    //ctx.fillStyle = 'rgb('+R+','+G+','+B+')';
    ctx.fillStyle = 'rgb(' + rgbBack + ')';
    let tempString = fontString.split(" ");
    let fSize = tempString[2];
    fSize = fSize.replace('pt', '');
    ctx.fillRect(posX-widthTotal/2, posY-fSize*1.25, widthTotal, fSize*1.6);
    ctx.fillStyle = 'rgb(' + rgbString + ')';
    ctx.font = fontString;
    ctx.textAlign = alignString;
    ctx.fillText(string, posX, posY, widthTotal);
}

function drawBetScreen() {
  gameState = 1;
  ctx.fillStyle = 'rgb(0,0,0)';
  ctx.fillRect(0,0,width,height);
  
  make_button('Bet', '255,255,255', "italic bold " + fontSize + "pt Tahoma", 0, height-height/8, width/4, height/8, '0,255,0');
  make_button('Clear', '255,255,255', "italic bold " + fontSize + "pt Tahoma", width-width/4, height-height/8, width/4, height/8, '255,0,0');
  make_button('$1', '255,255,255', "italic bold " + fontSize + "pt Tahoma", width-width/4, height-height/4-pad, width/4, height/8, '255,127,0');
  make_button('$10', '255,255,255', "italic bold " + fontSize + "pt Tahoma", width-width/4, height-height/4-height/8-pad*2, width/4, height/8, '255,127,0');
  make_button('$100', '255,255,255', "italic bold " + fontSize + "pt Tahoma", width-width/4, height-height/2-pad*3, width/4, height/8, '255,127,0');
  make_button('$1,000', '255,255,255', "italic bold " + fontSize + "pt Tahoma", width-width/4, height-height/2-height/8-pad*4, width/4, height/8, '255,127,0');
  draw_text('Bet: $'+playerBet, '255,255,255', '0,0,0', "italic bold " + fontSize/2 + "pt Tahoma", 'center', width-width/8, height-height/2-height/8-pad*5, width/4);
  draw_text('Payout: $'+playerBet*2, '255,255,255', '0,0,0', "italic bold " + fontSize/2 + "pt Tahoma", 'center', width-width/8, height-height/2-height/8-(fontSize/2)*1.5-pad*6, width/4);
  draw_text('Bank: $'+playerBank, '255,255,255', '0,0,0', "italic bold " + fontSize + "pt Tahoma", 'center', width/2, height-pad, width/2-2);
}

async function drawDealScreen() {
    ctx.fillStyle = 'rgb(0,0,0)';
    ctx.fillRect(0,0,width,height);
  
    ctx.fillStyle = 'rgb(255,0,0)';
    ctx.fillRect(width/64, height/64, cardSize, cardSize*1.5);
    cardMove(width/64, height/64, width/2+pad, height-fontSize*1.5-cardSize*1.5, 100, drawDealFrame);
    await delay(500);
    drawDealFrame();
    addPlayerCard();
    cardMove(width/64, height/64, width/2+pad, height/64, 100, drawDealFrame);
    await delay(500);
    drawDealFrame();
    addDealerCard();
    cardMove(width/64, height/64, width/2-cardSize-pad, height-fontSize*1.5-cardSize*1.5, 100, drawDealFrame);
    await delay(500);
    drawDealFrame();
    addPlayerCard();
    cardMove(width/64, height/64, width/2-cardSize-pad, height/64, 100, drawDealFrame);
    await delay(550);
    addDealerCard();
    drawDealFrame();

    return;
}
  
function addPlayerCard() {
  if(playerCardsNum % 2 == 0) {
    buildCard(deck[i], width/2+pad, height-fontSize*1.5-cardSize*1.5-playerCardsNum*(cardSize*1.5)/4);
    playerHand[playerCardsNum] = deck[i];
    playerTotal = calcBlackjackValue(playerHand);
    i++;
    playerCardsNum++;
  } else {
    buildCard(deck[i], width/2-cardSize-pad, height-fontSize*1.5-cardSize*1.5-(playerCardsNum-1)*(cardSize*1.5)/4);
    playerHand[playerCardsNum] = deck[i];
    playerTotal = calcBlackjackValue(playerHand);
    i++;
    playerCardsNum++;  
  }
  if(playerTotal == 'BUST' || playerTotal == 21) {
    gameState = 4;
    endTheRound();
  }
}

function addDealerCard() {
  if(dealerCardsNum % 2 == 0) {
    if(dealerCardsNum == 0) {
        ctx.fillStyle = 'rgb(255,0,0)';
        ctx.fillRect(width/2+pad, height/64+dealerCardsNum*20, cardSize, cardSize*1.5);
    } else {
      buildCard(deck[i], width/2+pad, height/64+dealerCardsNum*(cardSize*1.5)/4);
    }
    dealerHand[dealerCardsNum] = deck[i];
    dealerTotal = calcBlackjackValue(dealerHand);
    i++;
    dealerCardsNum++;
  } else {
    buildCard(deck[i], width/2-cardSize-pad, height/64+(dealerCardsNum-1)*(cardSize*1.5)/4);
    dealerHand[dealerCardsNum] = deck[i];
    dealerTotal = calcBlackjackValue(dealerHand);
    i++;
    dealerCardsNum++;  
  }
}

function drawPlayScreen() {
  ctx.fillStyle = 'rgb(0,0,0)';
  ctx.fillRect(0,0,width/4,height);
  ctx.fillRect(width-width/4,0,width/4,height);
  
  ctx.fillStyle = 'rgb(255,0,0)';
  ctx.fillRect(width/64, height/64, cardSize, cardSize*1.5);
  make_button('Hit', '255,255,255', "italic bold " + fontSize + "pt Tahoma", 0, height-height/8, width/4, height/8, '0,255,0');
  make_button('Stay', '255,255,255', "italic bold " + fontSize + "pt Tahoma", width-width/4, height-height/8, width/4, height/8, '255,0,0');
  draw_text('Bet: $'+playerBet, '255,255,255', '0,0,0', "italic bold " + fontSize/2 + "pt Tahoma", 'center', width-width/8, height-height/8-pad, width/4);
  draw_text('Payout: $'+playerBet*2, '255,255,255', '0,0,0', "italic bold " + fontSize/2 + "pt Tahoma", 'center', width-width/8, height-(fontSize/2)*1.5-height/8-pad*2, width/4);
  draw_text('Current Hand: '+playerTotal, '255,255,255', '0,0,0', "italic bold " + fontSize/2 + "pt Tahoma", 'center', width/8, height-height/8-pad, width/4);
  draw_text('Bank: $'+playerBank, '255,255,255', '0,0,0', "italic bold " + fontSize + "pt Tahoma", 'center', width/2, height-pad, width/2-2);
}

function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

//Animation 
function animate() {
  if (pressed) { 
    //ctx.fillStyle = colorPicker.value;
    //ctx.beginPath();
    //ctx.arc(curX, curY, sizePicker.value, degToRad(0), degToRad(360), false);
    //ctx.fill();
  }
  requestAnimationFrame(animate);
}

async function cardMove(srcX, srcY, desX, desY, time, drawFrame) {
  let voX = 0.0;
  let accX = 0.0;
  let voY = 0.0; // 0
  let accY = 0.0; // 0
  if(srcX != desX || srcY != desY) {
    if(srcX != desX) {
      voX = 2*(desX-srcX)/(time); // > 0
      accX = -voX/time;
    }
    if(srcY != desY) {
      voY = 2*(desY-srcY)/(time); // == 0
      accY = -voY/time;
    }
    await cardFrameMove(srcX, srcY, desX, desY, voX, voY, accX, accY, 0, time, drawFrame);
  }
  return;
}

async function cardFrameMove(srcX, srcY, desX, desY, VelsrcX, VelsrcY, AccelX, AccelY, currTime, totalTime, drawFrame) {
  if((srcX != desX || srcY != desY) && currTime < totalTime) {
    drawFrame();
    ctx.fillStyle = 'rgb(255,0,0)';
    ctx.fillRect(srcX+VelsrcX, srcY+VelsrcY, cardSize, cardSize*1.5);
    currTime = currTime + 1;
    let vX = AccelX + VelsrcX;
    let vY = AccelY + VelsrcY;
    await delay(1);
    cardFrameMove(srcX+VelsrcX, srcY+VelsrcY, desX, desY, vX, vY, AccelX, AccelY, currTime, totalTime, drawFrame);
  }
  return;
}

function drawDealFrame() {
    ctx.fillStyle = 'rgb(0,0,0)';
    ctx.fillRect(0,0,width,height);
    ctx.fillStyle = 'rgb(255,0,0)';
    ctx.fillRect(width/64, height/64, cardSize, cardSize*1.5);
    switch(i) {
      case 1:
        buildCard(playerHand[0], width/2+pad, height-fontSize*1.5-cardSize*1.5);
        break;
      case 2:
        buildCard(playerHand[0], width/2+pad, height-fontSize*1.5-cardSize*1.5);
        ctx.fillStyle = 'rgb(255,0,0)';
        ctx.fillRect(width/2+pad, height/64, cardSize, cardSize*1.5);
        break;
      case 3:
        buildCard(playerHand[0], width/2+pad, height-fontSize*1.5-cardSize*1.5);
        buildCard(playerHand[1], width/2-cardSize-pad, height-fontSize*1.5-cardSize*1.5);
        ctx.fillStyle = 'rgb(255,0,0)';
        ctx.fillRect(width/2+pad, height/64, cardSize, cardSize*1.5);
        break;
      case 4:
        buildCard(playerHand[0], width/2+pad, height-fontSize*1.5-cardSize*1.5);
        buildCard(playerHand[1], width/2-cardSize-pad, height-fontSize*1.5-cardSize*1.5);
        buildCard(dealerHand[1], width/2-cardSize-pad, height/64);
        ctx.fillStyle = 'rgb(255,0,0)';
        ctx.fillRect(width/2+pad, height/64, cardSize, cardSize*1.5);
        break;
    }
    return;
}

//Start Game
shuffle(deck);
drawBetScreen();
//make_button('Hit', '255,255,255', 'italic bold 35pt Tahoma', 0, height-height/8, width/4, height/8, '0,255,0');
//make_button('Stay', '255,255,255', 'italic bold 35pt Tahoma', width-width/4, height-height/8, width/4, height/8, '255,0,0');
animate();