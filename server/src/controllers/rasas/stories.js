const fs = require("fs");
const asyncHandler = require("express-async-handler");
const yaml = require("js-yaml");

const filePath = `${process.env.RASA_DATA_PATH}/data/stories.yml`;

function readStoriesData() {
  const storiesData = fs.readFileSync(filePath, "utf-8");
  return yaml.load(storiesData);
}

function saveToFile(data) {
  const yamlData = yaml.dump(data);
  fs.writeFileSync(filePath, yamlData, "utf8");
}

const getAllStoriesData = asyncHandler(async (req, res) => {
  const parsedStoriesData = readStoriesData();
  return res.status(200).json({
    success: true,
    message: "Get data on stories.yml file is successfully",
    data: parsedStoriesData.stories,
  });
});

const getStory = asyncHandler(async (req, res) => {
  const parsedStoriesData = readStoriesData();
  const storyName = req.query.storyName;

  const foundStory = parsedStoriesData.stories.find(
    (story) => story.story === storyName
  );

  if (!foundStory) throw new Error("Story is not found");

  return res.status(200).json({
    success: true,
    message: "Get data on stories.yml file is successfully",
    data: foundStory,
  });
});

const addStory = asyncHandler(async (req, res) => {
  const parsedStoriesData = readStoriesData();
  const newStory = req.body;

  if (!newStory) throw new Error("Story is required");

  if (parsedStoriesData.stories.some((item) => item.story === newStory.story))
    throw new Error("Story is existing");

  parsedStoriesData.stories.push(newStory);

  saveToFile(parsedStoriesData);

  return res.status(201).json({
    success: true,
    message: "Story added successfully",
    data: newStory,
  });
});

const updateStory = asyncHandler(async (req, res) => {
  const parsedStoriesData = readStoriesData();
  const storyName = req.query.storyName;
  const updatedStory = req.body;

  if (
    !parsedStoriesData.stories.some(
      (story) => story.story === updatedStory.story
    )
  )
    throw new Error("Story is not find");

  const existingStoryIndex = parsedStoriesData.stories.findIndex(
    (story) => story.story === storyName
  );

  if (existingStoryIndex !== -1) {
    parsedStoriesData.stories[existingStoryIndex] = updatedStory;

    saveToFile(parsedStoriesData);

    return res.status(200).json({
      success: true,
      message: "Story updated successfully",
      data: updatedStory,
    });
  } else {
    return res.status(404).json({
      success: false,
      message: "Story not found",
      data: null,
    });
  }
});

const deleteStory = asyncHandler(async (req, res) => {
  const parsedStoriesData = readStoriesData();
  const storyName = req.query.storyName;

  const existingStoryIndex = parsedStoriesData.stories.findIndex(
    (story) => story.story === storyName
  );

  if (existingStoryIndex !== -1) {
    const deletedStory = parsedStoriesData.stories.splice(
      existingStoryIndex,
      1
    )[0];

    saveToFile(parsedStoriesData);

    return res.status(200).json({
      success: true,
      message: "Story deleted successfully",
      data: deletedStory,
    });
  } else {
    return res.status(404).json({
      success: false,
      message: "Story not found",
      data: null,
    });
  }
});

module.exports = {
  getAllStoriesData,
  addStory,
  deleteStory,
  updateStory,
  getStory,
};
