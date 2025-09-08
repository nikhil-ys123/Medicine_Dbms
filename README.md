# Medicine Inventory Management

A web application to manage medicines, suppliers, and their relationships for a medical store.  
Built with Node.js, Express, MySQL, and EJS.

---

## Features

- Add, edit, and delete medicines
- Add, edit, and delete suppliers
- Link suppliers to medicines
- View analytics (e.g., suppliers with multiple medicines)
- Responsive, modern dashboard UI

---

## Getting Started

### Prerequisites

- [Git](https://git-scm.com/downloads)
- [Node.js](https://nodejs.org/)
- [MySQL](https://dev.mysql.com/downloads/installer/)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/nikhil-ys123/Medicine_Dbms.git
   cd Medicine_Dbms
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure the database**
   - Create a MySQL database (default: `medicine_db`)
   - Update credentials in `server.js` if needed:
     ```js
     const pool = mysql.createPool({
       host: 'localhost',
       user: 'root',
       password: '123pass',
       database: 'medicine_db',
       // ...
     });
     ```
   - Import the required tables (see below).

4. **Start the server**
   ```bash
   npm start
   ```
   The app will run at [http://localhost:3000](http://localhost:3000)

---

## Database Schema

Create these tables in your MySQL database:

```sql
CREATE TABLE medicine (
  med_id INT AUTO_INCREMENT PRIMARY KEY,
  med_name VARCHAR(100) NOT NULL,
  quantity INT DEFAULT 0,
  price_prpk DECIMAL(10,2) DEFAULT 0.00
);

CREATE TABLE supplier (
  supp_id INT AUTO_INCREMENT PRIMARY KEY,
  supp_name VARCHAR(100) NOT NULL,
  supp_add VARCHAR(255),
  supp_contact VARCHAR(20)
);

CREATE TABLE supplier_medicine (
  supp_id INT,
  med_id INT,
  PRIMARY KEY (supp_id, med_id),
  FOREIGN KEY (supp_id) REFERENCES supplier(supp_id) ON DELETE CASCADE,
  FOREIGN KEY (med_id) REFERENCES medicine(med_id) ON DELETE CASCADE
);
```

---

## Usage

- Access the dashboard at `/`
- Add medicines and suppliers using the forms
- Link suppliers to medicines
- Edit or delete entries from the respective lists
- View analytics for suppliers with multiple medicines

---

## Folder Structure

```
Medicine_Dbms/
├── public/
│   ├── main.js
│   └── styles.css
├── views/
│   ├── index.ejs
│   ├── medicines.ejs
│   ├── suppliers.ejs
│   └── supplier_medicines.ejs
├── server.js
└── Readme.md
```

---

## Notes

- Make sure MySQL is running before starting the server.
- Update database credentials in `server.js` if needed.
- For any issues, check the terminal for error messages.

---

## License

MIT
