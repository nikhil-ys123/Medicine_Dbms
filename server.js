// server.js
const express = require('express');
const mysql = require('mysql2/promise');
const path = require('path');

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// === CONFIGURE DB CREDENTIALS HERE ===
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',            // <-- replace
  password: '123pass',   // <-- replace
  database: 'medicine_db', // <-- replace if different
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// --- Helpers ---
async function query(sql, params = []) {
  const [rows] = await pool.execute(sql, params);
  return rows;
}

// === ROUTES ===

// First page: admin dashboard with 3 boxes
app.get('/', async (req, res) => {
  try {
    const suppliers = await query('SELECT * FROM supplier ORDER BY supp_name');
    const medicines = await query('SELECT * FROM medicine ORDER BY med_name');
    res.render('index', { suppliers, medicines });
  } catch (err) {
    console.error(err);
    res.status(500).send('DB error');
  }
});

// --- Medicine endpoints ---
app.post('/add-medicine', async (req, res) => {
  try {
    const { med_name, quantity, price_prpk } = req.body;
    await query(
      'INSERT INTO medicine (med_name, quantity, price_prpk) VALUES (?, ?, ?)',
      [med_name, parseInt(quantity, 10), parseFloat(price_prpk)]
    );
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Insert medicine failed');
  }
});

// NEW: Get single medicine for editing
app.get('/api/medicine/:id', async (req, res) => {
  try {
    const med_id = parseInt(req.params.id, 10);
    const rows = await query('SELECT * FROM medicine WHERE med_id = ?', [med_id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Medicine not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch medicine' });
  }
});

// NEW: Update medicine
app.put('/api/medicine/:id', async (req, res) => {
  try {
    const med_id = parseInt(req.params.id, 10);
    const { med_name, quantity, price_prpk } = req.body;
    await query(
      'UPDATE medicine SET med_name = ?, quantity = ?, price_prpk = ? WHERE med_id = ?',
      [med_name, parseInt(quantity, 10), parseFloat(price_prpk), med_id]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Update medicine failed' });
  }
});

// UPDATED: Delete medicine by ID from button
app.post('/delete-medicine/:id', async (req, res) => {
  try {
    const med_id = parseInt(req.params.id, 10);
    if (Number.isNaN(med_id)) return res.status(400).send('Invalid med_id');
    await query('DELETE FROM medicine WHERE med_id = ?', [med_id]);
    res.redirect('/medicines');
  } catch (err) {
    console.error(err);
    res.status(500).send('Delete medicine failed');
  }
});

app.get('/medicines', async (req, res) => {
  try {
    const medicines = await query('SELECT * FROM medicine ORDER BY med_id');
    res.render('medicines', { medicines });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error loading medicines');
  }
});

// --- Supplier endpoints ---
app.post('/add-supplier', async (req, res) => {
  try {
    const { supp_name, supp_add, supp_contact } = req.body;
    await query(
      'INSERT INTO supplier (supp_name, supp_add, supp_contact) VALUES (?, ?, ?)',
      [supp_name, supp_add, supp_contact]
    );
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Insert supplier failed');
  }
});

// NEW: Get single supplier for editing
app.get('/api/supplier/:id', async (req, res) => {
  try {
    const supp_id = parseInt(req.params.id, 10);
    const rows = await query('SELECT * FROM supplier WHERE supp_id = ?', [supp_id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Supplier not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch supplier' });
  }
});

// NEW: Update supplier
app.put('/api/supplier/:id', async (req, res) => {
  try {
    const supp_id = parseInt(req.params.id, 10);
    const { supp_name, supp_add, supp_contact } = req.body;
    await query(
      'UPDATE supplier SET supp_name = ?, supp_add = ?, supp_contact = ? WHERE supp_id = ?',
      [supp_name, supp_add, supp_contact, supp_id]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Update supplier failed' });
  }
});

// UPDATED: Delete supplier by ID from button
app.post('/delete-supplier/:id', async (req, res) => {
  try {
    const supp_id = parseInt(req.params.id, 10);
    if (Number.isNaN(supp_id)) return res.status(400).send('Invalid supp_id');
    await query('DELETE FROM supplier WHERE supp_id = ?', [supp_id]);
    res.redirect('/suppliers');
  } catch (err) {
    console.error(err);
    res.status(500).send('Delete supplier failed');
  }
});

app.get('/suppliers', async (req, res) => {
  try {
    const suppliers = await query('SELECT * FROM supplier ORDER BY supp_id');
    res.render('suppliers', { suppliers });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error loading suppliers');
  }
});

// --- Supplier_Medicine (junction) endpoints ---
app.post('/add-supplier-medicine', async (req, res) => {
  try {
    const { supp_id, med_id } = req.body;
    await query(
      'INSERT INTO supplier_medicine (supp_id, med_id) VALUES (?, ?)',
      [parseInt(supp_id, 10), parseInt(med_id, 10)]
    );
    res.redirect('/');
  } catch (err) {
    console.error(err);
    // If duplicate pair attempted, inform user (duplicate PK)
    const message = err.code === 'ER_DUP_ENTRY' ? 'This supplier-medicine pair already exists.' : 'Insert supplier_medicine failed';
    res.status(500).send(message);
  }
});

app.post('/delete-supplier-medicine', async (req, res) => {
  try {
    const { supp_id, med_id } = req.body;
    await query('DELETE FROM supplier_medicine WHERE supp_id = ? AND med_id = ?', [parseInt(supp_id, 10), parseInt(med_id, 10)]);
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Delete supplier_medicine failed');
  }
});

app.get('/supplier-medicines', async (req, res) => {
  try {
    const rows = await query(
      `SELECT sm.supp_id, sm.med_id, s.supp_name, m.med_name
       FROM supplier_medicine sm
       JOIN supplier s ON sm.supp_id = s.supp_id
       JOIN medicine m ON sm.med_id = m.med_id
       ORDER BY s.supp_name, m.med_name`
    );
    res.render('supplier_medicines', { rows });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error loading supplier-medicine table');
  }
});

// --- API for HAVING clause (suppliers who supply > 1 medicine) ---
app.get('/api/suppliers/more-than-one', async (req, res) => {
  try {
    const rows = await query(
      `SELECT s.supp_name, COUNT(sm.med_id) AS med_count
       FROM supplier_medicine sm
       JOIN supplier s ON sm.supp_id = s.supp_id
       GROUP BY s.supp_id, s.supp_name
       HAVING COUNT(sm.med_id) > 1
       ORDER BY med_count DESC, s.supp_name`
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Query failed' });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));