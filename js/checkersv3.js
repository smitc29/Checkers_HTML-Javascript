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
                } 
        } // End of For loop 
} // End of function GatherBoard

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
                console.log("Bottom-left tile occupied");
            }
            
        }
        
        
        
        
    }
    else // It is red check's turn
    {
        console.log("Red check's turn");
    }
    
}

