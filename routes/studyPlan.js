const router = require('express').Router();
const sql = require('mssql');
const pool = require('../config/config');
const {
  logger
} = require('../lib/logger');

router.route('/getStat').get((req, res, next) => {
  pool.connect(err => {
    if (err) res.sendStatus(400);

    const request = new sql.Request(pool);
    request.query(
      `
      SELECT Номер, Заполнено, Всего 
      FROM [UniASR].[dbo].[ASR_Stat]
      ORDER BY Номер
    `,
      (err, result) => {
        if (err) {
          logger.log('error', 'Get group info error', {
            err
          });
          res.sendStatus(400);
        }

        logger.log('info', 'Get group info success', {
          result: req.params.group,
        });

        pool.close();
        res.send(result.recordset);
      },
    );
  });
});

module.exports = router;