import React, { useState } from "react";
import SkillType from "../shares/SkillType";

const Skills = () => {
  const [divs, setDivs] = useState([{ id: 1, content: "Editable Div 1" }]);

  const [editedContents, setEditedContents] = useState(
    divs.map((div) => div.content)
  );

  const handleMoveUp = (index) => {
    if (index > 0) {
      const newDivs = [...divs];
      [newDivs[index - 1], newDivs[index]] = [
        newDivs[index],
        newDivs[index - 1],
      ];

      const newEditedContents = [...editedContents];
      [newEditedContents[index - 1], newEditedContents[index]] = [
        newEditedContents[index],
        newEditedContents[index - 1],
      ];

      setDivs(newDivs);
      setEditedContents(newEditedContents);
    }
  };

  const handleMoveDown = (index) => {
    if (index < divs.length - 1) {
      const newDivs = [...divs];
      [newDivs[index], newDivs[index + 1]] = [
        newDivs[index + 1],
        newDivs[index],
      ];

      const newEditedContents = [...editedContents];
      [newEditedContents[index], newEditedContents[index + 1]] = [
        newEditedContents[index + 1],
        newEditedContents[index],
      ];

      setDivs(newDivs);
      setEditedContents(newEditedContents);
    }
  };

  const handleContentChange = (index, newContent) => {
    const newEditedContents = [...editedContents];
    newEditedContents[index] = newContent;
    setEditedContents(newEditedContents);
  };

  const handleAddAbove = (index) => {
    const newDivs = [...divs];
    const newEditedContents = [...editedContents];

    newDivs.splice(index, 0, { id: Date.now(), content: "New Editable Div" });
    newEditedContents.splice(index, 0, "New Editable Div");

    setDivs(newDivs);
    setEditedContents(newEditedContents);
  };

  const handleAddBelow = (index) => {
    const newDivs = [...divs];
    const newEditedContents = [...editedContents];

    newDivs.splice(index + 1, 0, {
      id: Date.now(),
      content: "New Editable Div",
    });
    newEditedContents.splice(index + 1, 0, "New Editable Div");

    setDivs(newDivs);
    setEditedContents(newEditedContents);
  };

  const handleDelete = (index) => {
    const newDivs = [...divs];
    const newEditedContents = [...editedContents];

    newDivs.splice(index, 1);
    newEditedContents.splice(index, 1);

    setDivs(newDivs);
    setEditedContents(newEditedContents);
  };
  return (
    <div className="flex flex-col gap-2 w-full h-full">
      <div className="w-full flex flex-col gap-2">
        <div className="flex flex-col gap-3">
          {divs.map((div, index) => (
            <div key={div.id}>
              <SkillType
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

export default Skills;
