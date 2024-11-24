import * as tf from '@tensorflow/tfjs';

async function loadModel() {
  const model = await tf.loadLayersModel('/public/models/model.json');
  return model;
}
loadModel();