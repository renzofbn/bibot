import { ADMIN_PASS } from '../config.js';
import { wtsSessionManager } from '../index.js';


const doClientOperations = (op, sheetId, sheetUrl, gptData) => {
  switch (op) {
    case 'create_session':
      wtsSessionManager.createNewSession(sheetId, sheetUrl, gptData);
      break;
    case 'restart_session':
      wtsSessionManager.restartSession(sheetId);
      break;
    case 'destroy_session':
      wtsSessionManager.destroySession(sheetId);
      break;
    case 'start_session':
      wtsSessionManager.startSession(sheetId);
      break;
    default:
      break;
  }
}



export const createSession = (req, res) => {
  try {
    const { op } = req.body;
    const { sheetUrl, sheetId, gptData } = req.body.data;
    doClientOperations(op, sheetId, sheetUrl, gptData);
    res.send(req.body);

  }catch (err) {
    console.log(err.message);
    return res.status(500).json({
      message: 'Something went wrong...'
    });
  }
}

export const statusSession = (req, res) => {
  try {
    const { pass } = req.body;
    if (pass === ADMIN_PASS) {
      const activeSessions = 0;
      res.send({activeSessions});
    }
  }
  catch (err) {
    console.log(err.message);
    return res.status(500).json({
      message: 'Something went wrong...'
    });
  }
}