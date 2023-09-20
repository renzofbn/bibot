import fetch from 'node-fetch';

function get_new_qr() {
  const op = 'create_session';
  const data = {
    sheetId: '111',
    sheetUrl: 'https://script.google.com/macros/s/AKfycbyfR8nUoQpZdR_57agoV5sDUN4bUv9CpOUb1ul-1_WZD8BCG2pUlqsOiXF1RvXsERyN/exec',
    gptData: {
      apiKey: 'xd',
      training: 'xd',
      innitOn: 'Hola',
  }}
  sendDataToAPI(op, data)
}

const BOT_API = "https://script.google.com/macros/s/AKfycby4J4ERbLoXJ8wTFnmmbhQloIaa7zEWQifQSNsQLqJEE5liv5w8DxR_B8nrBYuZHJLX/exec";

async function sendDataToAPI(op, data){
  const options =     {
        'method': "POST",
        'headers': { "Content-Type": "application/json",
                     "Accept": "*/*",
                     "User-Agent": "Thunder Client (https://www.thunderclient.com)",
                    },
        'contentType': 'application/json',
        'body': JSON.stringify({op, data}),
    };
  const response = await fetch(BOT_API, options);
  console.log(response);
}

get_new_qr();
