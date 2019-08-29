/*eslint-env browser*/
/* eslint-disable no-console */ //Enables console output

function Reaction(item) 
{
    console.log(item.id + " clicked");
    var board = GatherBoard();
    // Determine who's turn it is, stored in 'Counter' id
    var turn = parseInt(document.getElementById("Counter").textContent);
    var auto = parseInt(document.getElementById("AutoplayMode").textContent) > 0;
    
    //console.log(turn);
    
    //  Test to see if it's Black Check's turn
    if(turn % 2 == 1 && item.classList.contains("BlackPiece"))
    {
        DeselectAll();
        item.classList.add("Selected");
        ValidMoves(item, board, turn);
        
        if(auto)
        {
            return document.getElementsByClassName("Choice");
        }
        
    }
    else if(turn % 2 == 0 && item.classList.contains("RedPiece"))
    {
        DeselectAll();
        item.classList.add("Selected");
        ValidMoves(item, board, turn);
        
        if(auto)
        {
            return document.getElementsByClassName("Choice");
        }
        
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
       setTimeout(smartMove, 500);
   }
    if(list[2].classList.contains("Auto") && turn % 2 == 0)
   {
       console.log("Red autoplay is active...");
       setTimeout(smartMove, 500);
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


function smartMove()
{
    var turn = parseInt(document.getElementById("Counter").textContent);
    var list = document.getElementsByTagName('button');
    
    if(list[3].classList.contains("Auto") && turn % 2 == 1 || list[2].classList.contains("Auto") && turn % 2 == 0)
    {
        console.log("smartMove function start");
    }
    else
    {
        console.log(list[2].classList.contains("Auto") + list[3].classList.contains("Auto") + turn);
        return false;
    }
    
    
    
    
    // Determine who's turn it is
    var color = "RedPiece";
    var opp = "BlackPiece";
    if(turn % 2 == 1)
    {
        color = "BlackPiece";
        opp = "RedPiece";
    }
      
    // Gather up all of a player's pieces
    var validMoves = "Square " + color;
    list = document.getElementsByClassName(validMoves);
    var moves = [];
    var temp = 0;
    var i = 0;
    
    // Go through pieces; add any pieces that can be moved to move[] array
    for(i = 0; i < list.length; i++)
    {
        document.getElementById("AutoplayMode").textContent = 1;
        if(Reaction(list[i]).length >= 1)
        {
            moves.push(list[i]);
            console.log(moves[temp]);
            temp++;                 
        }
        document.getElementById("AutoplayMode").textContent = 0;
        DeselectAll(); // Wipe all selected items from data gathering
        
        // Set Reaction to act as normal again 
     
    } // End of checker gathering loop
    
    // moves[] is an array of each piece we can currently move. 
    console.log("\n These pieces can be moved: ");
    for(i = 0; i < moves.length; i++)
    {
        console.log(moves[i].id);
    }
    
    // Determine if any of the checks can jump another piece via offensive move
    var vitalMove = [];
   
    // Determine if any moves can jump another piece; if so, prioritize making jumps over all other logic
    if(prioritize(moves, color, opp))
        return false;
       
    if(vitalMove.length > 0)
    {
       console.log("\n These pieces can jump another piece: ");
        for(i = 0; i < vitalMove.length; i++)
        {
            console.log(vitalMove[i].id);
        }
        
        autoMove(vitalMove, turn);
        
    } // VitalMove was empty to reach this point
    
    
    
    
    
    // Generic movement is all that's left 
    
    DeselectAll(); // Ensure nothing is selected atm
    
    autoMove(moves, turn);
    
    
    
    
    
    /* Generate a list of values 0-11 to determine order pieces will be called in
    for(i = 0; i < list.length; i++)
    {
        temp = Math.floor(Math.random() * list.length);
        
        while(moves.includes(temp))
       {
          temp = Math.floor(Math.random() * list.length);   
       }
          
        moves.push(temp);
        
    } */ //end of For loop, list is randomized 0 to len-1 for list
    
    
    
   
    
    
     
     
     
    
    
    return false;
}

/* Take a checker and determine if it is danger of being jumped by an opponent. If it is, returns true */
function inHarmsWay(check, color, opp)
{
    
    var Xval = parseInt((check.id).substring(1,2));
    var Yval = parseInt((check.id).substring(4,5));
    
    // If a checker is on the edge of a playing field, it cannot be jumped; return false 
    if(Xval > 6 || Xval < 1 || Yval > 6 || Yval < 1)
    {
        console.log(Xval + "_" + Yval + " is at an edge, returning False");
       return false;
    }
    
    // Attack from Upper-left (-X,-Y) to bottom right
    if(document.getElementById("[" + (Xval-1) + "][" + (Yval-1) + "]").classList.contains(opp) && !document.getElementById("[" + (Xval+1) + "][" + (Yval+1) + "]").classList.contains(opp) && !document.getElementById("[" + (Xval+1) + "][" + (Yval+1) + "]").classList.contains(color))
    {
       return true;
    }
    
    // Attack from Upper-right (+X,-Y) to bottom left
    if(document.getElementById("[" + (Xval+1) + "][" + (Yval-1) + "]").classList.contains(opp) && !document.getElementById("[" + (Xval-1) + "][" + (Yval+1) + "]").classList.contains(opp) && !document.getElementById("[" + (Xval-1) + "][" + (Yval+1) + "]").classList.contains(color))
    {
       return true;
    }
    
    // Attack from lower-left (-X,+Y) to upper right
    if(document.getElementById("[" + (Xval-1) + "][" + (Yval+1) + "]").classList.contains(opp) && !document.getElementById("[" + (Xval+1) + "][" + (Yval-1) + "]").classList.contains(opp) && !document.getElementById("[" + (Xval+1) + "][" + (Yval-1) + "]").classList.contains(color))
    {
       return true;
    }
    
    // Attack from lower-right (+X,+Y) to upper left
    if(document.getElementById("[" + (Xval+1) + "][" + (Yval+1) + "]").classList.contains(opp) && !document.getElementById("[" + (Xval-1) + "][" + (Yval-1) + "]").classList.contains(opp) && !document.getElementById("[" + (Xval-1) + "][" + (Yval-1) + "]").classList.contains(color))
    {
       return true;
    }
      
    return false;
    
} // End of inHarmsWay function

/* Determine what pieces can jump others, and what priority a checker's movements should have; checkers with fewer options should take priority over others */
function prioritize(checks, color, opp)
{
    // Randomize the order of 'checks'
    var options = checks; 
    var temp = [];
    var i = 0, j = 0, value = 0;
    for(i = 0; i < checks.length * 2; i++)
    {
        j = Math.floor(Math.random() * checks.length);
        value = Math.floor(Math.random() * checks.length);
        temp = checks[j];
        checks[j] = options[value];
        options[value] = temp;
    }
    
    // Grab X value of 1st checker that can be moved, compare it with X value of available movements
    var Xcheck = parseInt((checks[0].id).substring(1,2));
    var Xmove = 0, Ymove = 0;
    options = []; 
    temp = [];
    var sublist = []; // Used to track individual moves
    var highest = [-10, 0, 0]; // Store the highest priority move to be made and make it after all other moves have been considered   
    value = 0;
    
  
    
    // Determine if any of these moves can make jumps; if they can, raise that check's value by 2; higher values mean greater odds of being chosen as a move
    document.getElementById("AutoplayMode").textContent = 1;
    for(i = 0; i < checks.length; i++)
    {       
        // temp is the collection of moves this specific checker can make this turn
        sublist = [];
        temp = Reaction(checks[i]);
        value = temp.length;
        Xcheck = parseInt((checks[i].id).substring(1,2));
        
        // If this piece can be jumped by oppenent at their next turn, raise this piece's priority
        if(inHarmsWay(checks[i], color, opp))
        {
            value += 2;
            if(checks[i].classList.contains("King"))
               {
                    value += 2;
               }
        }
        
        // Compare X values between this check and every possible move; if it's greater than 1, it's a jump, increase value by 2 of this potential move
        for(j = 0; j < temp.length; j++)
            {
                Xmove = parseInt((temp[j].id).substring(1,2));
                Ymove = parseInt((temp[j].id).substring(4,5));
                               
                if(Math.abs(Xcheck - Xmove) > 1)
                   {
                       value += 2;
                   }
                
                // If this move puts the check on any edge of the board, increase its value by 2 again
                if(Xmove == 0 || Ymove == 0 || Xmove == 7 || Ymove == 7)
                    {
                        value += 2;
                    }
                
                // Determine if this move would put the Check in danger; if it would, reduce value by 3
                if(inHarmsWay(temp[j], color, opp))
                    {
                        console.log(temp[j].id + " is a dangerous move, reducing its priority");
                        value -= 3;
                    }
                
                sublist.push(value);
                if(value > highest[0])
                    {
                        highest[1] = i;
                        highest[2] = sublist.length - 1;
                    }
                  
            } // End of move loop / available moves for this checker
        
        options.push(sublist);
        DeselectAll();
               
    } // End of check loop / movable checks
    
    console.log(checks);
    console.log(options);
   
    document.getElementById("AutoplayMode").textContent = 1;
    temp = Reaction(checks[highest[1]]);
    
setTimeout(function () {  
    document.getElementById("AutoplayMode").textContent = 0;
    Reaction(temp[highest[2]]);
}, 500);
    
    
    // No moves were made, return false
    DeselectAll();
    return false;
    
} // End of function prioritize

/* Takes an array of checkers, randomly selects a checker, than has it make a move without any other logic */
function autoMove(checks, turn)
{
    
    // See if autoplay is on for Black or Red
    var list = document.getElementsByTagName('button');
    if(list[3].classList.contains("Auto") && turn % 2 == 1 && document.getElementsByClassName("BlackPiece").length > 0 || list[2].classList.contains("Auto") && turn % 2 == 0 && document.getElementsByClassName("RedPiece").length > 0)
   {
       // Default response for making a move
    // Click on one of the movable checkers...
       console.log(list[2].classList.contains("Auto") + " " + list[3].classList.contains("Auto") + " " + turn);
    document.getElementById("AutoplayMode").textContent = 1;
    var i = Math.floor(Math.random() * checks.length);
    Reaction(document.getElementById(checks[i].id));
       
 

setTimeout(function () {
               document.getElementById("AutoplayMode").textContent = 0;
    checks = document.getElementsByClassName("Choice");
       if(checks.length > 0)
          {
            i = Math.floor(Math.random() * checks.length);
    Reaction(document.getElementById(checks[i].id));
          }   
             }, 500);
       
    // Randomly select a place to move the checker to based on 'Choice's available
    
       
   } // End of autoplay double-check
    
} // End of function autoMove()

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