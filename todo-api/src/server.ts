import express from 'express';
import cors from 'cors';
import { pool } from './database/db';



// 1. ตั้งค่าให้ DNS เลือกใช้ IPv4 ก่อนเสมอ (ป้องกัน IPv6 ENETUNREACH)
const app = express();
// เก็บ OTP ชั่วคราว (ในระบบจริงควรใช้ Redis หรือ Database)
const otpStore = new Map<string, { otp: string; expiresAt: number }>();

app.use(cors({
  origin: [
    'https://lamped.netlify.app',
    'http://localhost:4200',
    'https://coruscating-donut-62bb86.netlify.app',
    'https://tamraidee.netlify.app',
    'https://tamraidee.nat-lukkanathiti.workers.dev',
    'https://trd.tamraidee.workers.dev'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'ngrok-skip-browser-warning'],
  credentials: true
}));

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

app.get('/api/months', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM months ORDER BY id ASC'
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

app.get('/api/sale_order', async (req, res) => {   
  try {     
    const result = await pool.query(       
      'SELECT id, order_code, date, amount, create_by, status FROM sale_order'     
    );      
    const formattedRows = result.rows.map(row => {
      if (row.date) {
        const dateObj = new Date(row.date);
        row.date = dateObj.toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        });
      }
      return row;
    });

    res.json(formattedRows);   
  } catch (error) {     
    console.error(error);     
    res.status(500).json({ message: 'Server Error' });   
  } 
});
app.get('/api/inventory', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT id, sku, product_name, category, brand ,quantity, quantity_alert FROM inventory'
        );

        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});
app.get('/api/history', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT id, date, sku, product_name, brand, price, quantity created_by FROM history ORDER BY id ASC'
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'No history records found' });
        }

        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});
app.post('/todos', async (req, res) => {
  try {
    // ➕ [เพิ่ม] รับค่า otp เพิ่มเติมมาจาก Frontend
    const { username, title, password, otp } = req.body;

    // ➕ [เพิ่ม] เช็กว่าส่งอีเมลและ OTP มาหรือไม่
    if (!title || !otp) {
      return res.status(400).json({ success: false, message: 'กรุณากรอกอีเมลและรหัส OTP' });
    }

    // ➕ [เพิ่ม] ดึงข้อมูล OTP ที่จดไว้ในสมุดโน้ต (otpStore)
    const storedData = otpStore.get(title);

    // ➕ [เพิ่ม] Step 1: เช็กว่ามี OTP ของอีเมลนี้สร้างไว้ไหม
    if (!storedData) {
      return res.status(400).json({ success: false, message: 'ไม่พบรหัส OTP หรือ OTP หมดอายุแล้ว' });
    }

    // ➕ [เพิ่ม] Step 2: เช็กว่า OTP หมดอายุหรือยัง (เกิน 5 นาทีไหม)
    if (Date.now() > storedData.expiresAt) {
      otpStore.delete(title);
      return res.status(400).json({ success: false, message: 'รหัส OTP หมดอายุแล้ว กรุณาขอใหม่' });
    }

    // ➕ [เพิ่ม] Step 3: เช็กว่า OTP ที่ยูเซอร์พิมพ์มา ตรงกับรหัสจริงไหม
    if (storedData.otp !== otp) {
      return res.status(400).json({ success: false, message: 'รหัส OTP ไม่ถูกต้อง' });
    }

    // ➕ [เพิ่ม] Step 4: ถ้ารหัสถูกต้อง -> ลบรหัสออกจากสมุดโน้ตทันที (กันเอามาใช้ซ้ำ)
    otpStore.delete(title);

    // ------------------------------------------
    // โค้ดเดิมของคุณ: บันทึกข้อมูลผู้ใช้ลง PostgreSQL
    // ------------------------------------------
    const result = await pool.query(
      `INSERT INTO todos (username, title, password, completed)
       VALUES ($1, $2, $3, false)
       RETURNING *`,
      [username, title, password]
    );

    // ✏️ [ปรับแก้ไข] ส่งโครงสร้าง JSON ตอบกลับให้ละเอียดและอ่านง่ายขึ้น
    res.status(201).json({
      success: true,
      message: 'สมัครสมาชิกสำเร็จ!',
      user: result.rows[0]
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
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

  // ของใหม่ (4 หลัก): สุ่มตั้งแต่ 1000 ถึง 9999
  const otp = Math.floor(1000 + Math.random() * 9000).toString();
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
      // เปลี่ยนจาก process.env.EMAIL_USER เป็นอีเมลจริงของคุณ
      body: JSON.stringify({
        sender: {
          name: 'Tamraidee Co.Th',
          email:'minec2645@gmail.com'
      },
      to: [{ email: title }],
      subject: 'Passcode OTP for Register',
      htmlContent: `<p>Your PIN is a: <h1>${otp}</h1> (Expire in 5 minutes)</p>`
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

app.post('/api/check-email', async (req, res) => {
  try {
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({
        exists: false,
        message: 'กรุณากรอกอีเมล'
      });
    }

    const result = await pool.query(
      'SELECT id FROM todos WHERE title = $1',
      [title]
    );

    if (result.rows.length > 0) {
      return res.json({
        exists: true
      });
    }

    return res.json({
      exists: false,
      message: 'ไม่พบอีเมลนี้ในระบบ'
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      exists: false,
      message: 'Server Error'
    });
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

app.put('/api/reset-password', async (req, res) => {
  try {
    const { title, password } = req.body;

    if (!title || !password) {
      return res.status(400).json({
        success: false,
        message: 'กรุณากรอกอีเมลและรหัสผ่านใหม่'
      });
    }

    // เช็กว่ามี Account นี้จริงไหม
    const userCheck = await pool.query(
      'SELECT * FROM todos WHERE title = $1',
      [title]
    );

    if (userCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบอีเมลนี้ในระบบ'
      });
    }

    // เปลี่ยน Password
    const result = await pool.query(
      `UPDATE todos
       SET password = $1
       WHERE title = $2
       RETURNING id, username, title`,
      [password, title]
    );

    res.json({
      success: true,
      message: 'เปลี่ยนรหัสผ่านสำเร็จ',
      user: result.rows[0]
    });

  } catch (error) {

    console.error('Reset Password Error:', error);

    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
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