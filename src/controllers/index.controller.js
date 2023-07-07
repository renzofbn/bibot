
export const ping = async (req, res) => {
  res.json({status: "pong"})
}

export const getRoot =  (req, res) => {
  res.sendFile('./src/public/index.html', { root: '.' });
}