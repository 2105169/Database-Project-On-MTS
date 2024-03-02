
const express = require('express');
const morgan = require('morgan');
const cors = require("cors");
const router = require('express-promise-router')();
var nodemailer = require('nodemailer')
const oracledb = require('oracledb');

const config = {
    user: "hr",
    password: "hr",
    connectString: "localhost/orcl"
}

const app = require('express')();

app.use(express.json());
app.use(morgan("dev"));
app.use(router);
app.use(cors());

const PORT = 4000;

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    requireTLS: true,
    auth:{
        user: 'omlan2793@gmail.com',
        pass: "jxgi eycx tnlt vkfv"
    }
});

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`)
});




app.post('/login', async(req, res) => {
    const con = await oracledb.getConnection(config);
    
    console.log("sign uppppp")
    console.log(req.body.name)

    const username = req.body.name;
    const email    = req.body.email;
    const password = req.body.password;
    const code = req.body.code;
    const account_type = req.body.account_type;
    

 

    const command = "INSERT INTO PAYMENT VALUES('" + username + "','" + email + "','" + password + "','" + 0 + "', '" + account_type + "')";

    //const command = "select * from user1";

    await con.execute(command)
    con.commit();

 

    res.send("ok")

 
})

app.post('/login-search', async (req, res) => {
    const con = await oracledb.getConnection(config);

    const email = req.body.email;
    const password = req.body.password;

    const command = "SELECT PASSWORD FROM USER_INFO WHERE EMAIL ='" + email + "'";
    
    const result = await con.execute(command);
   
   
    
    let response;

    if (result.rows.length > 0) {
        if (result.rows[0][0] === password) {
            response = 1;
        } else {
            response= 0;
        }
    } else {
        response = 0;
    }

    console.log(response)

    

    res.json(response);
});



app.post('/verify', async (req, res) => {
    console.log("hi verify");
    console.log(req.body);
    console.log(req.body.email);
    const email = req.body.email;
    console.log(email);

    const con = await oracledb.getConnection(config);

    const command = `SELECT CODE FROM CODE WHERE EMAIL='${email}'`;

    const result = await con.execute(command);

    console.log(result.rows); // Check the structure of the result

    let isCodeValid = false;

    if (result.rows.length > 0) {
        const storedCode = result.rows[0][0]; // Access the code from the first row
        if (req.body.code === storedCode) {
            isCodeValid = true;
        }
        console.log(storedCode);
    }

    console.log(isCodeValid);
    res.send(isCodeValid);
});


app.post('/create_agent', async(req, res) => {

    const con = await oracledb.getConnection(config);

    const username = req.body.name;
    const email    = req.body.email;
    const password = req.body.password;
    const code = req.body.code;
    let balance = 0;
    let balanceNumber = Number(balance);


    const command2 = `INSERT INTO AGENT_INFO VALUES('${username}','${email}', '${password}', '${balanceNumber}')`;
    
    //const command = "select * from user1";

    await con.execute(command2)
    con.commit();
    res.send({})
})

app.post('/remove-code', async(req, res) => {
    const con = await oracledb.getConnection(config);
    
    console.log("sign uppppp")
    console.log(req.body.name)

    const username = req.body.name;
    const email    = req.body.email;
    const password = req.body.password;
    const code = req.body.code;
    

 
 
    const command1 = "DELETE FROM CODE"

    await con.execute(command1)
    con.commit();

console.log(email)
 

    res.send("ok")
})

app.post('/update', async(req, res) => {
    const con = await oracledb.getConnection(config);
    
    console.log("sign uppppp")
    console.log(req.body.email)

    const email    = req.body.email;
    const password = req.body.password;
    

 
 
    const command = "UPDATE USER_INFO SET PASSWORD = '"+password+"' WHERE EMAIL = '"+email+"'";

    await con.execute(command)
    con.commit();


 

    res.send("ok")

 
})

app.post('/pass-check', async(req, res) => {
    console.log("heeeeeelllllloo")
    console.log(req.body)
    console.log(req.body.email)
    console.log(req.body.curr_pass)

    const con = await oracledb.getConnection(config);

    const command = `SELECT PASSWORD FROM USER_INFO WHERE EMAIL='${req.body.email}'`
    const pass_row = await con.execute(command);

    let result;

    console.log(pass_row.rows[0][0])

    
    if (req.body.curr_pass === pass_row.rows[0][0]) {
        result = "true"
    } else {
        result = 'false'
    }

    console.log(result);

    res.send(result)
})

app.post('/delete', async(req, res) => {

    const con = await oracledb.getConnection(config);

    const command = `DELETE FROM USER_INFO WHERE EMAIL='${req.body.email}'`
    await con.execute(command);

    con.commit();

    res.send("ok")
})



app.post('/balance', async (req, res) => {
    try {
        const con = await oracledb.getConnection(config);
        
        
        const command = `
            BEGIN
                SELECT BALANCE INTO :balance FROM USER_INFO WHERE EMAIL = :email;
            END;`;
        
        const binds = {
            email: req.body.email,
            balance: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER } 
        };
        
       
        const result = await con.execute(command, binds);
        
        
        if (result.outBinds.balance !== null) {
            const balance = result.outBinds.balance;
            res.json({ balance });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error('Error fetching balance:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.post('/add', async (req, res) => {
    const con = await oracledb.getConnection(config);

    const email = req.body.email;
    const password = req.body.password;
    const amount = req.body.amount;
    const youremail = req.body.youremail;
    const reference = req.body.reference;
    console.log(email);
    console.log(password);
    console.log(amount);
    console.log(youremail);
    console.log(reference);


    const result = await con.execute(
        `BEGIN :result := validity_email(:youremail, :password); END;`,
        {
            result: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
            youremail: youremail,
            password: password
        }
    );

    let num = 0;

    console.log(result.outBinds.result);
    if (result.outBinds.result === 1) {
        const resultUpdate = await con.execute(
            `UPDATE USER_INFO SET BALANCE = BALANCE + :amount WHERE EMAIL = :email`,
            {
                amount: amount,
                email: email
            }
        );
        console.log('dulal')
        const resultUpdate2 = await con.execute(
            `UPDATE USER_INFO SET BALANCE = BALANCE - :amount WHERE EMAIL = :youremail`,
            {
                amount: amount,
                youremail: youremail
            }
        );

        console.log(reference);
        const history = `INSERT INTO HISTORY VALUES('${youremail}', '${email}', '${amount}', '${reference}')`;
        const history2 = await con.execute(history);
        console.log("OK");
        await con.commit();
        num = 1;
        
    }
    
    await con.close();
    console.log(num);

    res.status(200).json({ num: num });
});




app.post('/cashout', async (req, res) => {
    const con = await oracledb.getConnection(config);

    const agentemail = req.body.agentemail;
    const password = req.body.password;
    const amount = req.body.amount;
    const youremail = req.body.youremail;
    const reference = req.body.reference;
    console.log(agentemail);
    console.log(password);
    console.log(amount);
    console.log(youremail);
    console.log(reference);

    console.log(req.body);

    const agent_result = await con.execute(
        `BEGIN :agent_result := validity_email_agent(:agentemail); END;`,
        {
            agent_result: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
           agentemail: agentemail,
        }
    );

    console.log(agent_result);


    const your_result = await con.execute(
        `BEGIN :your_result := validity(:youremail, :password); END;`,
        {
            your_result: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
            youremail: youremail,
            password: password
        }
    );

    let num = 0;

    console.log(agent_result.outBinds.agent_result);
    console.log(your_result.outBinds.your_result);
    if (agent_result.outBinds.agent_result === 1) {
        if(your_result.outBinds.your_result === 1){
        const resultUpdate = await con.execute(
            `UPDATE AGENT_INFO SET BALANCE = BALANCE + :amount WHERE EMAIL = :agentemail`,
            {
                amount: amount,
                agentemail: agentemail
            }
        );
        console.log('agent')
        const resultUpdate2 = await con.execute(
            `UPDATE USER_INFO SET BALANCE = BALANCE - :amount WHERE EMAIL = :youremail`,
            {
                amount: amount,
                youremail: youremail
            }
        );
        
        console.log('yourmail')
        console.log(reference);
        const history = `INSERT INTO HISTORY VALUES('${youremail}', '${agentemail}', '${amount}', '${reference}')`;
        const history2 = await con.execute(history);
        console.log("OK");
        await con.commit();
        num = 1;
        }
    }
    
    await con.close();
    console.log(num);

    res.status(200).json({ num: num });
});




app.post('/add_agent', async (req, res) => {
    const con = await oracledb.getConnection(config);

    const email = req.body.email;
    const password = req.body.password;
    const amount = req.body.amount;
    const youremail = req.body.youremail;
    const reference = req.body.reference;
    console.log(email);
    console.log(password);
    console.log(amount);
    console.log(youremail);
    console.log(reference);


    const result = await con.execute(
        `BEGIN :result := validity_email_agent(:youremail); END;`,
        {
            result: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
            youremail: youremail,
        }
    );

    const result2 = await con.execute(
        `BEGIN :result2 := validity_email_agent(:email); END;`,
        {
            result2: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
            email: email,
        }
    );

    let num = 0;

    console.log(result.outBinds.result);
    console.log(result2.outBinds.result2);
    if (result.outBinds.result === 1) {
        if(result2.outBinds.result2 === 1){
        const resultUpdate = await con.execute(
            `UPDATE AGENT_INFO SET BALANCE = BALANCE + :amount WHERE EMAIL = :email`,
            {
                amount: amount,
                email: email
            }
        );
        console.log('dulal')
        const resultUpdate2 = await con.execute(
            `UPDATE AGENT_INFO SET BALANCE = BALANCE - :amount WHERE EMAIL = :youremail`,
            {
                amount: amount,
                youremail: youremail
            }
        );

        console.log(reference);
        const history = `INSERT INTO HISTORY VALUES('${youremail}', '${email}', '${amount}', '${reference}')`;
        const history2 = await con.execute(history);
        console.log("OK");
        await con.commit();
        num = 1;
        }
    }
    
    await con.close();
    console.log(num);

    res.status(200).json({ num: num });
});




app.post('/cashout_agent', async (req, res) => {
    const con = await oracledb.getConnection(config);

    const agentemail = req.body.agentemail;
    const password = req.body.password;
    const amount = req.body.amount;
    const youremail = req.body.youremail;
    const reference = req.body.reference;
    console.log(agentemail);
    console.log(password);
    console.log(amount);
    console.log(youremail);
    console.log(reference);

    console.log(req.body);

    const agent_result = await con.execute(
        `BEGIN :agent_result := validity_email_agent(:agentemail); END;`,
        {
            agent_result: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
           agentemail: agentemail,
        }
    );

    console.log(agent_result);


    const your_result = await con.execute(
        `BEGIN :your_result := validity_email_agent(:youremail); END;`,
        {
            your_result: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
            youremail: youremail
        }
    );

    let num = 0;

    console.log(agent_result.outBinds.agent_result);
    console.log(your_result.outBinds.your_result);
    if (agent_result.outBinds.agent_result === 1) {
        if(your_result.outBinds.your_result === 1){
        const resultUpdate = await con.execute(
            `UPDATE AGENT_INFO SET BALANCE = BALANCE + :amount WHERE EMAIL = :agentemail`,
            {
                amount: amount,
                agentemail: agentemail
            }
        );
        console.log('agent')
        const resultUpdate2 = await con.execute(
            `UPDATE AGENT_INFO SET BALANCE = BALANCE - :amount WHERE EMAIL = :youremail`,
            {
                amount: amount,
                youremail: youremail
            }
        );
        
        console.log(youremail)
        console.log(reference);
        const history = `INSERT INTO HISTORY VALUES('${youremail}', '${agentemail}', '${amount}', '${reference}')`;
        const history2 = await con.execute(history);
        console.log("OK");
        await con.commit();
        num = 1;
        }
    }
    
    await con.close();
    console.log(num);

    res.status(200).json({ num: num });
});



app.post('/cashin', async (req, res) => {
    const con = await oracledb.getConnection(config);

    const recieveremail = req.body.recieveremail;
    const password = req.body.password;
    const amount = req.body.amount;
    const youremail = req.body.youremail;
    const reference = req.body.reference;
    console.log(recieveremail);
    console.log(password);
    console.log(amount);
    console.log(youremail);
    console.log(reference);

    console.log(req.body);

    const reciever_result = await con.execute(
        `BEGIN :reciever_result := validity_user(:recieveremail); END;`,
        {
            reciever_result: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
            recieveremail: recieveremail
        }
    );

    console.log(reciever_result);


    const your_result = await con.execute(
        `BEGIN :your_result := validity_email_agent(:youremail); END;`,
        {
            your_result: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
            youremail: youremail
        }
    );

    let num = 0;

    console.log(reciever_result.outBinds.reciever_result);
    console.log(your_result.outBinds.your_result);

    console.log(your_result.outBinds.your_result);
    console.log(your_result.outBinds.your_result);

    if (reciever_result.outBinds.reciever_result === 1) {
        if(your_result.outBinds.your_result === 1){
        const resultUpdate = await con.execute(
            `UPDATE USER_INFO SET BALANCE = BALANCE + :amount WHERE EMAIL = :recieveremail`,
            {
                amount: amount,
                recieveremail: recieveremail
            }
        );
        console.log('agent')
        const resultUpdate2 = await con.execute(
            `UPDATE AGENT_INFO SET BALANCE = BALANCE - :amount WHERE EMAIL = :youremail`,
            {
                amount: amount,
                youremail: youremail
            }
        );
        
        console.log('yourmail')
        console.log(reference);
        const history = `INSERT INTO HISTORY VALUES('${youremail}', '${recieveremail}', '${amount}', '${reference}')`;
        const history2 = await con.execute(history);
        console.log("OK");
        await con.commit();
        num = 1;
        }
    }
    
    await con.close();
    console.log(num);

    res.status(200).json({ num: num });
});



app.post('/signup_payment', async(req, res) => {

    const con = await oracledb.getConnection(config);

    const username = req.body.name;
    const email    = req.body.email;
    const password = req.body.password;
    const code = req.body.code;
    const account = req.body.account_type;


    const mailOptions = {
        from: 'omlan2793@gmail.com', // your email
        to: email,
        subject: 'Welcome to Our Platform',
        text: `Dear ${username}, Welcome to our platform. Your verification code is ${code}.`
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
            res.status(500).send('Email sending failed');
        } else {
            console.log('Email sent: ' + info.response);
            res.status(200).send('Email sent successfully');
        }
    });

    console.log(req.body);

    console.log(username);
    console.log(email);
    console.log(password);
    console.log(code);
    console.log(account);
  

    const command = `INSERT INTO CODE VALUES('${code}', '${email}')`;
    
    await con.execute(command);

    con.commit();
    res.send({})
})



app.post('/usersendmail', async(req, res) => {

    const con = await oracledb.getConnection(config);

    const username = req.body.username;
    const useremail    = req.body.useremail;
    const userpassword = req.body.userpassword;
    const code = req.body.code;


    const mailOptions = {
        from: 'omlan2793@gmail.com',
        to: useremail,
        subject: 'Welcome to Our Platform',
        text: `Dear ${username}, Welcome to our platform. Your verification code is ${code}.`
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
            res.status(500).send('Email sending failed');
        } else {
            console.log('Email sent: ' + info.response);
            res.status(200).send('Email sent successfully');
        }
    });

    console.log(req.body);


    const command = `INSERT INTO CODE VALUES('${code}', '${useremail}')`;
    
    await con.execute(command);

    con.commit();
    res.send({})
})


app.post('/userverify', async (req, res) => {
    console.log("user verify");
    console.log(req.body);

    const useremail = req.body.useremail;
    console.log(useremail);

    const con = await oracledb.getConnection(config);

    const command = `SELECT CODE FROM CODE WHERE EMAIL='${useremail}'`;

    const result = await con.execute(command);

    console.log(result.rows); 

    let isCodeValid = false;

    if (result.rows.length > 0) {
        const storedCode = result.rows[0][0]; // Access the code from the first row
        if (req.body.code === storedCode) {
            isCodeValid = true;
        }
        console.log(storedCode);
    }

    console.log(isCodeValid);
    res.send(isCodeValid);
});


app.post('/userremovecode', async(req, res) => {
    const con = await oracledb.getConnection(config);
    
    console.log("remove code");

    const username = req.body.username;
    const email    = req.body.useremail;
    const password = req.body.userpassword;
  
    console.log(req.body);
    

 
 
    const command1 = `DELETE CODE`;

    await con.execute(command1)
    con.commit(); 

    res.send("ok")
})



app.post('/userinsert', async(req, res) => {
    const con = await oracledb.getConnection(config);
    
    console.log("insert")


    const username = req.body.username;
    const useremail    = req.body.useremail;
    const userpassword = req.body.userpassword;
    console.log(req.body);   

 

    const command = "INSERT INTO USER_INFO VALUES('" + username + "','" + useremail + "','" + userpassword + "','" + 0 + "')";

    await con.execute(command)
    con.commit();

    res.send("ok")
})


app.post('/balance_check_user', async (req, res) => {
    const con = await oracledb.getConnection(config);
    
    console.log("balance check");

    const useremail = req.body.useremail;

    console.log(req.body);   

    const command = `SELECT BALANCE FROM USER_INFO WHERE EMAIL = '${useremail}'`;

    const result = await con.execute(command);

    console.log(result.rows); 

    let num = 0;
    let storedCode; // Declaring storedCode outside the if block

    if (result.rows.length > 0) {
        storedCode = result.rows[0][0]; // Access the code from the first row
        console.log(storedCode);
    }

    await con.close();
    num = storedCode;
    console.log(num);

    res.status(200).json({ num: num });
});
