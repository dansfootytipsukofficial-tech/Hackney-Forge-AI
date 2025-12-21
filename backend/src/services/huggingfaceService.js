const { HfInference } = require('@huggingface/inference');

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

// Generate text using Hugging Face models
const generateText = async (prompt, model = 'gpt2') => {
  try {
    const result = await hf.textGeneration({
      model: model,
      inputs: prompt,
      parameters: {
        max_new_tokens: 500,
        temperature: 0.8,
        top_p: 0.95,
        return_full_text: false
      }
    });

    return result.generated_text;
  } catch (error) {
    console.error('Hugging Face Text Generation Error:', error);
    throw new Error('Failed to generate text with Hugging Face: ' + error.message);
  }
};

// Generate image using Hugging Face models
const generateImage = async (prompt) => {
  try {
    const result = await hf.textToImage({
      model: 'stabilityai/stable-diffusion-2',
      inputs: prompt,
    });

    return result;
  } catch (error) {
    console.error('Hugging Face Image Generation Error:', error);
    throw new Error('Failed to generate image: ' + error.message);
  }
};

// Use Hugging Face for custom model fine-tuning data preparation
const prepareTrainingData = async (rawData) => {
  // This would prepare data for model fine-tuning
  // In production, this would involve more complex data processing
  try {
    // Basic validation and formatting
    const formattedData = rawData
      .split('\n')
      .filter(line => line.trim().length > 0)
      .map(line => ({
        text: line.trim(),
        timestamp: new Date()
      }));

    return formattedData;
  } catch (error) {
    console.error('Training data preparation error:', error);
    throw new Error('Failed to prepare training data: ' + error.message);
  }
};

module.exports = {
  generateText,
  generateImage,
  prepareTrainingData
};
