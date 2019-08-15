/*eslint-env browser*/
/* eslint-disable no-console */ //Enables console output

function Reaction(item) 
{
    console.log(item.id);
    var board = GatherBoard();
    // Determine who's turn it is, stored in 'Counter' id
    var turn = parseInt(document.getElementById("Counter").textContent);
    //console.log(turn);
    
    //  Test to see if it's Black Check's turn
    if(turn % 2 == 1 && item.classList.contains("BlackPiece"))
    {
        DeselectAll();
        item.classList.add("Selected");
        ValidMoves(item, board, turn);
    }
    else if(turn % 2 == 0 && item.classList.contains("RedPiece"))
    {
        DeselectAll();
        item.classList.add("Selected");
        ValidMoves(item, board, turn);
    }
    else if(item.classList.contains("Choice"))
            {
             var check = moveChecker(board, document.getElementsByClassName("Selected")[0],item);
             
             if(check) // A piece was just jumped!
                 { // Can we make another jump immediately?
                    check = ComboJump(item);
                 }      
                 
                else // No pieces were jumped, just a normal move
                {
                    DeselectAll();   
                } // End of else statement
                
                // Change inner HTML to reflect current turn
                turn = parseInt(document.getElementById("Counter").textContent);
                if(!check) // Combojump was just executed
                {
                  turn++;
                  document.getElementById("Message").textContent = " ";
                }
                else // Combojump available!
                {
                    document.getElementById("Message").textContent = "One more jump!";
                }

                turn = turn.toString();
                document.getElementById("Counter").textContent = turn;        
                
            } // End of moving to chosen space/'Choice'
        else if(document.getElementById("Message").textContent != "One more jump!")// Default case
            {
                DeselectAll();
            }                
    
    // See if autoplay is on for Black or Red
    var list = document.getElementsByTagName('button');
    if(list[3].classList.contains("Auto") && turn % 2 == 1)
   {
       console.log("Black autoplay is active...");
       setTimeout(makeValidMove, 500);
   }
    if(list[2].classList.contains("Auto") && turn % 2 == 0)
   {
       console.log("Red autoplay is active...");
       setTimeout(makeValidMove, 500);
   }
   
    checkVictory(turn); // Has a player won the game yet?
    
} // End of Function Reaction()

/* Gathers list of Webelements 'Square' from HTML, then sorts the list into a 8x8 grid */
function GatherBoard()
{
    var list = document.getElementsByClassName("Square");
    var count = 0;
    var board = [[],[],[],[],[],[],[],[]];
    for(var y = 0; y < 8; y++)
        {
            for(var x = 0; x < 8; x++)
                {
                    board[x][y] = list[count];
                    count++;
                } 
        } // End of double For loop 
    return board;
} // End of function GatherBoard

/* Deselect any selected spaces and stop highlighting potential moves */
function DeselectAll()
{
    var list = document.getElementsByClassName("Square");
    for(var i = 0; i < list.length; i++)
        {
        if(list[i].classList.contains("Choice")||list[i].classList.contains("Selected"))
                {
                    list[i].classList.remove("Choice");
                    list[i].classList.remove("Selected");
                    list[i].style.animationDelay = "0s";
                    if(list[i].classList.contains("RedPiece") || list[i].classList.contains("BlackPiece"))
                        {
                           list[i].style.animationDuration = "0.25s"; 
                        }
                    else
                        {
                            list[i].style.animationDuration = "0s"; 
                        }
                    
                            
                } // End of IF statement 
        } // End of For loop 
    
    console.log(" - ");
} // End of function GatherBoard

/* Reset board to initial state of a game */
function ResetBoard()
{
    // Clear console for convenience
    console.clear();
    
    // Reset turn counter to start of game
    document.getElementById("Counter").textContent = "1";
    document.getElementById("Message").textContent = "Black Checker's turn";
    
    // Ensure no selected tiles interfere with board
    DeselectAll();
    
    var list = document.getElementsByClassName("Square");
    for(var i = 0; i < list.length; i++)
    {
        // Remove all piece elements from current space
        list[i].classList.remove("BlackPiece");
        list[i].classList.remove("RedPiece");
        list[i].classList.remove("King");
        
        if(i < 24 && !list[i].classList.contains("noplay"))
        {
            // If in the first 3 rows, put a black check on valid spaces
            list[i].classList.add("BlackPiece");          
        }    
        if(i > 39 && !list[i].classList.contains("noplay"))
        {
            // If in the last 3 rows, put a red check on valid spaces
            list[i].classList.add("RedPiece");          
        }

    } // End of For loop   
} // End of ResetBoard function

/* Set piece locations to random valid spaces, give each team 12 pieces again */
function RandomizeBoard()
{
    // Reset board to ensure pieces aren't allocated based on current game
    ResetBoard();
    
    // Randomize whose turn it is
    var i = Math.floor(Math.random() * 8); // Used for determining turn
    checkVictory(i);
    document.getElementById("Counter").textContent = i.toString();
    
    // Remove all noplay spaces from the board
    var list = document.getElementsByClassName("Square");
    var newList = [];
    var counter = 20;
    i = 0; // Used for For loop and while loop
    for(i = 0; i < list.length; i++)
    {
        list[i].classList.remove("RedPiece");
        list[i].classList.remove("BlackPiece");
        if(!list[i].classList.contains("noplay"))
            {
                newList.push(list[i]);
            } // End of If statement
    } // End of For loop
    
    while(counter > 0)
    {
        i = Math.floor(Math.random() * newList.length);
        
        var Yval = parseInt((newList[i].id).substring(4,5));
        
        if(!newList[i].classList.contains("RedPiece") && !newList[i].classList.contains("BlackPiece"))
       {
           if(counter % 2 == 0)
           {
               newList[i].classList.add("BlackPiece");
               if(Yval == 7)
                   newList[i].classList.add("King");
           }
           else
           {
               newList[i].classList.add("RedPiece");
               if(Yval == 0)
                   newList[i].classList.add("King");
           }
        // Decrement counter for next space   
        counter--;   
           
       } // End of If statement
    } // End of While loop
} // End of function RandomizeBoard

/* Determines if one side has been completely wiped from the board */
function checkVictory(turn)
{
    console.log("VCheck Turn: " + turn);
    
    var temp = document.getElementById("Message").textContent;
    
    if(temp == "One more jump!")
   {
       document.getElementById("Message").textContent = "One more jump!";
   }
    else if(temp == "Red Checkers Win!" || temp == "Black Checkers Win!" || temp == "The, uh, game's over. Just so you know.")
    {
        document.getElementById("Message").textContent = "The, uh, game's over. Just so you know.";
    }
    else if(document.getElementsByClassName("BlackPiece").length < 1)
    {
        document.getElementById("Message").textContent = "Red Checkers Win!";
    }
    else if(document.getElementsByClassName("RedPiece").length < 1)
    {
        document.getElementById("Message").textContent = "Black Checkers Win!";
    }
    else if(turn % 2 == 1)
    {
     document.getElementById("Message").textContent = "Black Checker's turn";
    }
    else
    {
     document.getElementById("Message").textContent = "Red Checker's turn";
    }
    
    
} // End of Function checkVictory

/* Returns a random tile with either a current player's checker or viable move for the player */
function makeValidMove()
{
    var i = 0;
    
    if(document.getElementsByClassName("BlackPiece").length > 0 && document.getElementsByClassName("RedPiece").length > 0)
    {
    
    var turn = parseInt(document.getElementById("Counter").textContent);
    var color = "RedPiece";
    var opp = "BlackPiece";
    if(turn % 2 == 1)
    {
        color = "BlackPiece";
        opp = "RedPiece";
    }
    
    // If there's no available moves, pick another checker of your color 
    if(document.getElementsByClassName("Choice").length < 1)
    {
        // List is exclusively current player's checkers
        var validMoves = "Square " + color;
        var list = document.getElementsByClassName(validMoves);
        i = Math.floor(Math.random() * list.length);
        Reaction(list[i]);
        
    }
        else // At least 1 'choice' is available
    {
        // Grab selected tile and x/y coordinates
        var selected = document.getElementsByClassName("Selected");
        selected = selected[0];
        var selectX = parseInt((selected.id).substring(1,2));
        var selectY = parseInt((selected.id).substring(4,5));
        
        // Grab possible movements with this piece
        var options = shuffle(document.getElementsByClassName("Choice"));
        var JumpOps = [];
        var optX;
        var optY;
        
        // Go through each possible move CPU can make; it if can jump, it will
         for(var count = 0; count < options.length; count++)
        {
            optX = parseInt((options[count].id).substring(1,2));
            optY = parseInt((options[count].id).substring(4,5));
            console.log("Determing potential risks for tile [" + (optX) + "][" + (optY) + "]");
            
            // If viable move is more than 1 tile away, add it possible jumps
            if(Math.abs(selectX - optX) > 1 && Math.abs(selectY - optY) > 1)
            {
                JumpOps.push(options[count]);
            }
            
            // Determine if moving the checker to this tile will make it vulnerable to being jumped. First, only consider moves that put it away from an edge... 
            if(optX > 0 && optY > 0 && optX < 7 && optY < 7)
            {
                // Now, determine if any of the 4 corners of this space could be used to attack it...
                var danger = false;
                
                // Top Left to bottom right(-X,-Y to +X,+Y)                
                if(document.getElementById("[" + (optX-1) + "][" + (optY-1) + "]").classList.contains(opp) && 
                   !document.getElementById("[" + (optX+1) + "][" + (optY+1) + "]").classList.contains(opp) && 
                   !document.getElementById("[" + (optX+1) + "][" + (optY+1) + "]").classList.contains(color) 
                   &&                    !document.getElementById("[" + (optX+1) + "][" + (optY+1) + "]").classList.contains("Selected"))
                {
                    console.log("Determing potential attack from tile [" + (optX-1) + "][" + (optY-1) + "]");
                    danger = true;
                }
                
                // Top Right to bottom left(+X,-Y to -X,+Y)
                if(document.getElementById("[" + (optX+1) + "][" + (optY-1) + "]").classList.contains(opp) && 
                   !document.getElementById("[" + (optX-1) + "][" + (optY+1) + "]").classList.contains(opp) && 
                   !document.getElementById("[" + (optX-1) + "][" + (optY+1) + "]").classList.contains(color) && 
                   !document.getElementById("[" + (optX-1) + "][" + (optY+1) + "]").classList.contains("Selected"))
                {
                    console.log("Determing potential attack from tile [" + (optX+1) + "][" + (optY-1) + "]"); 
                    danger = true;
                }
                
                // Bottom left to top right (-X,+Y to +X,-Y)
                if(document.getElementById("[" + (optX-1) + "][" + (optY+1) + "]").classList.contains(opp) && 
                   !document.getElementById("[" + (optX+1) + "][" + (optY-1) + "]").classList.contains(opp) && 
                   !document.getElementById("[" + (optX+1) + "][" + (optY-1) + "]").classList.contains(color) && 
                   !document.getElementById("[" + (optX+1) + "][" + (optY-1) + "]").classList.contains("Selected"))
                {
                    console.log("Determing potential attack from tile [" + (optX-1) + "][" + (optY+1) + "]");
                    danger = true;
                }
                
                // Bottom right to top left (+X,+Y to -X,-Y)
                if(document.getElementById("[" + (optX+1) + "][" + (optY+1) + "]").classList.contains(opp) && 
                   !document.getElementById("[" + (optX-1) + "][" + (optY-1) + "]").classList.contains(opp) &&
                   !document.getElementById("[" + (optX-1) + "][" + (optY-1) + "]").classList.contains(color) && 
                   !document.getElementById("[" + (optX-1) + "][" + (optY-1) + "]").classList.contains("Selected"))
                {
                    console.log("Determing potential attack from tile [" + (optX+1) + "][" + (optY+1) + "]");
                    danger = true;
                }
                
                // If there is more than 1 possible move, remove this tile from possible moves
                if(danger && options.length > 1)
                {
                    JumpOps.pop();
                    options[count].classList.remove("Choice");
                    options = shuffle(document.getElementsByClassName("Choice"));
                }
                
                 
            } // End of removing dangerous choices 
            
        } // End of jump gathering process / eliminating dangerous moves
        
        // If 1 or more jump opportunities was found, make jump
        if(JumpOps.length > 0)
        {
                i = Math.floor(Math.random() * JumpOps.length);
                console.log("Autoplaying with tile " + JumpOps[i].id);
                Reaction(JumpOps[i]);
        }
        
        else // No jumps were available for selected piece, select random choice and make it 
        {
                i = Math.floor(Math.random() * options.length);
                console.log("Autoplaying with tile " + options[i].id);
                Reaction(options[i]);
        }
        
    } // End of Choices detected
        
    } // End of massive IF statement
    else
    {
        document.getElementById("Message").textContent = "The, uh, game's over. Just so you know.";
    }
    
    
} // End of function makeValidMove

/* Apply 'Choice' to all valid moves spaces */
function ValidMoves(item, board, turn)
{
    var x = parseInt((item.id).substring(1,2));
    var y = parseInt((item.id).substring(4,5));
    
    // What is the selected checker's color?
    var color;
    var notColor;
    if(item.classList.contains("BlackPiece"))
        {
            color = "BlackPiece";
            notColor = "RedPiece";
        }
    if(item.classList.contains("RedPiece"))
        {
            color = "RedPiece";
            notColor = "BlackPiece";
        }
    
    if(turn % 2 == 1 || item.classList.contains("King")) // It is black check's turn / a king's turn
    {
        if(x > 0 && y < 7) // Check down and left
        {
            if(board[x-1][y+1].classList.contains(color))
            {
                // Space is occupied by another checker of same color
                console.log("Bottom-left tile occupied by " + color);
            }
            else if(board[x-1][y+1].classList.contains(notColor) && x > 1 && y < 6)
            { 
                // Can a piece be jumped to the bottom left?
                console.log("Bottom-left tile occupied by " + notColor);
                
                if(!board[x-2][y+2].classList.contains(color) && !board[x-2][y+2].classList.contains(notColor))
                {
                // Is two left/down open for jumping?
                console.log("Bottom-left tile can be jumped!");
                newChoice(board[x-2][y+2]);
                }
            }
            else if(!board[x-1][y+1].classList.contains("RedPiece") && !board[x-1][y+1].classList.contains("BlackPiece"))
            {
                // Bottom left isn't occupied at all; it can be safely moved to!
                console.log("Bottom-left tile is empty; it is a valid move.");
                newChoice(board[x-1][y+1]);
            }
            
        } // End of bottom-left valid moves
        
        if(x < 7 && y < 7) // Check down and right
        {
            if(board[x+1][y+1].classList.contains(color))
            {
                // Space is occupied by another checker of same color
                console.log("Bottom-right tile occupied by " + color);
            }
            else if(board[x+1][y+1].classList.contains(notColor) && x < 6 && y < 6)
            { 
                // Can a piece be jumped to the bottom right?
                console.log("Bottom-right tile occupied by " + notColor);
                
                if(!board[x+2][y+2].classList.contains(color) && !board[x+2][y+2].classList.contains(notColor))
                {
                // Is two right/down open for jumping?
                console.log("Bottom-right tile can be jumped!");
                newChoice(board[x+2][y+2]);
                }
            }
            else if(!board[x+1][y+1].classList.contains("RedPiece") && !board[x+1][y+1].classList.contains("BlackPiece"))
            {
                // Bottom right isn't occupied at all; it can be safely moved to!
                console.log("Bottom-right tile is empty; it is a valid move.");
                newChoice(board[x+1][y+1]);
            }
            
        } // End of bottom-right valid moves
           
    } // End of black check/downward movement  
    
    if(turn % 2 == 0 || item.classList.contains("King")) // It is red check's turn/black king's turn
    {
        if(x > 0 && y > 0) // Check up and left
        {
            if(board[x-1][y-1].classList.contains(color))
            {
                // Space is occupied by another checker of same color
                console.log("Upper-left tile occupied by " + color);
            }
            else if(board[x-1][y-1].classList.contains(notColor) && x > 1 && y > 1)
            { 
                // Can a piece be jumped to the top left?
                console.log("Upper-left tile occupied by " + notColor);
                
                if(!board[x-2][y-2].classList.contains("RedPiece") && !board[x-2][y-2].classList.contains("BlackPiece"))
                {
                // Is two left/up open for jumping?
                console.log("Upper-left tile can be jumped!");
                newChoice(board[x-2][y-2]);
                }
            }
            else if(!board[x-1][y-1].classList.contains(notColor))
            {
                // Bottom left isn't occupied at all; it can be safely moved to!
                console.log("Upper-left tile is empty; it is a valid move.");
                newChoice(board[x-1][y-1]);
                
            }        
        } // End of upper-left valid moves
        
        if(x < 7 && y > 0) // Check up and right
        {
            if(board[x+1][y-1].classList.contains(color))
            {
                // Space is occupied by another red checker
                console.log("Upper-right tile occupied by " + color);
            }
            else if(board[x+1][y-1].classList.contains(notColor) && x < 6 && y > 1)
            { 
                // Can a piece be jumped to the upper right?
                console.log("Upper-right tile occupied by " + notColor);
                
                if(!board[x+2][y-2].classList.contains("BlackPiece") && !board[x+2][y-2].classList.contains("RedPiece"))
                {
                // Is two right/down open for jumping?
                console.log("Upper-right tile can be jumped!");
                newChoice(board[x+2][y-2]);
                }
            }
            else if(!board[x+1][y-1].classList.contains(notColor))
            {
                // Upper right isn't occupied at all; it can be safely moved to!
                console.log("Upper-right tile is empty; it is a valid move.");
                newChoice(board[x+1][y-1]);
            }
            
        } // End of upper-right valid moves
    } // End of red check/upward movement 
} // End of function ValidMoves

/* This function sets a square as a viable choice for movement */
function newChoice(item)
{
    item.classList.add("Choice");
    item.style.animationDuration = "3s";
    item.style.animationDelay = "0s";
}

/* Takes the checker data from the selected spot and deposits it in the 'choice' square - wipes out any checker data in original spot or between original spot and choice */
function moveChecker(board, selected, choice)
{
    var jump = false; // Set to true if there was a successful jump
    
    console.log(selected.id + " selected, " + choice.id + " chosen");
    var X1 = parseInt((selected.id).substring(1,2));
    var Y1 = parseInt((selected.id).substring(4,5));
    var X2 = parseInt((choice.id).substring(1,2));
    var Y2 = parseInt((choice.id).substring(4,5));
    
    // If either X or Y val is 2 apart from each other it's a jump
    if(Math.abs(X1 - X2) > 1)
   {
      jump = true;  
       
      if(Y2 < Y1) // Jumping upwards
      {
        if(X2 < X1) // Jumping up-left
        {
            board[X1 - 1][Y1 - 1].classList.remove("RedPiece");
            board[X1 - 1][Y1 - 1].classList.remove("BlackPiece");
        }
          else // Jumping up-right
        {
            board[X1 + 1][Y1 - 1].classList.remove("RedPiece");
            board[X1 + 1][Y1 - 1].classList.remove("BlackPiece");
        }     
      }
       else // Jumping downwards
      {
          if(X2 < X1) // Jumping down-left
        {
            board[X1 - 1][Y1 + 1].classList.remove("RedPiece");
            board[X1 - 1][Y1 + 1].classList.remove("BlackPiece");
        }
          else // Jumping down-right
        {
            board[X1 + 1][Y1 + 1].classList.remove("RedPiece");
            board[X1 + 1][Y1 + 1].classList.remove("BlackPiece");
        }     
      } // End of downwards jumping logic 
       
    // Add combo-jumping logic here if possible
       ComboJump(selected, X2, Y2);
       
   } // End of jumping logic
    
    // Move all key classes from starting space to target space   
       if(selected.classList.contains("RedPiece"))
       {
           selected.classList.remove("RedPiece");
           choice.classList.add("RedPiece"); 
           choice.classList.add("play");
       }
       if(selected.classList.contains("BlackPiece"))
       {
           selected.classList.remove("BlackPiece");
           choice.classList.add("BlackPiece");
           choice.classList.add("play");
       }
       if(selected.classList.contains("King"))
       {
           selected.classList.remove("King");
           choice.classList.add("King");
       }   
    // Kingmaking logic
    if(choice.classList.contains("BlackPiece") && Y2 == 7 || choice.classList.contains("RedPiece") && Y2 == 0)
    {
        choice.classList.add("King");
    }
    
    return jump; // Triggers second turn if successful jump
      
} // End of function moveChecker()

/* Allows player to make consecutive jump after successfully jumping an opponent's piece */
function ComboJump(selected)
{
    console.log("Combojump! " + selected.id);
    var x = parseInt((selected.id).substring(1,2));
    var y = parseInt((selected.id).substring(4,5));
    // Gather board up to see if there's nearby open spaces
    var board = GatherBoard();
    var color = "BlackPiece";
    var Anticolor = "RedPiece";
    var Move = false; // Determines if another jump is possible
    
    // Determine which color checker the selected checker is
    if(selected.classList.contains("RedPiece"))
    {
        color = "RedPiece";
        Anticolor = "BlackPiece";
    }
    
    DeselectAll(); // Wipe all selected items from last turn
    selected.classList.add("Selected");
    
    if(x < 6) // In at least 3rd from far right
    {        
        if(y > 1) // In at least 3rd row from top 
        {
            // If 2 down, 2 right is jumpable
            if(board[x+1][y-1].classList.contains(Anticolor) && !board[x+2][y-2].classList.contains(Anticolor) && !board[x+2][y-2].classList.contains(color))
            {
                board[x+2][y-2].classList.add("Choice");
                Move = true;
                board[x+2][y-2].style.animationDuration = "3s";
            }
        } // End of y > 1  
        if(y < 6) // In at least 3rd row from bottom 
        {
            // If 2 down, 2 right is jumpable
            if(board[x+1][y+1].classList.contains(Anticolor) && !board[x+2][y+2].classList.contains(Anticolor) && !board[x+2][y+2].classList.contains(color))
            {
                board[x+2][y+2].classList.add("Choice");
                Move = true;
                board[x+2][y+2].style.animationDuration = "3s";
            }
        } // End of y < 6     
    } // End of x < 6 IF statement   
    if(x > 1) // In at least 3rd from far left
    {
        if(y > 1) // In at least 3rd row from top 
        {
            // If 2 down, 2 right is jumpable
            if(board[x-1][y-1].classList.contains(Anticolor) && !board[x-2][y-2].classList.contains(Anticolor) && !board[x-2][y-2].classList.contains(color))
            {
                board[x-2][y-2].classList.add("Choice");
                Move = true;
                board[x-2][y-2].style.animationDuration = "3s";
            }
        } // End of y > 1  
        if(y < 6) // In at least 3rd row from bottom 
        {
            // If 2 down, 2 right is jumpable
            if(board[x-1][y+1].classList.contains(Anticolor) && !board[x-2][y+2].classList.contains(Anticolor) && !board[x-2][y+2].classList.contains(color))
            {
                board[x-2][y+2].classList.add("Choice");
                Move = true;
                board[x-2][y+2].style.animationDuration = "3s";
            }
        } // End of y < 6     
    } // End of x > 1 IF statement
    
    if(Move) // There's a valid jump we can make!
    {
        selected.classList.add("Selected");
        console.log("There's a valid combojump...");     
    }
    else
    {
        DeselectAll(); // Deselect all tiles to prevent another jump   
    }
 //checkVictory(parseInt(document.getElementById("Counter").textContent));
    return Move;
    
} // End of Function ComboJump

/* Shuffle order of contents in array */
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}