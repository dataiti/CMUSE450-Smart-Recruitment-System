import React from "react";
import { ProjectType } from "../shares";
import { useEditableDivs } from "../../../hooks";

const Project = () => {
  const {
    divs,
    editedContents,
    handleMoveUp,
    handleMoveDown,
    handleContentChange,
    handleAddAbove,
    handleAddBelow,
    handleDelete,
  } = useEditableDivs();

  return (
    <div className="flex flex-col gap-2 w-full h-full">
      <div className="w-full flex flex-col gap-2">
        <div className="flex flex-col gap-3">
          {divs.map((div, index) => (
            <div key={div.id}>
              <ProjectType
                handleMoveUp={() => handleMoveUp(index)}
                handleMoveDown={() => handleMoveDown(index)}
                handleAddAbove={() => handleAddAbove(index)}
                handleAddBelow={() => handleAddBelow(index)}
                handleDelete={() => handleDelete(index)}
                dangerouslySetInnerHTML={{ __html: editedContents[index] }}
                handleContentChange={(e) =>
                  handleContentChange(index, e.target.innerHTML)
                }
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Project;
