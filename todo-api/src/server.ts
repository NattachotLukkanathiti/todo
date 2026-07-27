import express from 'express';
import cors from 'cors';
import { pool } from './database/db';
import nodemailer from 'nodemailer'; 


// 1. ตั้งค่าให้ DNS เลือกใช้ IPv4 ก่อนเสมอ (ป้องกัน IPv6 ENETUNREACH)
const app = express();
// เก็บ OTP ชั่วคราว (ในระบบจริงควรใช้ Redis หรือ Database)
const otpStore = new Map();
const transporter = nodemailer.createTransport({
  // เปลี่ยนจาก 'smtp.gmail.com' เป็น IP ของ Gmail โดยตรง
  host: 'smtp-relay.brevo.com',// หรือ '142.251.10.108' (IP สำหรับ smtp.gmail.com)
  port: 587,
  secure: false, // STARTTLS
  family: 4,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
} as any);
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
  const { title } = req.body; 

  if (!title) {
    return res.status(400).json({ success: false, message: 'Username is required' });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 5 * 60 * 1000;

  otpStore.set(title, { otp, expiresAt });

  try {
    // ใช้ fetch ยิงหา Brevo API โดยตรง
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': process.env.BREVO_API_KEY ?? '', // แก้ไขตรงนี้: เพิ่ม ?? '' เพื่อให้เป็น string เสมอ
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        sender: { name: 'Todo App', email: process.env.EMAIL_USER },
        to: [{ email: title }],
        subject: 'รหัส OTP สำหรับการสมัครสมาชิก',
        htmlContent: `<p>รหัส OTP ของคุณคือ: <strong>${otp}</strong> (หมดอายุใน 5 นาที)</p>`
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Brevo API Error:', errorData);
      throw new Error('Failed to send via Brevo API');
    }

    console.log(`OTP sent to ${title}`);
    res.json({ success: true, message: 'OTP sent successfully' });

  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, message: 'Failed to send OTP' });
  }
});

app.post('/api/verify-otp', (req, res) => {
  const { title, otp } = req.body;

  const storedData = otpStore.get(title);

  if (!storedData) {
    return res.status(400).json({ success: false, message: 'OTP not found or expired' });
  }

  const { otp: storedOtp, expiresAt } = storedData;

  // ตรวจสอบเวลาหมดอายุ
  if (Date.now() > expiresAt) {
    otpStore.delete(title);
    return res.status(400).json({ success: false, message: 'OTP has expired' });
  }

  // ตรวจสอบความถูกต้องของ OTP
  if (otp === storedOtp) {
    otpStore.delete(title); // ลบ OTP เมื่อใช้แล้ว
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