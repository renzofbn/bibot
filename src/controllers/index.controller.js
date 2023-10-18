export const getRoot =  (req, res) => {
  res.sendFile('./src/public/index.html', { root: '.' });
}