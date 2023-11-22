// server.js
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { sql, poolPromise } = require('./db');
const cors = require('cors');
const app = express();
const crypto = require('crypto');
// const { MailerSend, EmailParams, Sender, Recipient } = require("mailersend");


// Middlewares
app.use(bodyParser.json());
app.use(cors());

// TaxiMail ใช้กับ (MailSend.jsx)
app.post('/sendmail', async (req, res) => {
    try {
      for (const emailData of req.body) {
        const payload = {
          to: emailData.email,
          template_key: '178746555923d0bc71',
          custom_fields: {
            // CF_ename: emailData.ename
            CF_ename: 'ทดสอบการส่งอีเมลล์'
          },
        };
  
        await axios.post('https://api.taximail.com/v2/transactional/send', payload, {
          headers: {
            'Authorization': `Bearer ${process.env.TAXIMAIL_API_KEY}`
          }
        });
      }
      res.send({ message: 'Emails sent successfully' });
    } catch (error) {
      console.error('Error sending emails:', error);
      res.status(500).send({ message: 'Error sending emails' });
    }
  });

  // Token Generate 
  function generateToken() {
      return crypto.randomBytes(32).toString('hex');
  }
  // เก็บค่า Token ไว้ใน table และ expire ใน 2 ชั่วโมง
  // Gen API link ของ /mailapprove
  // ใช้ใน requestform
  app.post('/gentoken', async (req, res) => {
    const { id, emailAddress, aprf } = req.body;
    const token = generateToken();

    try {
        // Update token in the database
        const pool = await poolPromise;
        await pool.request()
            .input('token', sql.VarChar, token)
            .input('id', sql.Int, id)
            .input('aprf', sql.VarChar, aprf)
            .query('UPDATE [dbo].[changeform] SET token = @token WHERE id = @id');

        // Create confirmation link
        const confirmationLink = `http://localhost:3000/mailapprove?id=${id}&aprf=${aprf}&token=${token}`;

        // Respond with confirmation link
        res.json({ confirmationLink, message: 'Token generated successfully.' });

        // Schedule to clear the token after 2 hours
        setTimeout(async () => {
            try {
                const pool = await poolPromise;
                await pool.request()
                    .input('id', sql.Int, id)
                    .query("UPDATE [dbo].[changeform] SET token = '' WHERE id = @id");
            } catch (error) {
                console.error('Error clearing token:', error);
            }
        }, 24 * 60 * 60 * 1000); // 2 hours in milliseconds

    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});



// Mail Approve กดยืนยันตอบรับจากอีเมลล์ (ในเมลล์จะได้รับการยืนยันในรูปแบบ link)
// ถ้า id และ token ตรงกับในตาราง จะทำการอัพเดต Approve ใน Table
app.get('/mailapprove', async (req, res) => {
    const { token, id, aprf } = req.query; // Get 'token' and 'id' from query string
    if (!id || !token) {
        return res.status(400).send({ message: 'ID and token are required in query string.' });
    }

    try {
        // Verify the token first
        const pool = await poolPromise;
        const verificationResult = await pool.request()
            .input('id', sql.Int, id)
            .input('token', sql.VarChar, token)
            .input('aprf', sql.VarChar, aprf)
            .query('SELECT * FROM [dbo].[changeform] WHERE id = @id AND token = @token');

        if (verificationResult.recordset.length === 0) {
            return res.status(401).send({ message: 'Invalid token or ID' });
        }

        // อัพเดต table (aprf คือ ชื่อ field ที่กำหนดในฝั่ง client(frontend))
        const updateQuery = `
            UPDATE [dbo].[changeform]
            SET 
                ${aprf} = 'Approve'
            WHERE id = @id`;

        const updateResult = await pool.request()
            .input('id', sql.Int, id)
            .query(updateQuery);

        if (updateResult.rowsAffected[0] === 0) {
            res.status(404).send({ message: 'Record not found' });
        } else {
            res.status(200).send({ message: 'Record updated successfully!' });
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Show
app.get('/show', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM [dbo].[changeform]');
        res.status(200).send(result.recordset);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Show User
app.get('/user', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM [dbo].[user_changeform]');
        res.status(200).send(result.recordset);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Show Mail
app.get('/showmail', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM [dbo].[mailsend]');
        res.status(200).send(result.recordset);
    } catch (err) {
        res.status(500).send(err.message);
    }
});


// Add
app.post('/add', (req, res) => {
    const request = new sql.Request();
    const query = `
        INSERT INTO [dbo].[changeform](
            [requestDate], [requestName], [requestSurname], [jobRank], [jobGroup], [requestPhone],
            [requestEmail], [useDate], [changeLengh], [changeType], [changeTool],
            [changeToolInfo], [scodeName], [scodeFromVersion], [scodeToVersion], [etc], [changeCoz],
            [researchRel], [researchRef], [changeEff], [manaName], [manaRank], [mana2Name], [mana2Rank],
            [reqFinishDate], [implementPlan], [changeTest], [testInfo], [rollbackPlan], [rollbackInfo],
            [userContact], [headDepaName], [headDepaApprove], [headDepaComment],
            [headDepaDate], [headITName], [headITApprove], [headITEsti], [headITEstiComment], [headITDate], [auditName],
            [auditApprove], [auditComment], [auditDate], [ref1Name], [ref1Approve], [ref2Approve],
            [ref1Comment], [finishDate], [changeStatue], [changeResult], [userChange],
            [changeResName], [approveStatus]
        )
        VALUES(
            @requestDate, @requestName, @requestSurname, @jobRank, @jobGroup, @requestPhone,
            @requestEmail, @useDate, @changeLengh, @changeType, @changeTool,
            @changeToolInfo, @scodeName, @scodeFromVersion, @scodeToVersion, @etc, @changeCoz,
            @researchRel, @researchRef, @changeEff, 'รอผู้ดำเนินการ', @manaRank, 'ไม่มี', @mana2Rank,
            @reqFinishDate, @implementPlan, @changeTest, @testInfo, @rollbackPlan, @rollbackInfo,
            @userContact, @headDepaName, 'Pending', @headDepaComment,
            @headDepaDate, @headITName, 'Pending', @headITEsti, @headITEstiComment, @headITDate, @auditName,
            'Pending', @auditComment, @auditDate, @ref1Name, 'Pending', 'Pending',
            @ref1Comment, @finishDate, 'อยู่ในระหว่างดำเนินการ..', @changeResult, @userChange,
            @changeResName, 'Pending'
        )`;

    // List all fields and their types
    const fields = {
        requestDate: sql.SmallDateTime, requestName: sql.VarChar, requestSurname: sql.VarChar,
        jobRank: sql.VarChar, jobGroup: sql.VarChar, requestPhone: sql.VarChar,
        requestEmail: sql.VarChar, useDate: sql.Date, changeLengh: sql.VarChar,
        changeType: sql.VarChar, changeTool: sql.VarChar,
        changeToolInfo: sql.VarChar, scodeName: sql.VarChar, scodeFromVersion: sql.VarChar,
        scodeToVersion: sql.VarChar, etc: sql.VarChar, changeCoz: sql.VarChar,
        researchRel: sql.VarChar, researchRef: sql.VarChar, changeEff: sql.VarChar,
        manaName: sql.VarChar, manaRank: sql.VarChar, mana2Name: sql.VarChar,
        mana2Rank: sql.VarChar, reqFinishDate: sql.VarChar, implementPlan: sql.VarChar,
        changeTest: sql.VarChar, testInfo: sql.VarChar, rollbackPlan: sql.VarChar,
        rollbackInfo: sql.VarChar, userContact: sql.VarChar,
        headDepaName: sql.VarChar, headDepaApprove: sql.VarChar, headDepaComment: sql.VarChar,
        headDepaDate: sql.DateTime, headITName: sql.VarChar, headITApprove: sql.VarChar, headITEsti: sql.VarChar,
        headITEstiComment: sql.VarChar, headITDate: sql.DateTime, auditName: sql.VarChar,
        auditApprove: sql.VarChar, auditComment: sql.VarChar, auditDate: sql.VarChar, ref1Name: sql.VarChar,
        ref1Approve: sql.VarChar, ref2Approve: sql.VarChar,
        ref1Comment: sql.VarChar, finishDate: sql.DateTime,
        changeStatue: sql.VarChar, changeResult: sql.VarChar, userChange: sql.VarChar,
        changeResName: sql.VarChar, approveStatus: sql.VarChar
    };

    // Add inputs for all fields dynamically
    for (const [field, type] of Object.entries(fields)) {
        request.input(field, type, req.body[field]);
    }

    request.query(query, (err) => {
        if (err) return res.status(500).send(err);
        res.status(201).send({ message: 'Record added successfully!' });
    });
});

// Update approveStatus based on Deny conditions
app.put('/update-approve-status', async (req, res) => {
    const updateQuery = `
        UPDATE [dbo].[changeform]
        SET approveStatus = 'Deny'
        WHERE headDepaApprove = 'Deny'
           OR headITApprove = 'Deny'
           OR auditApprove = 'Deny'
           OR refITApprove = 'Deny'
    `;

    try {
        const pool = await poolPromise;
        const request = new sql.Request(pool);
        
        const result = await request.query(updateQuery);

        if (result.rowsAffected[0] > 0) {
            res.status(200).send({ message: 'Approve status updated successfully!' });
        } else {
            res.status(404).send({ message: 'No records found to update' });
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// IT Process
app.put('/itprocess', async (req, res) => {
    const id = req.body.id;

    if (!id) {
        return res.status(400).send({ message: 'id is required in request body.' });
    }

    // Set approveStatus based on headDepaApprove
    const approveStatus = req.body.headDepaApprove === 'Deny' ? 'Deny' : 'Pending';

    const updateQuery = `
        UPDATE [dbo].[changeform]
        SET 
            [manaName] = @manaName,
            [manaRank] = @manaRank,
            [mana2Name] = @mana2Name,
            [reqFinishDate] = @reqFinishDate,
            [implementPlan] = @implementPlan,
            [changeTest] = @changeTest,
            [testInfo] = @testInfo,
            [rollbackPlan] = @rollbackPlan,
            [rollbackInfo] = @rollbackInfo,
            [userContact] = @userContact,
            [headDepaName] = @headDepaName,
            [headDepaDate] = @headDepaDate,
            [headDepaApprove] = @headDepaApprove,
            [headDepaComment] = @headDepaComment,
            [approveStatus] = @approveStatus
        WHERE id = @id`;

    try {
        const pool = await poolPromise;
        const request = new sql.Request(pool);
        
        request.input('id', sql.Int, id);
        request.input('manaName', sql.VarChar, req.body.manaName);
        request.input('manaRank', sql.VarChar, req.body.manaRank);
        request.input('mana2Name', sql.VarChar, req.body.mana2Name);
        request.input('reqFinishDate', sql.Date, req.body.reqFinishDate);
        request.input('implementPlan', sql.VarChar, req.body.implementPlan);
        request.input('changeTest', sql.VarChar, req.body.changeTest);
        request.input('testInfo', sql.VarChar, req.body.testInfo);
        request.input('rollbackPlan', sql.VarChar, req.body.rollbackPlan);
        request.input('rollbackInfo', sql.VarChar, req.body.rollbackInfo);
        request.input('userContact', sql.VarChar, req.body.userContact);
        request.input('headDepaName', sql.VarChar, req.body.headDepaName);
        request.input('headDepaDate', sql.Date, req.body.headDepaDate);
        request.input('headDepaApprove', sql.VarChar, req.body.headDepaApprove);
        request.input('headDepaComment', sql.VarChar, req.body.headDepaComment);
        request.input('approveStatus', sql.VarChar, approveStatus);
    
        
        const result = await request.query(updateQuery);

        if (result.rowsAffected[0] === 0) {
            res.status(404).send({ message: 'Record not found' });
        } else {
            res.status(200).send({ message: 'Record updated successfully!' });
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// IT Finish
app.put('/itfinish', async (req, res) => {
    const id = req.body.id;

    if (!id) {
        return res.status(400).send({ message: 'id is required in request body.' });
    }

    // Set approveStatus based on headDepaApprove
    const approveStatus = req.body.changeStatue === 'เสร็จสิ้น' ? 'Finish' : 'Approve';

    const updateQuery = `
        UPDATE [dbo].[changeform]
        SET 
            [changeStatue] = @changeStatue,
            [changeResult] = @changeResult,
            [userChange] = @userChange,
            [finishDate] = @finishDate,
            [changeResName] = @changeResName,
            [approveStatus] = @approveStatus
        WHERE id = @id`;

    try {
        const pool = await poolPromise;
        const request = new sql.Request(pool);
        
        request.input('id', sql.Int, id);
        request.input('changeStatue', sql.VarChar, req.body.changeStatue);
        request.input('changeResult', sql.VarChar, req.body.changeResult);
        request.input('userChange', sql.VarChar, req.body.userChange);
        request.input('finishDate', sql.Date, req.body.finishDate);
        request.input('changeResName', sql.VarChar, req.body.changeResName);
        request.input('approveStatus', sql.VarChar, approveStatus);
    
        
        const result = await request.query(updateQuery);

        if (result.rowsAffected[0] === 0) {
            res.status(404).send({ message: 'Record not found' });
        } else {
            res.status(200).send({ message: 'Record updated successfully!' });
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Manager Approve
app.put('/mngapprove', async (req, res) => {
    const id = req.body.id;

    if (!id) {
        return res.status(400).send({ message: 'id is required in request body.' });
    }

    try {
        const pool = await poolPromise;
        const request = new sql.Request(pool);

        // First, we update the headITApprove status
        request.input('id', sql.Int, id);
        request.input('headITName', sql.VarChar, req.body.headITName);
        request.input('headITApprove', sql.VarChar, req.body.headITApprove);
        request.input('headITEsti', sql.VarChar, req.body.headITEsti);
        request.input('headITEstiComment', sql.VarChar, req.body.headITEstiComment);
        request.input('headITDate', sql.Date, req.body.headITDate);

        // Set approveStatus based on headITApprove
        const approveStatus = req.body.headITApprove === 'Deny' ? 'Deny' : 'Pending';
        request.input('approveStatus', sql.VarChar, approveStatus);

        const updateQuery = `
            UPDATE [dbo].[changeform]
            SET 
                [headITName] = @headITName,
                [headITApprove] = @headITApprove,
                [headITEsti] = @headITEsti,
                [headITEstiComment] = @headITEstiComment,
                [headITDate] = @headITDate,
                [approveStatus] = @approveStatus
            WHERE id = @id`;

        const result = await request.query(updateQuery);

        if (result.rowsAffected[0] === 0) {
            res.status(404).send({ message: 'Record not found' });
        } else {
            res.status(200).send({ message: 'Record updated successfully!' });
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Audit Approve
app.put('/auditapprove', async (req, res) => {
    const id = req.body.id;

    if (!id) {
        return res.status(400).send({ message: 'id is required in request body.' });
    }

    // Set approveStatus based on auditApprove
    const approveStatus = req.body.auditApprove === 'Deny' ? 'Deny' : 'Pending';

    const updateQuery = `
        UPDATE [dbo].[changeform]
        SET 
            [auditName] = @auditName,
            [auditApprove] = @auditApprove,
            [auditComment] = @auditComment,
            [auditDate] = @auditDate,
            [approveStatus] = @approveStatus
        WHERE id = @id`;

    try {
        const pool = await poolPromise;
        const request = new sql.Request(pool);
        
        request.input('id', sql.Int, id);
        request.input('auditName', sql.VarChar, req.body.auditName);
        request.input('auditApprove', sql.VarChar, req.body.auditApprove);
        request.input('auditComment', sql.VarChar, req.body.auditComment);
        request.input('auditDate', sql.Date, req.body.auditDate);
        request.input('approveStatus', sql.VarChar, approveStatus);

        
        const result = await request.query(updateQuery);

        if (result.rowsAffected[0] === 0) {
            res.status(404).send({ message: 'Record not found' });
        } else {
            res.status(200).send({ message: 'Record updated successfully!' });
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// ref1 Approve
app.put('/ref1approve', async (req, res) => {
    const id = req.body.id;

    if (!id) {
        return res.status(400).send({ message: 'id is required in request body.' });
    }

    // Set approveStatus based on auditApprove
    const approveStatus = req.body.ref1Approve === 'Deny' ? 'Deny' : 'Pending';

    const updateQuery = `
        UPDATE [dbo].[changeform]
        SET 
            [ref1Name] = @ref1Name,
            [ref1Approve] = @ref1Approve,
            [ref1Comment] = @ref1Comment,
            [ref1Date] = @ref1Date,
            [approveStatus] = 'Approve'
        WHERE id = @id`;

    try {
        const pool = await poolPromise;
        const request = new sql.Request(pool);
        
        request.input('id', sql.Int, id);
        request.input('ref1Name', sql.VarChar, req.body.ref1Name);
        request.input('ref1Approve', sql.VarChar, req.body.ref1Approve);
        request.input('ref1Comment', sql.VarChar, req.body.ref1Comment);
        request.input('ref1Date', sql.Date, req.body.ref1Date);
        request.input('approveStatus', sql.VarChar, approveStatus);

        
        const result = await request.query(updateQuery);

        if (result.rowsAffected[0] === 0) {
            res.status(404).send({ message: 'Record not found' });
        } else {
            res.status(200).send({ message: 'Record updated successfully!' });
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Edit
app.put('/edit', async (req, res) => {
    const id = req.body.id;

    if (!id) {
        return res.status(400).send({ message: 'id is required in request body.' });
    }

    const updateQuery = `
        UPDATE [dbo].[changeform]
        SET 
            [requestDate] = @requestDate,
            [requestName] = @requestName,
            [requestSurname] = @requestSurname,
            [jobRank] = @jobRank,
            [jobGroup] = @jobGroup,
            [requestPhone] = @requestPhone,
            [requestEmail] = @requestEmail,
            [useDate] = @useDate,
            [changeLengh] = @changeLengh,
            [changeType] = @changeType,
            [changeTool] = @changeTool,
            [changeToolInfo] = @changeToolInfo,
            [scodeName] = @scodeName,
            [scodeFromVersion] = @scodeFromVersion,
            [scodeToVersion] = @scodeToVersion,
            [etc] = @etc,
            [changeCoz] = @changeCoz,
            [researchRel] = @researchRel,
            [researchRef] = @researchRef,
            [changeEff] = @changeEff,
            [manaName] = @manaName,
            [manaRank] = @manaRank,
            [mana2Name] = @mana2Name,
            [mana2Rank] = @mana2Rank,
            [reqFinishDate] = @reqFinishDate,
            [implementPlan] = @implementPlan,
            [changeTest] = @changeTest,
            [testInfo] = @testInfo,
            [rollbackPlan] = @rollbackPlan,
            [rollbackInfo] = @rollbackInfo,
            [userContact] = @userContact,
            [headDepaName] = @headDepaName,
            [headDepaApprove] = @headDepaApprove,
            [headDepaComment] = @headDepaComment,
            [headDepaDate] = @headDepaDate,
            [headITName] = @headITName,
            [headITEsti] = @headITEsti,
            [headITEstiComment] = @headITEstiComment,
            [headITDate] = @headITDate,
            [auditName] = @auditName,
            [auditComment] = @auditComment,
            [auditDate] = @auditDate,
            [ref1Name] = @ref1Name,
            [ref1Approve] = @ref1Approve,
            [ref1Comment] = @ref1Comment,
            [finishDate] = @finishDate,
            [changeStatue] = @changeStatue,
            [changeResult] = @changeResult,
            [userChange] = @userChange,
            [changeResName] = @changeResName
        WHERE id = @id`;

    try {
        const pool = await poolPromise;
        const request = new sql.Request(pool);
        
        request.input('id', sql.Int, id);
        request.input('requestDate', sql.DateTime, req.body.requestDate);
        request.input('requestName', sql.VarChar, req.body.requestName);
        request.input('requestSurname', sql.VarChar, req.body.requestSurname);
        request.input('jobRank', sql.VarChar, req.body.jobRank);
        request.input('jobGroup', sql.VarChar, req.body.jobGroup);
        request.input('requestPhone', sql.VarChar, req.body.requestPhone);
        request.input('requestEmail', sql.VarChar, req.body.requestEmail);
        request.input('useDate', sql.Date, req.body.useDate);
        request.input('changeLengh', sql.VarChar, req.body.changeLengh);
        request.input('changeType', sql.VarChar, req.body.changeType);
        request.input('changeTool', sql.VarChar, req.body.changeTool);
        request.input('changeToolInfo', sql.VarChar, req.body.changeToolInfo);
        request.input('scodeName', sql.VarChar, req.body.scodeName);
        request.input('scodeFromVersion', sql.VarChar, req.body.scodeFromVersion);
        request.input('scodeToVersion', sql.VarChar, req.body.scodeToVersion);
        request.input('etc', sql.VarChar, req.body.etc);
        request.input('changeCoz', sql.VarChar, req.body.changeCoz);
        request.input('researchRel', sql.VarChar, req.body.researchRel);
        request.input('researchRef', sql.VarChar, req.body.researchRef);
        request.input('changeEff', sql.VarChar, req.body.changeEff);
        request.input('manaName', sql.VarChar, req.body.manaName);
        request.input('manaRank', sql.VarChar, req.body.manaRank);
        request.input('mana2Name', sql.VarChar, req.body.mana2Name);
        request.input('mana2Rank', sql.VarChar, req.body.mana2Rank);
        request.input('reqFinishDate', sql.Date, req.body.reqFinishDate);
        request.input('implementPlan', sql.VarChar, req.body.implementPlan);
        request.input('changeTest', sql.VarChar, req.body.changeTest);
        request.input('testInfo', sql.VarChar, req.body.testInfo);
        request.input('rollbackPlan', sql.VarChar, req.body.rollbackPlan);
        request.input('rollbackInfo', sql.VarChar, req.body.rollbackInfo);
        request.input('userContact', sql.VarChar, req.body.userContact);
        request.input('headDepaName', sql.VarChar, req.body.headDepaName);
        request.input('headDepaApprove', sql.VarChar, req.body.headDepaApprove);
        request.input('headDepaComment', sql.VarChar, req.body.headDepaComment);
        request.input('headDepaDate', sql.Date, req.body.headDepaDate);
        request.input('headITName', sql.VarChar, req.body.headITName);
        request.input('headITEsti', sql.VarChar, req.body.headITEsti);
        request.input('headITEstiComment', sql.VarChar, req.body.headITEstiComment);
        request.input('headITDate', sql.Date, req.body.headITDate);
        request.input('auditName', sql.VarChar, req.body.auditName);
        request.input('auditComment', sql.VarChar, req.body.auditComment);
        request.input('auditDate', sql.Date, req.body.auditDate);
        request.input('ref1Name', sql.VarChar, req.body.refITName1);
        request.input('ref1Approve', sql.VarChar, req.body.refITApprove);
        request.input('ref1Comment', sql.VarChar, req.body.refITComment);
        request.input('finishDate', sql.Date, req.body.finishDate);
        request.input('changeStatue', sql.VarChar, req.body.changeStatue);
        request.input('changeResult', sql.VarChar, req.body.changeResult);
        request.input('userChange', sql.VarChar, req.body.userChange);
        request.input('changeResName', sql.VarChar, req.body.changeResName);
        
        const result = await request.query(updateQuery);

        if (result.rowsAffected[0] === 0) {
            res.status(404).send({ message: 'Record not found' });
        } else {
            res.status(200).send({ message: 'Record updated successfully!' });
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Approve
app.put('/approve', async (req, res) => {
    const id = req.body.id;

    if (!id) {
        return res.status(400).send({ message: 'id is required in request body.' });
    }

    const updateQuery = `
        UPDATE [dbo].[changeform]
        SET 
            [headDepaApprove] = @headDepaApprove
        WHERE id = @id`;

    try {
        const pool = await poolPromise;
        const request = new sql.Request(pool);
        
        request.input('id', sql.Int, id);
        request.input('headDepaApprove', sql.VarChar, req.body.headDepaApprove);
        
        const result = await request.query(updateQuery);

        if (result.rowsAffected[0] === 0) {
            res.status(404).send({ message: 'Record not found' });
        } else {
            res.status(200).send({ message: 'Record updated successfully!' });
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Mail Approve
app.put('/mailapprove', async (req, res) => {
    const id = req.query.id;  // Get 'id' from query string

    if (!id) {
        return res.status(400).send({ message: 'id is required in query string.' });
    }

    const updateQuery = `
        UPDATE [dbo].[changeform]
        SET 
            [ref1Approve] = 'Approve'
        WHERE id = @id`;

    try {
        const pool = await poolPromise;
        const request = new sql.Request(pool);
        
        request.input('id', sql.Int, id);  // Use 'id' from query string

        const result = await request.query(updateQuery);

        if (result.rowsAffected[0] === 0) {
            res.status(404).send({ message: 'Record not found' });
        } else {
            res.status(200).send({ message: 'Record updated successfully!' });
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
});


// Delete
app.delete('/delete', async (req, res) => {
    const id = req.query.id;  // Get the id from the query parameter

    if (!id) {
        return res.status(400).send({ message: 'ID is required in query parameter.' });
    }

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query('DELETE FROM [dbo].[changeform] WHERE id = @id');
        
        if (result.rowsAffected[0] === 0) {
            res.status(404).send({ message: 'Record not found' });
        } else {
            res.status(200).send({ message: 'Record deleted successfully!' });
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
});



// Port
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
