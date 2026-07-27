import express from 'express';
import cors from 'cors';
import { pool } from './database/db';

const app = express();
// เก็บ OTP ชั่วคราว (ในระบบจริงควรใช้ Redis หรือ Database)
const otpStore = new Map();
app.use(cors({
  origin: [
    'https://lamped.netlify.app',
    'http://localhost:4200',
    'https://coruscating-donut-62bb86.netlify.app',
    'https://tamraidee.netlify.app'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'ngrok-skip-browser-warning'],
  credentials: true
}));
app.use(express.json());

app.use(express.json());
app.get('/', (req, res) => {
  res.send('Todo API Running');
});


app.get('/todos', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM todos ORDER BY id DESC'
    );

    res.json(result.rows);

  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

app.post('/todos', async (req, res) => {
  try {
    const { username, title ,password} = req.body;

    const result = await pool.query(
      `INSERT INTO todos (username, title, password, completed)
       VALUES ($1, $2, $3, false)
       RETURNING *`,
      [username,title, password]
    );

    res.status(201).json(result.rows[0]);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});
// เพิ่ม Route สำหรับ Login
app.post('/api/login', async (req, res) => {
  try {
    const { title, password } = req.body;

    // ค้นหาผู้ใช้จากตาราง todos
    const result = await pool.query(
      'SELECT * FROM todos WHERE title = $1 AND password = $2',
      [title, password]
    );

    if (result.rows.length > 0) {
      // ถ้าเจอผู้ใช้
      res.json({ success: true, message: 'Login successful', user: result.rows[0] });
    } else {
      // ถ้าไม่เจอผู้ใช้
      res.status(401).json({ success: false, message: 'Invalid username or password' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});
app.post('/api/request-otp', (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ success: false, message: 'Username is required' });
  }

  // สุ่ม OTP 6 หลัก
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  
  // กำหนดเวลาหมดอายุ (เช่น 5 นาที)
  const expiresAt = Date.now() + 5 * 60 * 1000;

  // บันทึก OTP
  otpStore.set(username, { otp, expiresAt });

  console.log(`OTP for ${username} is: ${otp}`); // สำหรับการทดสอบ

  // ในระบบจริง: ส่ง OTP ผ่าน SMS Gateway หรือ Email ที่นี่

  res.json({ success: true, message: 'OTP sent successfully' });
});
app.post('/api/verify-otp', (req, res) => {
  const { username, otp } = req.body;

  const storedData = otpStore.get(username);

  if (!storedData) {
    return res.status(400).json({ success: false, message: 'OTP not found or expired' });
  }

  const { otp: storedOtp, expiresAt } = storedData;

  // ตรวจสอบเวลาหมดอายุ
  if (Date.now() > expiresAt) {
    otpStore.delete(username);
    return res.status(400).json({ success: false, message: 'OTP has expired' });
  }

  // ตรวจสอบความถูกต้องของ OTP
  if (otp === storedOtp) {
    otpStore.delete(username); // ลบ OTP เมื่อใช้แล้ว
    res.json({ success: true, message: 'OTP verified successfully' });
  } else {
    res.status(400).json({ success: false, message: 'Invalid OTP' });
  }
});
app.put('/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { completed } = req.body;

    const result = await pool.query(
      `UPDATE todos
       SET completed = $1
       WHERE id = $2
       RETURNING *`,
      [completed, id]
    );

    res.json(result.rows[0]);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});
app.delete('/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(
      'DELETE FROM todos WHERE id = $1',
      [id]
    );

    res.json({
      message: 'Todo deleted successfully'
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});