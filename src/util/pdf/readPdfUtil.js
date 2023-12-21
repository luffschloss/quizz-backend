const fs = require("fs");
const pdf = require("pdf-parse");

const readPdf = async (filePath) => {
  try {
    // Read PDF file
    const dataBuffer = fs.readFileSync(filePath);

    // Parse PDF
    const data = await pdf(dataBuffer);

    // Extract text
    const text = data.text;

    return text;
  } catch (error) {
    console.error("Error reading PDF:", error);
  }
};

const readPdfFromBuffer = async (dataBuffer) => {
  try {
    // Parse PDF
    const data = await pdf(dataBuffer);

    // Extract text
    const text = data.text;
    return text;
  } catch (error) {
    console.error("Error reading PDF:", error);
  }
};

module.exports.pdfUtil = {
  readPdfFromBuffer: readPdfFromBuffer,
  readPdf: readPdf,
};
// Provide the path to the PDF file you want to read
//const pdfFilePath = 'path/to/your/file.pdf';

// Call the readPdf function
//readPdf(pdfFilePath);
