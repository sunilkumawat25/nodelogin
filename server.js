const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const port = 4019;

const app = express();

app.use(express.json())
app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static(path.join(__dirname,'public')));

mongoose.connect('mongodb://127.0.0.1:27017/mydb',{
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(()=>{
  console.log('mongo is connected');
}).catch((err)=>{
  console.log("error",err);
})

const dataSchema = new mongoose.Schema({
  firstname: { type: String },
  lastname: { type: String },
  email: { type: String, unique: true },
  phone: { type: String },
  password: { type: String },
});

const Data = mongoose.model('Data', dataSchema);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'signup.html'));
});

app.get('/success', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'success.html'));
});


app.post('/submit', async(req,res)=>{
  const{firstname,lastname,email,phone,password}= req.body;
  try {
    const data= await Data.create({
      firstname,
      lastname,
      email,
      phone,
      password,
    });
    await data.save()
    res.redirect('/success');
  } catch (err) {
    console.error('Error saving data:', err);
    res.status(500).send('Internal Server Error');
  }
})

app.post('/login',(req,res)=>{
  
})
app.listen(port,()=>{
  console.log(`server is running at port ${port}`);
})
