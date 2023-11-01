const formatProductImageName = (imageName) => {
    const noCapsOrSpaces = imageName.toLowerCase().replace(' ', '-').replace('/', '&').replace('(', '').replace(')', '');
    return noCapsOrSpaces
}

const extractTextFromUrl = (url) => {
    const match = url.match(/\/([^/]+)\.[^/]+$/);
    if (match && match[1]) {
      return match[1];
    } else {
      return null; // URL doesn't match the expected format
    }
  }

  const percentageToDecimal = (percentageString) => {
    // Remove the '%' sign using the JavaScript replace method
    const numericValue = parseFloat(percentageString.replace('%', ''));
    
    // Check if the input is a valid percentage string
    if (!isNaN(numericValue)) {
      // Convert the percentage to a decimal by dividing by 100
      const decimalValue = numericValue / 100;
      return decimalValue;
    } else {
      // Handle invalid input gracefully
      return 0.0;
    }
  }

module.exports = {formatProductImageName, extractTextFromUrl, percentageToDecimal}