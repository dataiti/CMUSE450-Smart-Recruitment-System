// const fs = require("fs");
// const natural = require("natural");

// function trainModel(datasetFilePath, modelFilePath) {
//   const classifier = new natural.BayesClassifier();

//   const data = JSON.parse(fs.readFileSync(datasetFilePath, "utf8"));

//   data.forEach((sample) => {
//     const text = sample.Text;
//     const entities = sample.Entities;

//     for (const field in entities) {
//       const category = field.toLowerCase();
//       const value = entities[field];

//       classifier.addDocument(text, `${category}_${value}`);
//     }
//   });

//   classifier.train();
//   classifier.save(modelFilePath);

//   return classifier;
// }

// const datasetFilePath = "path/to/your/dataset.json";
// const modelFilePath = "path/to/your/model.json";

// const classifier = trainModel(datasetFilePath, modelFilePath);
