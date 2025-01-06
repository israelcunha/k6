import http from 'k6/http';
import { check, sleep } from 'k6';

let requestIndex = 0;

export const options = {
  stages: [
    { duration: '10s', target: 5 }, // Aumenta para 5 usuários em 10s
    { duration: '20s', target: 10 }, // Sustenta 10 usuários por 20s
    { duration: '10s', target: 0 }, // Reduz para 0 usuários em 10s
  ],
};

export default function () {
  const currentRequestIndex = ++requestIndex;
  
  const url = 'https://backdev.fds.bet/api/casino/fds';
  const payload = JSON.stringify({
    user_id: 185268,
    event_name: 'balance',
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