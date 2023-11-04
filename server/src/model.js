const tf = require("@tensorflow/tfjs");

// Tạo mô hình
const model = tf.sequential();
model.add(tf.layers.dense({ units: 10, activation: "relu" }));
model.add(tf.layers.dense({ units: 10, activation: "relu" }));
model.add(tf.layers.dense({ units: 1, activation: "sigmoid" }));

// Huấn luyện mô hình
model.compile({
  loss: "binaryCrossentropy",
  optimizer: "adam",
  metrics: ["accuracy"],
});
model.fit(x_train, y_train, {
  epochs: 10,
});

// Lưu mô hình
model.save("model.h5");
