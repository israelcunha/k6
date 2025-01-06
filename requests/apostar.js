import http from 'k6/http';
import { check, sleep } from 'k6';

let requestIndex = 0;
// Função para gerar strings aleatórias de 44 caracteres
function generateUniqueId(length) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export const options = {
  // LoadTest
  stages: [
    { duration: '10s', target: 10 }, // Aumenta para 5 usuários em 10s
    { duration: '15s', target: 20 }, // Sustenta 10 usuários por 20s
    { duration: '20s', target: 30 }, // Reduz para 0 usuários em 10s
    { duration: '15s', target: 20}, // Aumenta para 6 usuários em 1m
      // { duration: '10s', target: 25}, // Mantem os 6 usuários em 1m
      // { duration: '20s', target: 10}, // Aumenta para 10 usuários em 1m
      // { duration: '10', target: 0}, // Mantem os 10 usuários em 1m
      // { duration: '1m', target: 6}, // Diminui para 6 usuários em 1m
      // { duration: '1m', target: 6}, // Mantem os 6 usuários em 1m
      // { duration: '1m', target: 0 }, // Diminui para 0 usuários em 1m
  ],

  // StressTest
  // stages: [
  //   { duration: "2m", target: 10 }, // below normal load
  //   { duration: "5m", target: 10 },
  //   { duration: "2m", target: 20 }, // normal load
  //   { duration: "5m", target: 20 },
  //   { duration: "2m", target: 30 }, // around the breaking point
  //   { duration: "5m", target: 30 },
  //   { duration: "2m", target: 40 }, // beyond the breaking point
  //   { duration: "5m", target: 40 },
  //   { duration: "10m", target: 0 }, // scale down. Recovery stage.
  // ],
};

export default function () {
  const currentRequestIndex = ++requestIndex;
  
  const url = 'https://backdev.fds.bet/api/casino/fds';

  // Gera um valor único para provider_session_id
  const providerSessionId = generateUniqueId(44);

  const payload = JSON.stringify({
    token: 'backdev-6617a60b61e594.039013',
    event_name: 'bet',
    amount: 0.1,
    user_id: 185268,
    game_id: 3,
    game_provider_id: 5,
    provider_session_id: providerSessionId,
    provider_round_id: '37203563241',
    provider_transaction_id: '372035641',
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
      'application-encrypt': 'fdstst',
     // 'User-Agent': 'k6',
    },
  };

  const response = http.post(url, payload, params);

  if (response.status !== 200) {
    console.log(`Requisição #${currentRequestIndex}`);
    console.log(`URL: ${url}`);
    console.log(`Status: ${response.status}`);
    console.log(`Resposta: ${response.body}`);
    console.log(`###############################################################`);
  } 
    check(response, {
      'status was successful': (r) => r.status === 200,
      'response time < 500ms': (r) => r.timings.duration < 500,
    });
    
  
  sleep(1); // Aguarda 1 segundo antes de repetir a execução
}