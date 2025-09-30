const express = require('express');
const path = require('path');
const app = express();

// 允许跨域和解析JSON
app.use(express.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

// 存储定位数据（内存中，适合毕设测试）
let location = { lat: 0, lon: 0, time: new Date().toISOString() };

// 接收nRF9160发送的定位（供板子调用）
app.post('/send-location', (req, res) => {
  if (req.body.lat && req.body.lon) {
    location = {
      lat: req.body.lat,
      lon: req.body.lon,
      time: new Date().toISOString()
    };
    res.send({ status: 'success' });
  } else {
    res.send({ status: 'error', message: '需要lat和lon参数' });
  }
});

// 提供定位数据（供网页调用）
app.get('/get-location', (req, res) => {
  res.send(location);
});

// 托管静态网页
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 启动服务
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`服务运行在端口 ${port}`);
});
