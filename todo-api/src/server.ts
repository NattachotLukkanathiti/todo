import express from 'express';
import cors from 'cors';
import { pool } from './database/db';
import nodemailer from 'nodemailer'; 

const app = express();
// เก็บ OTP ชั่วคราว (ในระบบจริงควรใช้ Redis หรือ Database)
const otpStore = new Map();
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'YOUR_EMAIL@gmail.com', // ใส่อีเมลของคุณ
    pass: 'YOUR_APP_PASSWORD'      // ใส่ App Password (ไม่ใช่รหัสผ่านปกติ)
  }
});
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
      // ถ้าเจอผู้ใช้ป
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
app.post('/api/request-otp', async (req, res) => {
  const { username } = req.body; // username ในที่นี้คือ email จาก Frontend

  if (!username) {
    return res.status(400).json({ success: false, message: 'Username is required' });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 5 * 60 * 1000;

  otpStore.set(username, { otp, expiresAt });

  // ตั้งค่าเนื้อหาอีเมล
  const mailOptions = {
    from: 'YOUR_EMAIL@gmail.com',
    to: username,
    subject: 'รหัส OTP สำหรับการสมัครสมาชิก',
    text: `รหัส OTP ของคุณคือ: ${otp} (หมดอายุใน 5 นาที)`
  };

  try {
    // ส่งอีเมล
    await transporter.sendMail(mailOptions);
    console.log(`OTP sent to ${username}`);
    res.json({ success: true, message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, message: 'Failed to send OTP' });
  }
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