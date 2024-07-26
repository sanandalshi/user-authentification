let express=require('express');
let app=express();
let p=require('path');
let db=require('./util/database');
let flash=require('connect-flash');
let session=require('express-session');
let bp=require('body-parser');
let bcrypt=require('bcryptjs');
app.use(bp.urlencoded({extended:false}));
app.use(session({secret:'this is a secret',resave:false,saveUninitialized:false}));
app.set('view engine','ejs');
app.use(flash());

app.get('/',(req,res)=>{
    let logged=req.session.loggedin;
    let message=req.flash('error');
   res.render('index',{logged,message});
})

// app.post('/login',(req,res)=>{
//     res.sendFile(p.join(__dirname,'login.html'));
// });

app.post('/auth',(req,res)=>{
    let email=req.body.email;
    let pass=req.body.password;
    db.execute('select * from user ').then(([rows,feilds])=>{
        let ans=false;
    rows.forEach(row=>{
        if(row.email==email&&row.password==pass){
            req.session.loggedin=true;
            res.sendFile(p.join(__dirname,'thanks.html'));
            ans=true;
        }
    })
    if(ans==false){
        res.sendFile(p.join(__dirname,'please.html'));
    }
    
    });
      
});


app.get('/signin',(req,res)=>{
    res.render('signin',{message:req.flash('error')});
})
app.post('/sauth',async (req,res)=>{
    let email=req.body.email;
    let pass=req.body.password;
    let cpass=req.body.cpassword;
    if(pass!=cpass){
        res.send('<h1>THE PASSWORDS DOES NOT MATCHES</h1>');
    }
    else{
    
    db.execute('select*from user2').then(([row,feilds])=>{
        let ans=false;
        row.forEach(rows=>{
           
    if(rows.email==email&&rows.password==pass){
        ans=true;
      req.flash('error','you are already a user');
      res.redirect('/signin');
    }
     });
    if(ans==false){
        db.execute('insert into user2 values(?,?)',[email,pass]).then(result=>{
            res.send('<h1>CONGRANTS YOU ARE ALSO AN USER</h1>');
        })
    }
    
    
    })
    }




})




app.listen(8080);
