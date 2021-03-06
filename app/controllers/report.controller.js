const db = require('../models');

const Report = db.report;
const sequelize = db.sequelize;

const countDuration = (startTime, endTime) => {
  if (!endTime) return '0 hour';
  const start = startTime.split(':');
  const end = endTime.split(':');
  const duration = ((parseInt(end[0]) * 60) + parseInt(end[1])) - ((parseInt(start[0]) * 60) + parseInt(start[1]));
  const hour = Math.floor(duration/60);
  const minutes = duration % 60;

  return {hour, minutes, duration};
}

const convertDurationToString = (duration) => {
  const hour = Math.floor(duration/60);
  const minutes = duration % 60;

  return `${hour} hour ${minutes} minutes`;
}

const countTotalProductionResult = (item) => {
  return item.unit === 'jam' ? {
    productionResultHour: item.productionResult,
    productionResultKg: 0
  } : {
    productionResultHour: 0,
    productionResultKg: item.productionResult
  };
}

const convertDailyToMonthly = (operations, costs) => {
  let value = [];
  Array.apply(null, new Array(32)).map((_, index) => {
    let
      date = '',
      prepareTime = '',
      operationTime = '',
      repairTime = '',
      idleTime = '',
      productionResultHour = 0,
      productionResultKg = 0,
      totalCosts = 0;
    costs.filter(item => parseInt(item.date.split('-')[2]) === index).map((it) => {
      unitCost = it.unitCost || 0
      quantity = it.quantity || 0
      totalCosts += unitCost * quantity;
    })

    operations.filter(item => parseInt(item.date.split('-')[2]) === index).map((it) => {
      const duration = countDuration(it.startTime, it.endTime)
    //   totalProductionResult += countTotalProductionResult(it)
      productionResultHour += countTotalProductionResult(it).productionResultHour
      productionResultKg += countTotalProductionResult(it).productionResultKg
      switch (it.category) {
        case 'persiapan' :
          duration.hour ?
            prepareTime = `${duration.hour} hour ${duration.minutes} minutes`
          :
            prepareTime = `${duration.minutes} minutes`;
          date = it.date;
          break;
        case 'operasi' :
          duration.hour ?
            operationTime = `${duration.hour} hour ${duration.minutes} minutes`
          :
            operationTime = `${duration.minutes} minutes`;
          date = it.date;
          break;
        case 'perbaikan' :
        case 'tunggu perbaikan' :
        case 'service' :
          duration.hour ?
            repairTime = `${duration.hour} hour ${duration.minutes} minutes`
          :
            repairTime = `${duration.minutes} minutes`;
          date = it.date;
          break;
        case 'idle' :
        case 'cuaca buruk' :
        case 'lain-lain' :
          duration.hour ?
            idleTime = `${duration.hour} hour ${duration.minutes} minutes`
          :
            idleTime = `${duration.minutes} minutes`;
          date = it.date;
        break;
        
      }
    })

    if(date)
      value = [
          ...value,
          {date, prepareTime, operationTime, repairTime, idleTime, totalCosts, productionResultHour, productionResultKg}
        ];
  })

  return value;
}

const convertDailyToAnnual = (operations, costs) => {
  let value = [];
  const months = [
    '', 'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli',
    'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ]

  months.map((month, index) => {
    let
      dataMonthExist = false,
      prepareTime = '',
      prepare = 0,
      operationTime = '',
      operation = 0 ,
      repairTime = '',
      repair = 0,
      idleTime = '',
      idle = 0,
      productionResultHour = 0,
      productionResultKg = 0,
      totalCosts = 0;
    costs.filter(item => parseInt(item.date.split('-')[1]) === index).map((it) => {
      unitCost = it.unitCost || 0
      quantity = it.quantity || 0
      totalCosts += unitCost * quantity;
    })

    operations.filter(item => parseInt(item.date.split('-')[1]) === index).map((it) => {
      dataMonthExist = true;
      const {duration} = countDuration(it.startTime, it.endTime)
      productionResultHour += countTotalProductionResult(it).productionResultHour
      productionResultKg += countTotalProductionResult(it).productionResultKg
      switch (it.category) {
        case 'persiapan' :
          prepare += duration;
          break;
        case 'operasi' :
          operation += duration
          break;
        case 'perbaikan' :
        case 'tunggu perbaikan' :
        case 'service' :
          repair += duration
          break;
        case 'idle' :
        case 'cuaca buruk' :
        case 'lain-lain' :
          idle += duration
        break;
      }
    })

    prepareTime = convertDurationToString(prepare)
    operationTime = convertDurationToString(operation)
    repairTime = convertDurationToString(repair)
    idleTime = convertDurationToString(idle)

    if(dataMonthExist){
      value = [
          ...value,
          {month, prepareTime, operationTime, repairTime, idleTime, totalCosts, productionResultHour, productionResultKg}
        ];
      dataMonthExist = false;
    }
  })

  return value;
}

const changeOperationFormat = (array) => {
  return array.map((item) => {
    const {hour, minutes} = countDuration(item.startTime, item.endTime);
    const duration = hour ? `${hour} jam ${minutes} menit` : `${minutes} menit`

    return {...item, duration}
  })
}

exports.create = (req, res) => {
  const report = {
    type,
    dateOrMonthOrYear,
    projectId,
    toolId,
    isOperatorApproved,
    isOfficerApproved,
    isSiteManagerApproved,
    isProjectManagerApproved,
    userId
  } = req.body;
  report.createdAt = new Date(Date.now());
  report.status = 'draft';

  Report.create(report)
    .then(data => {
      return res.status(200).send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while creating the report'
      });
    });
}

exports.findDraft = (req, res) => {
    sequelize.query(
      `SELECT
        r.*,
        u.name AS "userName",
        t.name AS "toolName",
        p.name AS "projectName"
      FROM
        reports r, users u, tools t, projects p
      WHERE
        r.status = 'draft' AND
        r."userId" = u.id AND
        r."toolId" = t.id AND
        r."projectId" = p.id`
    )
      .then(result=> {
        const data = result[0];
        return res.status(200).send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
          err.message || 'Some error occurred while creating the cost'
        });
      });
}

exports.findApprove = (req, res) => {
    sequelize.query(
      `SELECT
        r.*,
        u.name AS "userName",
        t.name AS "toolName",
        p.name AS "projectName"
      FROM
        reports r, users u, tools t, projects p
      WHERE
        r.status = 'approved' AND
        r."userId" = u.id AND
        r."toolId" = t.id AND
        r."projectId" = p.id`
    )
      .then(result=> {
        const data = result[0];
        return res.status(200).send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
          err.message || 'Some error occurred while creating the cost'
        });
      });
}

exports.findDailyReport = (req, res) => {
    const {dateOrMonthOrYear, userId, createdAt, projectId, toolId} = req.params;
    const type = 'daily';

    sequelize.query(
      `SELECT 
        r.*,
        t.name AS "toolName",
        p.name AS "projectName",
        u.name AS "userName",
        m.location,
        m.job,
        m."initialHm",
        m."finalHm"
      FROM
        reports r, projects p, tools t, management m, users u
      WHERE
        r."dateOrMonthOrYear" = :dateOrMonthOrYear AND
        r."userId" = :userId AND
        r.type = :type AND
        r."createdAt" = :createdAt AND
        r."projectId" = :projectId AND
        r."toolId" = :toolId AND
        m.date = :dateOrMonthOrYear AND
        p.id = r."projectId" AND
        t.id = r."toolId" AND
        u.id = r."userId" AND
        m."projectId" = r."projectId" AND
        m."toolId" = r."toolId" AND
        m."userId" = r."userId"
      GROUP BY
        r."createdAt",
        r.type,
        r."dateOrMonthOrYear",
        r.status,
        r."projectId",
        r."toolId",
        r."isOfficerApproved",
        r."isOperatorApproved",
        r."isProjectManagerApproved",
        r."isSiteManagerApproved",
        r."userId",
        u.name,
        t.name,
        p.name,
        m.location,
        m.job,
        m."initialHm",
        m."finalHm"`,
      {replacements: {dateOrMonthOrYear, userId, type, createdAt, projectId, toolId}}
    )
      .then(result=> {
        const data = result[0][0];

        if(!result[0].length) return res.status(200).send(result[0]);

        const {dateOrMonthOrYear, userId, toolId, projectId} = data;

        sequelize.query(
            `SELECT * FROM operations o WHERE o.date = :dateOrMonthOrYear AND o."userId" = :userId AND o."toolId" = :toolId AND o."projectId" = :projectId`,
            {replacements: {dateOrMonthOrYear, userId, toolId, projectId}}
          )
          .then(result=> {
            const operations = result[0];
            data.operations = changeOperationFormat(operations);

            sequelize.query(
                `SELECT
                  c.*,
                  c.quantity * c."unitCost" AS total,
                  o.description,
                  o.unit
                FROM
                  costs c, operationals o
                WHERE
                  c.date = :dateOrMonthOrYear AND
                  c."userId" = :userId AND
                  c."toolId" = :toolId AND
                  c."projectId" = :projectId AND
                  o.id = c."operationalId"`,
                {replacements: {dateOrMonthOrYear, userId, toolId, projectId}}
              )
              .then(result=> {
                const costs = result[0];
                data.costs = costs;
                sequelize.query(
                    `SELECT * FROM management m WHERE m.date = :dateOrMonthOrYear AND m."userId" = :userId AND m."toolId" = :toolId AND m."projectId" = :projectId`,
                    {replacements: {dateOrMonthOrYear, userId, toolId, projectId}}
                  )
                  .then(result=> {
                    const management = result[0][0];
                    data.management = management;
                    return res.status(200).send(data);
                  })
                  .catch(err => {
                    res.status(500).send({
                      message:
                        err.message || 'Some error occurred while creating the cost'
                    });
                  });
              })
              .catch(err => {
                res.status(500).send({
                  message:
                    err.message || 'Some error occurred while creating the cost'
                });
              });
          })
          .catch(err => {
            res.status(500).send({
              message:
                err.message || 'Some error occurred while creating the cost'
            });
          });
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || 'Some error occurred while creating the cost'
        });
      });
}

exports.findMonthlyReport = (req, res) => {
    const {dateOrMonthOrYear, userId, createdAt, projectId, toolId} = req.params;
    const type = 'monthly';
    const year = dateOrMonthOrYear.split('-')[0];
    const month = dateOrMonthOrYear.split('-')[1];

    sequelize.query(
      `SELECT 
        r.*,
        t.name AS "toolName",
        p.name AS "projectName",
        u.name AS "userName",
        MIN(m."initialHm") AS "initialHm",
        MAX(m."finalHm") AS "finalHm"
      FROM
        reports r, projects p, tools t, users u, management m
      WHERE
        r."dateOrMonthOrYear" = :dateOrMonthOrYear AND
        r."userId" = :userId AND
        r.type = :type AND
        r."createdAt" = :createdAt AND
        r."projectId" = :projectId AND
        r."toolId" = :toolId AND
        EXTRACT(MONTH FROM m.date) = :month AND
        EXTRACT(YEAR FROM m.date) = :year AND
        m."projectId" = :projectId AND
        m."toolId" = :toolId AND
        p.id = r."projectId" AND
        t.id = r."toolId" AND
        u.id = r."userId"
      GROUP BY
        r."createdAt",
        r.type,
        r."dateOrMonthOrYear",
        r.status,
        r."projectId",
        r."toolId",
        r."isOfficerApproved",
        r."isOperatorApproved",
        r."isProjectManagerApproved",
        r."isSiteManagerApproved",
        r."userId",
        u.name,
        t.name,
        p.name`,
      {replacements: {year, month, dateOrMonthOrYear, userId, type, createdAt, projectId, toolId}}
    )
      .then(result=> {
        const data = result[0][0];

        if(!result[0].length) return res.status(200).send(result[0]);

        const {userId, toolId, projectId} = data;

        sequelize.query(
            `SELECT
              o.*, m."feeHour", m."feeKg"
            FROM
              management m, operations o
            WHERE 
              EXTRACT(MONTH FROM o.date) = :month AND
              EXTRACT(YEAR FROM o.date) = :year AND
              o."toolId" = :toolId AND
              o."projectId" = :projectId AND
              m.date = o.date AND
              m."toolId" = o."toolId" AND
              m."projectId" = o."projectId"
            ORDER BY
              o.date ASC`,
            {replacements: {year, month, userId, toolId, projectId}}
          )
          .then(result => {
            const dailyOperations = result[0];

            sequelize.query(
                `SELECT
                  c.*
                FROM
                  costs c
                WHERE 
                  EXTRACT(MONTH FROM c.date) = :month AND
                  EXTRACT(YEAR FROM c.date) = :year AND
                  c."toolId" = :toolId AND
                  c."projectId" = :projectId
                ORDER BY
                  c.date ASC`,
                {replacements: {year, month, userId, toolId, projectId}}
              )
              .then(result => {
                const costs = result[0];
                const operations = convertDailyToMonthly(dailyOperations, costs);
    
                data.operations = operations;
    
                return res.status(200).send(data);
    
              })
              .catch(err => {
                res.status(500).send({
                  message:
                    err.message || 'Some error occurred while creating the cost'
                });
              });

          })
          .catch(err => {
            res.status(500).send({
              message:
                err.message || 'Some error occurred while creating the cost'
            });
          });
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || 'Some error occurred while creating the cost'
        });
      });
}

exports.findAnnualReport = (req, res) => {
    const {dateOrMonthOrYear, userId, createdAt, projectId, toolId} = req.params;
    const type = 'annual';
    const year = dateOrMonthOrYear

    sequelize.query(
      `SELECT 
        r.*,
        t.name AS "toolName",
        p.name AS "projectName",
        u.name AS "userName",
        MIN(m."initialHm") AS "initialHm",
        MAX(m."finalHm") AS "finalHm",
        ug.mobilization,
        ug.demobilization
      FROM
        reports r, projects p, tools t, users u, management m, usages ug
      WHERE
        r."dateOrMonthOrYear" = :dateOrMonthOrYear AND
        r."userId" = :userId AND
        r.type = :type AND
        r."createdAt" = :createdAt AND
        r."projectId" = :projectId AND
        r."toolId" = :toolId AND
        ug."projectId" = :projectId AND
        ug."toolId" = :toolId AND
        EXTRACT(YEAR FROM m.date) = :year AND
        m."projectId" = :projectId AND
        m."toolId" = :toolId AND
        p.id = r."projectId" AND
        t.id = r."toolId" AND
        u.id = r."userId"
      GROUP BY
        r."createdAt",
        r.type,
        r."dateOrMonthOrYear",
        r.status,
        r."projectId",
        r."toolId",
        r."isOfficerApproved",
        r."isOperatorApproved",
        r."isProjectManagerApproved",
        r."isSiteManagerApproved",
        r."userId",
        u.name,
        t.name,
        p.name,
        ug.mobilization,
        ug.demobilization`,
      {replacements: {year, dateOrMonthOrYear, userId, type, createdAt, projectId, toolId}}
    )
      .then(result=> {
        const data = result[0][0];

        if(!result[0].length) return res.status(200).send(result[0]);

        const {userId, toolId, projectId} = data;

        sequelize.query(
          `SELECT
            o.*, m."feeHour", m."feeKg"
          FROM
            management m, operations o
          WHERE 
            EXTRACT(YEAR FROM o.date) = :year AND
            o."toolId" = :toolId AND
            o."projectId" = :projectId AND
            m.date = o.date AND
            m."toolId" = o."toolId" AND
            m."projectId" = o."projectId"
          ORDER BY
            o.date ASC`,
          {replacements: {year, userId, toolId, projectId}}
        )
          .then(result => {
          const dailyOperations = result[0];

          sequelize.query(
            `SELECT
              c.*
            FROM
              costs c
            WHERE 
              EXTRACT(YEAR FROM c.date) = :year AND
              c."toolId" = :toolId AND
              c."projectId" = :projectId
            ORDER BY
              c.date ASC`,
            {replacements: {year, userId, toolId, projectId}}
            )
              .then(result => {
                const costs = result[0];
                const operations = convertDailyToAnnual(dailyOperations, costs);

                data.operations = operations;

                return res.status(200).send(data);

              })
              .catch(err => {
                res.status(500).send({
                  message:
                  err.message || 'Some error occurred while creating the cost'
              });
              });

          })
          .catch(err => {
            res.status(500).send({
              message:
              err.message || 'Some error occurred while creating the cost'
            });
          });
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || 'Some error occurred while creating the cost'
        });
      });
}

exports.approveReport = (req, res) => {
  const {
    userId, createdAt, dateOrMonthOrYear, toolId, projectId, approverId
  } = req.body;

  sequelize.query(
    `SELECT
      r.type,
      r."isOperatorApproved",
      r."isOfficerApproved",
      r."isSiteManagerApproved",
      r."isProjectManagerApproved"
    FROM
      reports r
    WHERE
      r."userId" = :userId AND
      r."createdAt" = :createdAt AND
      r."dateOrMonthOrYear" = :dateOrMonthOrYear AND
      r."toolId" = :toolId AND
      r."projectId" = :projectId`,
    {replacements: {userId, createdAt, dateOrMonthOrYear, toolId, projectId}}
  )
    .then(result=> {
      const reports = result[0][0];

      if(!result[0].length) return res.status(200).send(result[0]);

      sequelize.query(
        `SELECT
          u.position
        FROM
          users u
        WHERE
          u.id = :approverId`,
        {replacements: {approverId}}
      )
        .then(result=> {
          const users = result[0][0];

          switch(users.position) {
            case '1' :
              if(!reports.type === 'daily') return res.status(500).send({
                message: 'Operator cannot approved except daily report'
              });
              query = 
                `UPDATE
                reports
                SET
                "isOperatorApproved" = :approverId
                WHERE
                "userId" = :userId AND
                "createdAt" = :createdAt AND
                "dateOrMonthOrYear" = :dateOrMonthOrYear AND
                "toolId" = :toolId AND
                "projectId" = :projectId
                RETURNING *`;
              break;
            case '2' :
              query = 
                `UPDATE
                  reports
                SET
                  "isOfficerApproved" = :approverId
                WHERE
                  "userId" = :userId AND
                  "createdAt" = :createdAt AND
                  "dateOrMonthOrYear" = :dateOrMonthOrYear AND
                  "toolId" = :toolId AND
                  "projectId" = :projectId
                RETURNING *`;
              break;
            case '3' :
              query = 
                `UPDATE
                  reports
                SET
                  "isSiteManager" = :approverId
                WHERE
                  "userId" = :userId AND
                  "createdAt" = :createdAt AND
                  "dateOrMonthOrYear" = :dateOrMonthOrYear AND
                  "toolId" = :toolId AND
                  "projectId" = :projectId
                RETURNING *`;

              if(reports.type === 'daily') {
                query =
                  `UPDATE
                    reports
                  SET
                    "isSiteManagerApproved" = :approverId,
                    "status" = 'approved'
                  WHERE
                    "userId" = :userId AND
                    "createdAt" = :createdAt AND
                    "dateOrMonthOrYear" = :dateOrMonthOrYear AND
                    "toolId" = :toolId AND
                    "projectId" = :projectId
                  RETURNING *`;
              }
              break;
            case '4' :
              if(!reports.type === 'daily') return res.status(500).send({
                message: 'Operator cannot approved except monthly and annual report'
              });
              query = 
                `UPDATE
                  reports
                SET
                  "isProjectManagerApproved" = :approverId
                WHERE
                  "userId" = :userId AND
                  "createdAt" = :createdAt AND
                  "dateOrMonthOrYear" = :dateOrMonthOrYear AND
                  "toolId" = :toolId AND
                  "projectId" = :projectId
                RETURNING *`;
  
                if(reports.type === 'monthly' || reports.type === 'annual') {
                  query =
                    `UPDATE
                      reports
                    SET
                      "isProjectManagerApproved" = :approverId,
                      "status" = 'approved'
                    WHERE
                      "userId" = :userId AND
                      "createdAt" = :createdAt AND
                      "dateOrMonthOrYear" = :dateOrMonthOrYear AND
                      "toolId" = :toolId AND
                      "projectId" = :projectId
                    RETURNING *`;
                }
              break;
          }

          sequelize.query(
            query,
            {replacements: {
              userId, createdAt, dateOrMonthOrYear, toolId, projectId, approverId
            }}
          )
            .then(result=> {
              const reports = result[0][0];

              return res.status(200).send(reports);
            })
            .catch(err => {
              res.status(500).send({
                message:
                  err.message || 'Some error occurred while creating the cost'
              });
            });
        })
        .catch(err => {
          res.status(500).send({
            message:
              err.message || 'Some error occurred while creating the cost'
          });
        });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while creating the cost'
      });
    });
}