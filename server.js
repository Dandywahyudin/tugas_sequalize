const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
  host: 'localhost',
  dialect: 'mysql',
});

let corsOptions = {
    origin: "http://localhost:3000"
  };

  app.use(cors(corsOptions));
  app.use(express.json());
  app.use(express.urlencoded({
    extended: true
  }));

const Biodata = sequelize.define('Biodata', {
  nama: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tempatLahir: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tanggalLahir: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  alamat: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

sequelize.sync()
  .then(() => {
    console.log('Database & tabel berhasil dibuat');
  })
  .catch((error) => {
    console.error('Terjadi kesalahan saat sinkronisasi:', error);
  });

const app = express();
app.use(express.json());

// Create Biodata
app.post('/biodata', (req, res) => {
  const { nama, tempatLahir, tanggalLahir, alamat } = req.body;

  Biodata.create({
    nama,
    tempatLahir,
    tanggalLahir,
    alamat,
  })
    .then((biodata) => {
      res.status(201).json(biodata);
    })
    .catch((error) => {
      console.error('Terjadi kesalahan saat membuat biodata:', error);
      res.status(500).json({ error: 'Terjadi kesalahan saat membuat biodata' });
    });
});

//  Read Biodata
app.get('/biodata/:id', (req, res) => {
  const biodataId = req.params.id;

  Biodata.findByPk(biodataId)
    .then((biodata) => {
      if (biodata) {
        res.json(biodata);
      } else {
        res.status(404).json({ error: 'Biodata tidak ditemukan' });
      }
    })
    .catch((error) => {
      console.error('Terjadi kesalahan saat membaca biodata:', error);
      res.status(500).json({ error: 'Terjadi kesalahan saat membaca biodata' });
    });
});

//  Update Biodata
app.put('/biodata/:id', (req, res) => {
  const biodataId = req.params.id;
  const { nama, tempatLahir, tanggalLahir, alamat } = req.body;

  Biodata.update({
    nama,
    tempatLahir,
    tanggalLahir,
    alamat,
  }, {
    where: { id: biodataId },
  })
    .then((result) => {
      if (result[0] === 1) {
        res.json({ message: 'Biodata berhasil diperbarui' });
      } else {
        res.status(404).json({ error: 'Biodata tidak ditemukan' });
      }
    })
    .catch((error) => {
      console.error('Terjadi kesalahan saat memperbarui biodata:', error);
      res.status(500).json({ error: 'Terjadi kesalahan saat memperbarui biodata' });
    });
});


