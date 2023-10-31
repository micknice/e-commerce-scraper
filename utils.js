const formatProductImageName = (imageName) => {
    const noCapsOrSpaces = imageName.toLowerCase().replace(' ', '-').replace('/', '&').replace('(', '').replace(')', '');
    return noCapsOrSpaces
}

function extractTextFromUrl(url) {
    const match = url.match(/\/([^/]+)\.[^/]+$/);
    if (match && match[1]) {
      return match[1];
    } else {
      return null; // URL doesn't match the expected format
    }
  }

module.exports = {formatProductImageName, extractTextFromUrl}