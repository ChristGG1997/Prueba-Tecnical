const express = require('express');
const DateDiff = require('date-diff');
const router = express.Router();

const mysqlConnection = require('../database.js');




/* -------------------------------------------------------------------------- */
/*                               Get all Vihicle                              */
/* -------------------------------------------------------------------------- */
router.get('/', async (req, res) => {
  await mysqlConnection.query('SELECT * FROM parking', (err, rows, fields) => {
    if (!err) {
      let msg = { "Message": "Error, No se encuentra datos de ni unos de los vehiculos" };
      res.json(rows.length > 0 ? rows : msg);
    } else {
      res.json({ "Error": err });
    }
  });
});



/* -------------------------------------------------------------------------- */
/*                             GET Vihicle for ID                             */
/* -------------------------------------------------------------------------- */
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  await mysqlConnection.query('SELECT * FROM parking WHERE id = ?', [id], (err, rows, fields) => {
    if (!err) {
      let msg = { "Message": "Error, No se encuentra vehiculos con este id" };
      res.json(rows.length > 0 ? rows[0] : msg);
    } else {
      res.json({ "Error": err });
    }
  });
});


/* -------------------------------------------------------------------------- */
/*                              REGISTER An Vehicle                             */
/* -------------------------------------------------------------------------- */
router.post('/', async (req, res) => {
  const { id, plate, date_entry, date_departure, type_vehicle } = req.body;
  let valPlate = await mysqlConnection.query('SELECT * FROM parking WHERE plate = ?', [plate]);
  const query =
  {
    id,
    plate,
    date_entry: "",
    date_departure: "",
    type_vehicle: valPlate.length > 0  ? valPlate[0].type_vehicle : ""
  }
  console.log(query);
  await mysqlConnection.query('INSERT INTO parking set ?', [query], (err, rows, fields) => {
    if (!err) {
      res.json({ status: 'Vehicle Register' });
    } else {
      res.json({ "Error": err });
    }
  });
});


/* -------------------------------------------------------------------------- */
/*                              REGISTER ENTRY                                */
/* -------------------------------------------------------------------------- */
router.post('/register_entry/:id', async (req, res) => {
  const { id } = req.params;
  const { plate } = req.body;
  let valPlate = await mysqlConnection.query('SELECT * FROM parking WHERE plate = ?', [plate]);
  if (valPlate.length > 0) {
    if (valPlate[0].date_entry == '0000-00-00 00:00:00') {
      const query =
      {
        date_entry: new Date()
      }
      await mysqlConnection.query('UPDATE parking set ? WHERE plate = ? && id = ?', [query, plate, id], (err, rows, fields) => {
        if (!err) {
          res.json({ "Message": 'Hora de entrada registrada' });
        } else {
          res.json({ "Error": err });
        }
      });
    }
    else {
      res.json({ "Message": 'Ya se registro una fecha de entrada' });
    }
  }
  else {
    res.json({ "Message": 'La placa no se encuentra registrada' });
  }
});


/* -------------------------------------------------------------------------- */
/*                               REGISTER OUTPUT                              */
/* -------------------------------------------------------------------------- */
router.post('/register_output/:id', async (req, res) => {
  const { id } = req.params;
  const { plate } = req.body;
  let valPlate = await mysqlConnection.query('SELECT * FROM parking WHERE plate = ?', [plate]);
  if (valPlate.length > 0) {
    if (valPlate[0].date_departure == '0000-00-00 00:00:00') {

      const query =
      {
        date_departure: new Date()
      }
      await mysqlConnection.query('UPDATE parking set ? WHERE plate = ? && id = ?', [query, plate, id], (err, rows, fields) => {
        if (!err) {
          res.json({ "Message": 'Hora de salida registrada' });
        } else {
          res.json({ "Error": err });
        }
      });
    }
    else {
      res.json({ "Message": 'Ya se registro una fecha de salida en esta placa de vehiculo' });
    }
  }
  else {
    res.json({ "Message": 'La placa no se encuentra registrada' });
  }
});


/* -------------------------------------------------------------------------- */
/*                           assign official vehicle                          */
/* -------------------------------------------------------------------------- */
router.post('/assign_official_vehicle/:id', async (req, res) => {
  const { id } = req.params;
  const { plate } = req.body;
  let valPlate = await mysqlConnection.query('SELECT * FROM parking WHERE plate = ?', [plate]);
  if (valPlate.length > 0) {
    if (valPlate[0].type_vehicle == '') {
      const query =
      {
        type_vehicle: "OF" // OF = VEHICULO OFICIAL --- RE = VEHICULO RESIDENTE
      }
      await mysqlConnection.query('UPDATE parking set ? WHERE plate = ? && id = ?', [query, plate, id], (err, rows, fields) => {
        if (!err) {
          res.json({ "Message": 'Dado de alta el vehiculo' });
        } else {
          res.json({ "Error": err });
        }
      });
    }
    else {
      res.json({ "Message": 'Ya se registro un tipo de vehiculo' });
    }
  }
  else {
    res.json({ "Message": 'La placa no se encuentra registrada' });
  }
});


/* -------------------------------------------------------------------------- */
/*                           assign resident vehicle                          */
/* -------------------------------------------------------------------------- */
router.post('/assign_resident_vehicle/:id', async (req, res) => {
  const { id } = req.params;
  const { plate } = req.body;
  let valPlate = await mysqlConnection.query('SELECT * FROM parking WHERE plate = ?', [plate]);
  if (valPlate.length > 0) {
    if (valPlate[0].type_vehicle == '') {
      const query =
      {
        type_vehicle: "RE" // OF = VEHICULO OFICIAL --- RE = VEHICULO RESIDENTE
      }
      await mysqlConnection.query('UPDATE parking set ? WHERE plate = ? && id = ?', [query, plate, id], (err, rows, fields) => {
        if (!err) {
          res.json({ "Message": 'Dado de alta el vehiculo' });
        } else {
          res.json({ "Error": err });
        }
      });
    }
    else {
      res.json({ "Message": 'Ya se registro un tipo de vehiculo' });
    }
  }
  else {
    res.json({ "Message": 'La placa no se encuentra registrada' });
  }
});



/* -------------------------------------------------------------------------- */
/*                                GENERATE PAY                                */
/* -------------------------------------------------------------------------- */

router.post('/get_pay', async (req, res) => {
  const { plate } = req.body;
  let valPlate = await mysqlConnection.query('SELECT * FROM parking WHERE plate = ?', [plate]);
  if (valPlate.length > 0) {
    let minutosTotales = 0;
    valPlate.forEach(async(element) => {
      let minTemp = new Date(element.date_departure - element.date_entry);
      let milToSeg = minTemp / 1000;
      let segToMin = milToSeg / 60;
      minutosTotales = minutosTotales + segToMin;
   });
   let gastoXminutos = minutosTotales * 0.5;
   const query =
      {
        plate,
        price : gastoXminutos,
        minutes : minutosTotales
      }
  let valPay = await mysqlConnection.query('SELECT * FROM payments WHERE plate = ?', [plate]);
  if (valPay.length > 0) {
      await mysqlConnection.query('UPDATE payments set ? WHERE plate = ? ', [query, plate], (err, rows, fields) => {
        if (!err) {
          res.json({ "Message": 'se ha actualizado la cotizacion de los vehiculo' });
        } else {
          res.json({ "Error": err });
        }
      });
  }
  else{
    await mysqlConnection.query('INSERT INTO payments set ?', [query], (err, rows, fields) => {
      if (!err) {
        res.json({ status: 'se generado la cotizacion de los vehiculo' });
      } else {
        res.json({ "Error": err });
      }
    });
  }
  }
  else {
    res.json({ "Message": 'No hay placa registradas' });
  }
});




/* -------------------------------------------------------------------------- */
/*                                   GET PAY                                  */
/* -------------------------------------------------------------------------- */
router.post('/get_pay_det', async (req, res) => {
  const { plate } = req.body;
  let valPlate = await mysqlConnection.query('SELECT * FROM parking WHERE plate = ?', [plate]);
  if (valPlate.length > 0) {
      await mysqlConnection.query('SELECT * FROM payments WHERE plate = ?', [plate], (err, rows, fields) => {
        if (!err) {
          res.json(rows.length > 0 ? rows[0] : msg);
        } else {
          res.json({ "Error": err });
        }
      });    
  }
  else {
    res.json({ "Message": 'La placa no se encuentra registrada' });
  }
});



module.exports = router;