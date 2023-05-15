function captureScreenshot(source, outputPath) {
  return source.thumbnail.toPNG()
};
module.exports = {
  captureScreenshot,
}