// server.js

const express = require('express');
const bodyParser = require('body-parser');
const { sql, poolPromise } = require('./db');
const cors = require('cors');
const app = express();

// Middlewares
app.use(bodyParser.json());
app.use(cors());

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
            [headDepaDate], [headITName], [headITApprove], [headITEsti], [headITEstiComment], [headITDate], [divisionName],
            [divisionComment], [divisionDate], [refITName1], [refITName2], [refITName3], [refITApprove],
            [refITComment], [actualDate], [finishDate], [changeStatue], [changeResult], [userChange],
            [userChangeDate], [changeResName]
        )
        VALUES(
            @requestDate, @requestName, @requestSurname, @jobRank, @jobGroup, @requestPhone,
            @requestEmail, @useDate, @changeLengh, @changeType, @changeTool,
            @changeToolInfo, @scodeName, @scodeFromVersion, @scodeToVersion, @etc, @changeCoz,
            @researchRel, @researchRef, @changeEff, @manaName, @manaRank, @mana2Name, @mana2Rank,
            @reqFinishDate, @implementPlan, @changeTest, @testInfo, @rollbackPlan, @rollbackInfo,
            @userContact, @headDepaName, 'Unapproved', @headDepaComment,
            @headDepaDate, @headITName, @headITApprove, @headITEsti, @headITEstiComment, @headITDate, @divisionName,
            @divisionComment, @divisionDate, @refITName1, @refITName2, @refITName3, @refITApprove,
            @refITComment, @actualDate, @finishDate, @changeStatue, @changeResult, @userChange,
            @userChangeDate, @changeResName
        )`;

    // List all fields and their types
    const fields = {
        requestDate: sql.SmallDateTime, requestName: sql.NVarChar, requestSurname: sql.NVarChar,
        jobRank: sql.NVarChar, jobGroup: sql.NVarChar, requestPhone: sql.NVarChar,
        requestEmail: sql.NVarChar, useDate: sql.Date, changeLengh: sql.NVarChar,
        changeType: sql.NVarChar, changeTool: sql.NVarChar,
        changeToolInfo: sql.NVarChar, scodeName: sql.NVarChar, scodeFromVersion: sql.NVarChar,
        scodeToVersion: sql.NVarChar, etc: sql.NVarChar, changeCoz: sql.NVarChar,
        researchRel: sql.NVarChar, researchRef: sql.NVarChar, changeEff: sql.NVarChar,
        manaName: sql.NVarChar, manaRank: sql.NVarChar, mana2Name: sql.NVarChar,
        mana2Rank: sql.NVarChar, reqFinishDate: sql.NVarChar, implementPlan: sql.NVarChar,
        changeTest: sql.NVarChar, testInfo: sql.NVarChar, rollbackPlan: sql.NVarChar,
        rollbackInfo: sql.NVarChar, userContact: sql.NVarChar,
        headDepaName: sql.NVarChar, headDepaApprove: sql.NVarChar, headDepaComment: sql.NVarChar,
        headDepaDate: sql.DateTime, headITName: sql.NVarChar, headITApprove: sql.NVarChar, headITEsti: sql.NVarChar,
        headITEstiComment: sql.NVarChar, headITDate: sql.DateTime, divisionName: sql.NVarChar,
        divisionComment: sql.NVarChar, divisionDate: sql.NVarChar, refITName1: sql.NVarChar,
        refITName2: sql.NVarChar, refITName3: sql.NVarChar, refITApprove: sql.NVarChar,
        refITComment: sql.NVarChar, actualDate: sql.DateTime, finishDate: sql.DateTime,
        changeStatue: sql.NVarChar, changeResult: sql.NVarChar, userChange: sql.NVarChar,
        userChangeDate: sql.DateTime, changeResName: sql.NVarChar
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
            [divisionName] = @divisionName,
            [divisionComment] = @divisionComment,
            [divisionDate] = @divisionDate,
            [refITName1] = @refITName1,
            [refITName2] = @refITName2,
            [refITName3] = @refITName3,
            [refITApprove] = @refITApprove,
            [refITComment] = @refITComment,
            [actualDate] = @actualDate,
            [finishDate] = @finishDate,
            [changeStatue] = @changeStatue,
            [changeResult] = @changeResult,
            [userChange] = @userChange,
            [userChangeDate] = @userChangeDate,
            [changeResName] = @changeResName
        WHERE id = @id`;

    try {
        const pool = await poolPromise;
        const request = new sql.Request(pool);
        
        request.input('id', sql.Int, id);
        request.input('requestDate', sql.DateTime, req.body.requestDate);
        request.input('requestName', sql.NVarChar, req.body.requestName);
        request.input('requestSurname', sql.NVarChar, req.body.requestSurname);
        request.input('jobRank', sql.NVarChar, req.body.jobRank);
        request.input('jobGroup', sql.NVarChar, req.body.jobGroup);
        request.input('requestPhone', sql.NVarChar, req.body.requestPhone);
        request.input('requestEmail', sql.NVarChar, req.body.requestEmail);
        request.input('useDate', sql.Date, req.body.useDate);
        request.input('changeLengh', sql.NVarChar, req.body.changeLengh);
        request.input('changeType', sql.NVarChar, req.body.changeType);
        request.input('changeTool', sql.NVarChar, req.body.changeTool);
        request.input('changeToolInfo', sql.NVarChar, req.body.changeToolInfo);
        request.input('scodeName', sql.NVarChar, req.body.scodeName);
        request.input('scodeFromVersion', sql.NVarChar, req.body.scodeFromVersion);
        request.input('scodeToVersion', sql.NVarChar, req.body.scodeToVersion);
        request.input('etc', sql.NVarChar, req.body.etc);
        request.input('changeCoz', sql.NVarChar, req.body.changeCoz);
        request.input('researchRel', sql.NVarChar, req.body.researchRel);
        request.input('researchRef', sql.NVarChar, req.body.researchRef);
        request.input('changeEff', sql.NVarChar, req.body.changeEff);
        request.input('manaName', sql.NVarChar, req.body.manaName);
        request.input('manaRank', sql.NVarChar, req.body.manaRank);
        request.input('mana2Name', sql.NVarChar, req.body.mana2Name);
        request.input('mana2Rank', sql.NVarChar, req.body.mana2Rank);
        request.input('reqFinishDate', sql.Date, req.body.reqFinishDate);
        request.input('implementPlan', sql.NVarChar, req.body.implementPlan);
        request.input('changeTest', sql.NVarChar, req.body.changeTest);
        request.input('testInfo', sql.NVarChar, req.body.testInfo);
        request.input('rollbackPlan', sql.NVarChar, req.body.rollbackPlan);
        request.input('rollbackInfo', sql.NVarChar, req.body.rollbackInfo);
        request.input('userContact', sql.NVarChar, req.body.userContact);
        request.input('headDepaName', sql.NVarChar, req.body.headDepaName);
        request.input('headDepaApprove', sql.NVarChar, req.body.headDepaApprove);
        request.input('headDepaComment', sql.NVarChar, req.body.headDepaComment);
        request.input('headDepaDate', sql.Date, req.body.headDepaDate);
        request.input('headITName', sql.NVarChar, req.body.headITName);
        request.input('headITEsti', sql.NVarChar, req.body.headITEsti);
        request.input('headITEstiComment', sql.NVarChar, req.body.headITEstiComment);
        request.input('headITDate', sql.Date, req.body.headITDate);
        request.input('divisionName', sql.NVarChar, req.body.divisionName);
        request.input('divisionComment', sql.NVarChar, req.body.divisionComment);
        request.input('divisionDate', sql.Date, req.body.divisionDate);
        request.input('refITName1', sql.NVarChar, req.body.refITName1);
        request.input('refITName2', sql.NVarChar, req.body.refITName2);
        request.input('refITName3', sql.NVarChar, req.body.refITName3);
        request.input('refITApprove', sql.NVarChar, req.body.refITApprove);
        request.input('refITComment', sql.NVarChar, req.body.refITComment);
        request.input('actualDate', sql.Date, req.body.actualDate);
        request.input('finishDate', sql.Date, req.body.finishDate);
        request.input('changeStatue', sql.NVarChar, req.body.changeStatue);
        request.input('changeResult', sql.NVarChar, req.body.changeResult);
        request.input('userChange', sql.NVarChar, req.body.userChange);
        request.input('userChangeDate', sql.Date, req.body.userChangeDate);
        request.input('changeResName', sql.NVarChar, req.body.changeResName);
        
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
