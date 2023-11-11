const express = require('express');
const path = require('path');
const bcrypt=require('bcrypt')
const User = require('./models/user');

const app = express();
const port = 5000;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());//TO PARSE THE BODY ALSO INSTED OF THIS WE CAN USE BODYPARSER MIDDLE WARE

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, './views'));


app.get('/', (req, res) => {
  res.render('login', { title: 'login' });
});

app.get('/signup', (req, res) => {
  res.render('signup');
});

app.post('/signup', async (req, res) => {
  try {
    const { userName,userMail, userPassword } = req.body; //SHOULD MATCH WITH THE FORM NAME
    console.log(userName,userMail,userPassword);

    //check if usermail already exist
    const existingUser=await User.findOne({mail:userMail})
    if(existingUser){
      console.error("email already exists ",userMail);
      return res.status(400).render('signup',{replace: 'CHOOSE ANOTHER MAIL ITS ALREADY IN USE'})

    }
    const hashedPassword=await bcrypt.hash(userPassword,10)
    console.log(hashedPassword);
    const user = new User({ username:userName,mail:userMail, password:hashedPassword}); //created an instance
    await user.save();
    console.log('User signed up:', user);
    res.render('login')
  } catch (error) {
    console.error('Error signing up:', error);
    res.status(500).send('Internal Server Error From post server methord');
  }
});



app.post('/login',async (req,res) =>{
  try{
    // console.log(req.body.userMail);
    const {userMail,userPassword}=req.body
    console.log(userMail,"\n",userPassword);
    const userDataBase=await User.findOne({mail:userMail}) //IT WILL RETURN EITHER OBJECT IF NOT FOUND IT WILL RETURN NULL
    if(userDataBase === null){
    return res.render('login',{replaceMail:'User Does Not Exist You Should SignUp'})
    }
    console.log("mail checked and entered");
    const passwordMatch=await bcrypt.compare(userPassword,userDataBase.password) //IF MATCHES IT WILL RETURN TRUE IF ITS NOT IT GIVE FALSE
    if(passwordMatch === false){
      return res.render('login',{replacePassword:"Password Wrong"})
    }

    console.log("entered correct user");
    res.render('DashBoard')


  }catch(error){

  }
})




app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
