import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Razorpay from 'razorpay';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REGISTRATIONS_FILE = path.join(__dirname, 'registrations.json');

const app = express();
app.use(cors());

// For webhook route, we need raw body for signature verification.
// So we apply JSON parsing selectively.
app.use((req, res, next) => {
  if (req.path === '/api/webhook') {
    // Capture raw body as buffer for HMAC verification
    let rawBody = '';
    req.setEncoding('utf8');
    req.on('data', (chunk) => { rawBody += chunk; });
    req.on('end', () => {
      req.rawBody = rawBody;
      try {
        req.body = JSON.parse(rawBody);
      } catch (e) {
        req.body = {};
      }
      next();
    });
  } else {
    express.json()(req, res, next);
  }
});

// Initialize registrations file if not exists
if (!fs.existsSync(REGISTRATIONS_FILE)) {
  fs.writeFileSync(REGISTRATIONS_FILE, JSON.stringify([], null, 2));
}

// Helper to read registrations
function readRegistrations() {
  try {
    const data = fs.readFileSync(REGISTRATIONS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

// Helper to save registrations
function saveRegistrations(regs) {
  fs.writeFileSync(REGISTRATIONS_FILE, JSON.stringify(regs, null, 2));
}

const PRICING = {
  valorant: 300, // INR
  fc26: 100,     // INR
  volunteer: 0   // Free
};

// Create Cashfree Order
app.post('/api/create-order', async (req, res) => {
  const { name, email, phone, game, teamName, teamMembers, valorantData } = req.body;

  if (!name || !email || !phone || !game) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const amount = PRICING[game];
  if (amount === undefined) {
    return res.status(400).json({ error: 'Invalid game selected' });
  }

  // Generate unique order ID
  const orderId = `order_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  // For Volunteer, no payment is needed
  if (amount === 0) {
    const regs = readRegistrations();
    regs.push({
      orderId,
      name,
      email,
      phone,
      game,
      teamName: teamName || '',
      teamMembers: teamMembers || '',
      ...(req.body.volunteerData ? { volunteerData: req.body.volunteerData } : {}),
      amount: 0,
      status: 'SUCCESS',
      createdAt: new Date().toISOString()
    });
    saveRegistrations(regs);

    // Send data to Google Sheets
    const volunteerData = req.body.volunteerData;
    const sheetData = {
      Timestamp: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
      Name: name,
      Email: email,
      Phone: phone,
      Age: volunteerData?.age || "",
      Gender: volunteerData?.gender || "",
      City: volunteerData?.city || "",
      Instagram: volunteerData?.instagram || "",
      "Available Full Duration": volunteerData?.availableFullDuration || "",
      "Available Briefing": volunteerData?.availableBriefing || "",
      "Volunteered Before": volunteerData?.volunteeredBefore || "",
      "Previous Events": volunteerData?.previousEvents || "",
      "Other Experiences": volunteerData?.otherExperiences || "",
      "Interested Roles": volunteerData?.interestedRoles?.join(", ") || "",
      "Why Volunteer": volunteerData?.whyVolunteer || "",
      "Emergency Contact": volunteerData?.emergencyContact || "",
      "Followed Instagram": volunteerData?.followedInstagram || "",
      "Followed Twitch": volunteerData?.followedTwitch || ""
    };

    try {
      await fetch("https://script.google.com/macros/s/AKfycbwsDmv7oMJec4C5Ro7lquoLwbdm7oGLyXbaT3FdIyyLO05tZSLaUyra-yg9q4E7Cai3/exec", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sheetData)
      });
    } catch (e) {
      console.error("Failed to send to Google Sheets:", e);
    }

    return res.json({ free: true, orderId });
  }

  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  try {
    const options = {
      amount: amount * 100, // amount in paise
      currency: 'INR',
      receipt: orderId
    };

    const order = await razorpay.orders.create(options);

    // Save initial registration pending details
    const regs = readRegistrations();
    regs.push({
      orderId: order.id, // Use Razorpay order_id as our primary ID
      localOrderId: orderId,
      name,
      email,
      phone,
      game,
      teamName: teamName || '',
      teamMembers: teamMembers || '',
      ...(valorantData ? { valorantData } : {}),
      amount,
      status: 'PENDING',
      createdAt: new Date().toISOString()
    });
    saveRegistrations(regs);

    res.json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency
    });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    res.status(500).json({ error: 'Failed to create order', details: error.message });
  }
});

// Verify Razorpay Payment Signature
app.post('/api/verify-payment', (req, res) => {
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
  
  if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
    return res.status(400).json({ error: 'Missing payment verification fields' });
  }

  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest('hex');

  const isAuthentic = expectedSignature === razorpay_signature;

  if (isAuthentic) {
    const regs = readRegistrations();
    const index = regs.findIndex(r => r.orderId === razorpay_order_id);
    
    if (index !== -1) {
      regs[index].status = 'SUCCESS';
      regs[index].paymentId = razorpay_payment_id;
      console.log(`✅ Payment successful for order ${razorpay_order_id}`);
      
      // Push to Google Sheets for Valorant registrations
      if (regs[index].game === 'valorant' && regs[index].valorantData) {
        const vData = regs[index].valorantData;
        const sheetData = {
          Timestamp: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
          OrderId: razorpay_order_id,
          Status: "SUCCESS",
          TeamName: vData.teamName || "",
          City: vData.city || "",
          CaptainName: vData.captainName || "",
          CaptainEmail: vData.captainEmail || "",
          CaptainPhone: vData.captainPhone || "",
          CaptainWhatsApp: vData.captainWhatsApp || "",
          Player2: vData.player2 || "",
          Player3: vData.player3 || "",
          Player4: vData.player4 || "",
          Player5: vData.player5 || "",
          Player6: vData.player6 || "",
          AdditionalInfo: vData.additionalInfo || ""
        };
        
        try {
          fetch("https://script.google.com/macros/s/AKfycbx_yRn4PMqBAr4omDg_W0HlwdiJcTwCS8v6rebO-m732suMzUeNrezR1dqtbQpGoltL/exec", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(sheetData)
          }).then(() => console.log(`✅ Google Sheet updated for order ${razorpay_order_id}`))
            .catch(e => console.error("Failed to send to Google Sheets:", e));
        } catch (e) {
          console.error("Failed to send to Google Sheets:", e);
        }
      }
      saveRegistrations(regs);
      res.status(200).json({ success: true, message: 'Payment verified successfully' });
    } else {
      res.status(404).json({ error: 'Order not found in database' });
    }
  } else {
    console.log(`❌ Payment signature mismatch for order ${razorpay_order_id}`);
    res.status(400).json({ success: false, error: 'Invalid signature' });
  }
});

// Get all registrations (for admin / testing)
app.get('/api/registrations', (req, res) => {
  res.json(readRegistrations());
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

