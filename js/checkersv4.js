/*eslint-env browser*/
/* eslint-disable no-console */ //Enables console output
function Reaction(item)
{
    console.log(item.id);
    var board;
    // Determine who's turn it is, stored in 'Counter' id
    var turn = parseInt(document.getElementById("Counter").textContent);
    //console.log(turn);
    
    //  Test to see if it's Black Check's turn
    if(turn % 2 == 1 && item.classList.contains("BlackPiece"))
    {
        board = GatherBoard();
        DeselectAll();
        item.classList.add("Selected");
        ValidMoves(item, board, turn);
    }
    else if(turn % 2 == 0 && item.classList.contains("RedPiece"))
    {
        board = GatherBoard();
        DeselectAll();
        item.classList.add("Selected");
        ValidMoves(item, board, turn);
    }
    
    
}

/* Gathers list of Webelements 'Square' from HTML, then sorts the list into a 8x8 grid */
function GatherBoard()
{
    var list = document.getElementsByClassName("Square");
    var count = 0;
    //console.log(list.length);
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
                    list[i].style.animationDuration = "0s";
                    
                } 
        } // End of For loop 
} // End of function GatherBoard

/* Apply 'Choice' to all valid moves spaces */
function ValidMoves(item, board, turn)
{
    var x = parseInt((item.id).substring(1,2));
    var y = parseInt((item.id).substring(4,5));
    console.log(x + " " + y);
    
    if(turn % 2 == 1) // It is black check's turn
    {
        if(x > 0 && y < 7) // Check down and left
        {
            if(board[x-1][y+1].classList.contains("BlackPiece"))
            {
                // Space is occupied by another black checker
                console.log("Bottom-left tile occupied by black piece");
            }
            else if(board[x-1][y+1].classList.contains("RedPiece") && x > 1 && y < 6)
            { 
                // Can a piece be jumped to the bottom left?
                console.log("Bottom-left tile occupied by red piece");
                
                if(!board[x-2][y+2].classList.contains("BlackPiece") && !board[x-2][y+2].classList.contains("RedPiece"))
                {
                // Is two left/down open for jumping?
                console.log("Bottom-left tile can be jumped!");
                newChoice(board[x-2][y+2]);
                }
            }
            else if(!board[x-1][y+1].classList.contains("RedPiece"))
            {
                // Bottom left isn't occupied at all; it can be safely moved to!
                console.log("Bottom-left tile is empty; it is a valid move.");
                newChoice(board[x-1][y+1]);
            }
            
        } // End of bottom-left valid moves
        
        if(x < 7 && y < 7) // Check down and right
        {
            if(board[x+1][y+1].classList.contains("BlackPiece"))
            {
                // Space is occupied by another black checker
                console.log("Bottom-right tile occupied by black piece");
            }
            else if(board[x+1][y+1].classList.contains("RedPiece") && x < 6 && y < 6)
            { 
                // Can a piece be jumped to the bottom right?
                console.log("Bottom-right tile occupied by red piece");
                
                if(!board[x+2][y+2].classList.contains("BlackPiece") && !board[x+2][y+2].classList.contains("RedPiece"))
                {
                // Is two right/down open for jumping?
                console.log("Bottom-right tile can be jumped!");
                newChoice(board[x+2][y+2]);
                }
            }
            else if(!board[x+1][y+1].classList.contains("RedPiece"))
            {
                // Bottom right isn't occupied at all; it can be safely moved to!
                console.log("Bottom-right tile is empty; it is a valid move.");
                newChoice(board[x+1][y+1]);
            }
            
        } // End of bottom-right valid moves
        
        
    }
    else // It is red check's turn
    {
        if(x > 0 && y > 0) // Check up and left
        {
            if(board[x-1][y-1].classList.contains("RedPiece"))
            {
                // Space is occupied by another red checker
                console.log("Upper-left tile occupied by red piece");
            }
            else if(board[x-1][y-1].classList.contains("BlackPiece") && x > 1 && y > 1)
            { 
                // Can a piece be jumped to the top left?
                console.log("Upper-left tile occupied by black piece");
                
                if(!board[x-2][y-2].classList.contains("RedPiece") && !board[x-2][y-2].classList.contains("BlackPiece"))
                {
                // Is two left/up open for jumping?
                console.log("Upper-left tile can be jumped!");
                newChoice(board[x-2][y-2]);
                }
            }
            else if(!board[x-1][y-1].classList.contains("BlackPiece"))
            {
                // Bottom left isn't occupied at all; it can be safely moved to!
                console.log("Upper-left tile is empty; it is a valid move.");
                newChoice(board[x-1][y-1]);
                
            }
            
        } // End of upper-left valid moves
        
        if(x < 7 && y > 0) // Check up and right
        {
            if(board[x+1][y-1].classList.contains("RedPiece"))
            {
                // Space is occupied by another red checker
                console.log("Upper-right tile occupied by black piece");
            }
            else if(board[x+1][y-1].classList.contains("BlackPiece") && x < 6 && y < 6)
            { 
                // Can a piece be jumped to the upper right?
                console.log("Upper-right tile occupied by black piece");
                
                if(!board[x+2][y-2].classList.contains("BlackPiece") && !board[x+2][y-2].classList.contains("RedPiece"))
                {
                // Is two right/down open for jumping?
                console.log("Upper-right tile can be jumped!");
                newChoice(board[x+2][y-2]);
                }
            }
            else if(!board[x+1][y-1].classList.contains("BlackPiece"))
            {
                // Upper right isn't occupied at all; it can be safely moved to!
                console.log("Upper-right tile is empty; it is a valid move.");
                newChoice(board[x+1][y-1]);
            }
            
        } // End of upper-right valid moves
    }
    
}

/* This function sets a square as a viable choice for movement */
function newChoice(item)
{
    item.classList.add("Choice");
    item.style.animationDuration = "3s";
    item.style.animationDelay = "0s";
}

