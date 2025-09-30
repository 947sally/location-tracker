const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

let location = { lat: 0, lon: 0, time: new Date().toISOString() };

// 接收nRF9160定位数据
app.post('/send-location', (req, res) => {
  if (req.body.lat && req.body.lon) {
    location = {
      lat: req.body.lat,
      lon: req.body.lon,
      time: new Date().toISOString()
    };
    res.send({ status: 'success' });
  } else {
    res.send({ status: 'error', message: '缺少经纬度' });
  }
});

// 提供定位数据给网页
app.get('/get-location', (req, res) => {
  res.send(location);
});

// 托管静态网页
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`服务运行在端口 ${port}`));
