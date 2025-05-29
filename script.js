const avatar = lottie.loadAnimation({
  container: document.getElementById('avatar'),
  renderer: 'svg',
  loop: true,
  autoplay: false,
  path: 'animation.json' // Avatar animation file
});

const btn = document.getElementById("speak-btn");
const userTextElem = document.getElementById("user-text");
const aiTextElem = document.getElementById("ai-text");

const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'vi-VN';
recognition.interimResults = false;

btn.onclick = () => {
  recognition.start();
  btn.disabled = true;
  btn.textContent = "🎧 Đang nghe...";
};

recognition.onresult = async (event) => {
  const userInput = event.results[0][0].transcript;
  userTextElem.textContent = "👤 Bạn: " + userInput;

  // Gửi đến ChatGPT API
  const reply = await sendToChatGPT(userInput);
  aiTextElem.textContent = "🤖 AI: " + reply;

  // Phát giọng nói + avatar animation
  speakText(reply);
};

recognition.onend = () => {
  btn.disabled = false;
  btn.textContent = "Bắt đầu nói";
};

// Gọi OpenAI API
async function sendToChatGPT(text) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "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"
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: text }]
    })
  });
  const data = await response.json();
  return data.choices[0].message.content;
}

// Phát âm thanh bằng Text-to-Speech
function speakText(text) {
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = 'vi-VN';

  utter.onstart = () => avatar.play();
  utter.onend = () => avatar.stop();

  window.speechSynthesis.speak(utter);
}
