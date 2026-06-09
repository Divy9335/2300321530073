const http = require('http');
const fs = require('fs');
const path = require('path');
const logger = require('./logger');

const API_URL = 'http://4.224.186.213/evaluation-service/notifications';
const TOP_N = 10;
const OUTPUT_DIR = path.join(__dirname, '..', 'stage1');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'top10-notifications.json');

const TYPE_WEIGHT = {
  placement: 1000,
  result: 700,
  event: 400
};

function normalizeType(type) {
  return String(type || '').toLowerCase().trim();
}

function scoreNotification(notification) {
  const type = normalizeType(notification.type);
  const baseWeight = TYPE_WEIGHT[type] || 100;
  const createdAt = new Date(notification.createdAt || notification.publishedAt || notification.timestamp || Date.now());
  const ageHours = Math.max(0, (Date.now() - createdAt.getTime()) / 36e5);
  const recencyScore = Math.max(0, 300 - ageHours);
  return baseWeight * 1000 + recencyScore;
}

class PriorityInbox {
  constructor(limit) {
    this.limit = limit;
    this.heap = [];
  }

  add(notification) {
    const scored = { ...notification, score: scoreNotification(notification) };
    if (this.heap.length < this.limit) {
      this.heap.push(scored);
      this._siftUp(this.heap.length - 1);
      return;
    }

    if (scored.score <= this.heap[0].score) {
      return;
    }

    this.heap[0] = scored;
    this._siftDown(0);
  }

  _parent(index) {
    return Math.floor((index - 1) / 2);
  }

  _left(index) {
    return index * 2 + 1;
  }

  _right(index) {
    return index * 2 + 2;
  }

  _siftUp(index) {
    while (index > 0) {
      const parentIndex = this._parent(index);
      if (this.heap[parentIndex].score <= this.heap[index].score) {
        break;
      }
      [this.heap[parentIndex], this.heap[index]] = [this.heap[index], this.heap[parentIndex]];
      index = parentIndex;
    }
  }

  _siftDown(index) {
    const length = this.heap.length;
    while (true) {
      const left = this._left(index);
      const right = this._right(index);
      let smallest = index;

      if (left < length && this.heap[left].score < this.heap[smallest].score) {
        smallest = left;
      }
      if (right < length && this.heap[right].score < this.heap[smallest].score) {
        smallest = right;
      }
      if (smallest === index) {
        break;
      }
      [this.heap[index], this.heap[smallest]] = [this.heap[smallest], this.heap[index]];
      index = smallest;
    }
  }

  topList() {
    return [...this.heap].sort((a, b) => b.score - a.score);
  }
}

function ensureOutputDirectory() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
}

function fetchNotifications() {
  return new Promise((resolve, reject) => {
    const url = new URL(API_URL);
    const headers = {};
    const token = process.env.NOTIF_API_TOKEN;
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const requestOptions = {
      hostname: url.hostname,
      port: url.port || 80,
      path: url.pathname + url.search,
      method: 'GET',
      headers
    };

    logger.info('Fetching notification feed', { api: API_URL, hasAuth: Boolean(token) });

    const req = http.request(requestOptions, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        logger.info('Notification API responded', { statusCode: res.statusCode });
        if (res.statusCode !== 200) {
          return reject(new Error(`Notification API returned ${res.statusCode}: ${body}`));
        }
        try {
          const json = JSON.parse(body);
          resolve(json);
        } catch (error) {
          reject(new Error(`Failed to parse notification response: ${error.message}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
}

async function buildTopNotifications() {
  try {
    const notificationFeed = await fetchNotifications();
    if (!Array.isArray(notificationFeed)) {
      throw new Error('Expected notification feed to be an array');
    }

    const inbox = new PriorityInbox(TOP_N);
    notificationFeed.forEach((notification) => inbox.add(notification));

    const topNotifications = inbox.topList();
    ensureOutputDirectory();
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(topNotifications, null, 2), 'utf8');

    logger.info('Computed top notifications', { count: topNotifications.length });
    console.log('Top', TOP_N, 'priority notifications:');
    topNotifications.forEach((notification, index) => {
      console.log(`${index + 1}. [${notification.type}] ${notification.title || notification.message || 'No title'} (score=${notification.score.toFixed(1)})`);
    });

    console.log(`\nSaved output to ${OUTPUT_FILE}`);
  } catch (error) {
    logger.error('Failed to build top notifications', { message: error.message });
    console.error('Error:', error.message);
    process.exitCode = 1;
  }
}

buildTopNotifications();
