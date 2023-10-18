import fetch from 'node-fetch';
import { Configuration, OpenAIApi } from "openai";

import WhatsApp from 'whatsapp-web.js';
const { Client, LocalAuth } = WhatsApp;

export class WhatsappSessionManager {
  constructor() {
    this.sessionIdVsClientInstance = {};
    return this;
  }

  createNewSession (sessionId, url, gptData) {
    console.log(`🔨 -- Creando la sesión ${sessionId}`);
    this.sessionIdVsClientInstance[sessionId] = new WhatsAppClientSession(sessionId, url, gptData);
  }

  async restartSession(sessionId) {
    if(!(sessionId in this.sessionIdVsClientInstance)) return;
    console.warn(`⚠️ -- Reiniciando la sesión ${sessionId}`);
    const instance = this.sessionIdVsClientInstance[sessionId];
    try {
      await instance.client.destroy();
    } catch (error) {
      console.error(error);
    }
    this.sessionIdVsClientInstance[sessionId] = new WhatsAppClientSession(
      sessionId, instance.sheetUrl, {apiKey: instance.apiKey, training: instance.training});
    }

  async destroySession(sessionId, logout=false) {
    if(!(sessionId in this.sessionIdVsClientInstance)) return;
    console.warn(`💥 --  Destruyendo la sesión ${sessionId}`);
    const instance = this.sessionIdVsClientInstance[sessionId];
    try {
      if(logout){
        await instance.client.logout();
        delete this.sessionIdVsClientInstance[sessionId];
      }
      await instance.client.destroy();
    } catch (error) {
      console.error(error);
    }
    console.log(`✅ -- La sesión ${sessionId} ha sido destruida`);
  }

  async startSession(sessionId) {
    if(!(sessionId in this.sessionIdVsClientInstance)) return;
    console.log(`⚠️  -- Iniciando la sesión ${sessionId}`);
    const instance = this.sessionIdVsClientInstance[sessionId];
    const status = await instance.client.getState();
    if (status === 'CONNECTED') {
      console.log(`📣  -- La sesión ${sessionId} ya ESTÁ INICIADA`);
      return;
    }
    console.log(`🔍  -- Estado de la sesión ${sessionId}: ${status}`);
    await instance.client.initialize();
    console.log(`✅ -- La sesión ${sessionId} ha sido iniciada`);
  }
}

class WhatsAppClientSession {
  constructor(sessionId, url, gptData) {
    this.sessionId = sessionId;
    this.sheetUrl = url;
    this.msg_history = {
      'training': {"role": "system", "content": gptData.training},
    };
    this.gptConfiguration = new Configuration({
      apiKey: gptData.apiKey,
    });
    this.gpt = new OpenAIApi(this.gptConfiguration);

    this.client = new Client({
      restartOnAuthFail: true,
      puppeteer: {
        headless: true,
        args: ['--no-sandbox'],
      },
      authStrategy: new LocalAuth({
        clientId: sessionId 
      })
    });
    this.client.on('qr', (qr) => {
      console.log(`💤 -- Esperando el escaneo del QR de ${this.sessionId} --`);
      // console.log(`https://chart.googleapis.com/chart?chs=500x500&cht=qr&chl=${encodeURIComponent(qr)}`);
      sendDataToSheet(this.sheetUrl, 'set_qr', {qr: qr});
    });
    this.client.on('ready', () => {
      console.log(`✅ -- El cliente n° ${this.sessionId} está listo`);
      sendDataToSheet(this.sheetUrl, 'session_ready', {});
    });
    this.client.on('message', async msg => {
      try {
        if(msg.type !== 'chat' || typeof msg.author !== 'undefined') return;
        this.setMsgHistory(msg.from, {"role": "user", "content": msg.body});
        const msg_history = this.getMsgHistory(msg.from);
        const chatCompletion = await this.gpt.createChatCompletion({
          model: "gpt-3.5-turbo",
          messages: msg_history
        });
        const response = chatCompletion.data.choices[0].message;
        this.setMsgHistory(msg.from, response);
        msg.reply(response.content);
        sendDataToSheet(this.sheetUrl, 'set_new_msg', {
        user_num: msg.from, msg: msg.body, response: response.content, date: msg.timestamp});
      } catch (error) {
        if (error.response) {
          console.error(error.response.status);
          console.error(error.response.data);
        } else {
          console.error(error.message);
        }
      }
    });
    this.client.on('disconnected', (reason) => {
      sendDataToSheet(this.sheetUrl, 'client_msg', {msg: `El cliente ha sido desconectado ${reason}`, date: new Date()});
      client.destroy();
    });
    this.client.initialize();
  }

  setMsgHistory(num, msg=null){
    if(!(num in this.msg_history)){
      this.msg_history[num] = [];
    }
    if(msg){
      this.msg_history[num].push(msg);
    }
    return 0;
  }

  getMsgHistory(num){
    return [this.msg_history.training, ...this.msg_history[num]];
  }

  getClient() {
    return this.client;
  }

  // TODO: hacerlo fuera de la clase
  async destroyClient() {
    await this.client.destroy();
  }

  async restart() {
    await this.destroy();
    this.client = new Client();
    this.client.on('qr', (qr) => {
      this.qr = qr;
    });
    this.client.initialize();
  }

}

  /** 
   * @param {string} sheetUrl
   * @param {string} operación
   * @param {object} data
   *  Operaciones posibles
   * - set_qr: {op, data: {qr}}
   * - set_new_msg: {op, data: {user_num, msg, response, date}}
   * - session_ready: {op}
   * - client_msg: {op, data: {msg, date}}
  */
const sendDataToSheet = async (url, op, data) => {
  const response = await fetch(url, {method: 'POST', body: JSON.stringify({op, data})});
  const txt_response = await response.text();
  console.log(`🔍 -- La operacion ${op} ha retornado: ${txt_response}`);
}
