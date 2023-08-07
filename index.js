const mongoose=require("mongoose");
const bodyParser=require("body-parser")
const express=require("express");
const ChannelModel=require("./models/channel");
const LocalStorage = require("node-localstorage").LocalStorage;
localStorage = new LocalStorage("./scratch");
const cookieparser = require('cookie-parser')
const app=express();
const PORT=3050;

app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.json())
app.use(bodyParser.json())
app.use(cookieparser())

const dbUrl="mongodb+srv://Shahid:idiot@mongo.yv6djp0.mongodb.net/A_Todo?retryWrites=true&w=majority";
const connectionParams={
    useNewUrlParser:true,
    useUnifiedTopology:true
};
mongoose
    .connect(dbUrl,connectionParams)
    .then(()=>{
        console.info("connected to db");
    })
    .catch(()=>{
        console.log("Errror:");
    });

    const userSchema=mongoose.Schema(
        {
            name:String,
            email:String,
            password:String
        }
    )
const User=mongoose.model("User",userSchema)

app.listen(PORT,()=>{
        console.log(`Listening on PORT: ${PORT}`)
    })

     app.get("/", (req,res)=>{
     
        var user= req.cookies.Userstatus;
        
        ChannelModel.find()
        .then(result=>{
            console.log(user)
            res.render("index",{data:result,data1:user});
        })
     })

     app.get("/login",(req,res)=>{
        res.render("login")
     })
     app.get("/logout",(req,res)=>{
        var user = req.cookies.Userstatus;
          localStorage.removeItem(user)
          res.clearCookie("Userstatus");
            res.redirect("/");
    })



     app.post("/login",(req,res)=>
     {
        const email=req.body.email
        const password=req.body.password
        User.findOne({email:req.body.email})
            .then((result)=>{
                if(result){
                    if(password==result.password){
                        const result1=result
                        res.cookie("Userstatus",email)
                        var user = req.cookies.Userstatus;
                        localStorage.setItem(email,JSON.stringify(result));
                        res.redirect('/')
                        
                    }
                    else{
                        res.json("Enter correct password")
                    }
                }
                else{
                    res.render("register")
                }
            })
    })



    app.get("/register",(req,res)=>{
          
        res.render("register");
    })
    app.post("/register",(req,res)=>
    {
        const name=req.body.name
        const email=req.body.email
        const password=req.body.password
        User.findOne({ email:req.body.email})
        .then((result)=>{
        
            if(result){
              res.render("login",{data:result})
            }
            else{
                  const user=new User()
                  
                  user.email=req.body.email;
                  user.password=req.body.password;
                  user.save()
                  res.redirect("/login")
              }
            })
        })

        app.post("/",(req,res)=>{
        var channelModel=new ChannelModel()
        channelModel.todo=req.body.Todo;
        channelModel.save()
        .then((data)=>{
            res.redirect("/");
        })
        .catch((err)=>{
            console.log(err);
        })
    })

    app.get("/delete/:id",(req,res)=>{
        ChannelModel.findByIdAndDelete(req.params.id)
        .then(()=>{
            return res.redirect('/')
        })
        .catch((err)=>{
            return res.status(500).send(err)
        })
    })
    
  

    app.get("/update/:id",(req,res)=>{
        ChannelModel.findById(req.params.id)
        .then((result)=>{
            res.render("update",data=result)
        })
        .catch((err)=>{
            console.log(err)
        })
    })
    
    app.post("/update/todo/:id",(req,res)=>{
        const a=req.body.Todo;
         ChannelModel.findByIdAndUpdate(req.params.id,{todo:a})

        .then(()=>{
            res.redirect("/");
        })
        .catch((err)=>console.log(err));
    
    
    })


    





