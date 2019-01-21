var express=require('express');
var app =express();
var port = 3200;
var path = require('path');
mail = require('nodemailer')
x=mail.createTransport({
  service: 'gmail',
  auth:{
    user: 'YourmailID@gmail.com',
    pass: 'maildIDpassword',
    secure:false,
    port:25,
  }
});
SendOtp = require('sendotp')
sendOtp = new SendOtp('222701AmTYKyih0fVN5b329ce1');
var bodyParser=require('body-parser');
app.use(bodyParser.json());
mongo=require('mongodb').MongoClient
dbase=""
mongo.connect('mongodb://Revanth:revanth99@ds161790.mlab.com:61790/revanth',function(err,database)
{
  if(err)
    throw err
  else
  {
    console.log("connection established")
    dbase=database.db("revanth")
  }
});
//Look for statics first
app.use(express.static(path.join(__dirname, 'public')));
//Return the index for any other GET request
app.get('/*', function (req, res) {
    res.sendFile('registration.html', {root: path.join(__dirname, 'public')});
});
app.post('/maildata',function(req,res)
{
  response={
    email:req.body.email
  };
  dbase.collection("subscribers").insert(response,function(err,res1)
{
  if(err)
  throw err
  else
  res.end("your email is subscribed successfully");
});
x.sendMail(
  {
    from:"YourMaild@gmail.com",
    to:response.email,
    subject:'mail sending demo usind nodejs',
    text:"you have successfully applied for Admission in our college."
  });
});
app.post('/send',function(req, res,next) {
  details=req.body.mobileno
  sendOtp.send(req.body.mobileno,"MEANSTACK",function (err, data, response) {
  console.log(data)
  if(data.type=="success")
  res.send("success")
  else
  res.send("failure") 
});
});
app.post('/verify',function(req, res,next) {
 console.log(req.body.otp)
 sendOtp.verify(details,req.body.otp,function (err, data, response) {
  console.log(data)
  if(data.type=="success")
  res.send("success")
  else
  res.send("failure") 
  
});
});
app.post('/savedata',function(req,res) {
  response =req.body
  console.log(response)
  dbase.collection("userdetails").insert(response,function(err,data,response)
  {
    if(err)
      throw err
    else
    {
      res.setHeader("content-type","text/plain");
      res.end("data inserted successfully");
    }
  });
})
app.get('/getdata',function(req,res){
  dbase.collection("userdetails").find({}).toArray(function(err,results)
  {
    if(err)
      throw err
    else
    {
      res.send(results);
    }
  });
})
app.listen(port,function() {
  console.log("server listening on port " + port);
})
