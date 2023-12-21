const { useState } = require("react");

const useEditableDivs = () => {
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

  return {
    divs,
    editedContents,
    handleMoveUp,
    handleMoveDown,
    handleContentChange,
    handleAddAbove,
    handleAddBelow,
    handleDelete,
  };
};

export default useEditableDivs;
