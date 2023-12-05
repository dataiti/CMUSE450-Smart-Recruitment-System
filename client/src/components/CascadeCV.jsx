import React, { useRef, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const Square = ({ id, onDelete, label }) => {
  return <div className="h-10 w-10 bg-blue-gray-400"></div>;
};

const SquareList = () => {
  const [squares, setSquares] = useState([...Array(5).keys()]);

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const newSquares = Array.from(squares);
    const [movedSquare] = newSquares.splice(result.source.index, 1);
    newSquares.splice(result.destination.index, 0, movedSquare);

    setSquares(newSquares);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="squareList" direction="horizontal">
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {squares.map((square, index) => (
              <Draggable
                key={index}
                draggableId={`square-${index}`}
                index={index}
              >
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <Square index={index} />
                  </div>
                )}
              </Draggable>
            ))}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default SquareList;
