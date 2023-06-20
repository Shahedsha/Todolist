const mongoose=require("mongoose");
const bodyParser=require("body-parser")
const express=require("express");
const ChannelModel=require("./models/channel");

const app=express();
const PORT=305;

app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())

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
        console.log("Errror:",e);
    });



app.listen(PORT,()=>{
        console.log(`Listening on PORT: ${PORT}`)
    })

     app.get("/",(req,res)=>{
        ChannelModel.find()
        .then(result=>{
            res.render("index",{data:result});
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

    app.delete("/:id",(req,res)=>{
        ChannelModel.findByIdAndDelete(req.params.id)
        .then((data)=>{
            return res.status(200).send(data)
        })
        .catch((err)=>{
            return res.status(500).send(err)
        })
    })
    
    // app.get("/insert",(req,res)=>{
    //     var channelModel=new ChannelModel()
    //     channelModel.name="SHAHID2"
    //     channelModel.type="USER"
    //     channelModel.save()
    //     .then((data)=>{
    //         res.status(200).send({"msg":"Inserted to db"})
    //     })
    //     .catch((err)=>{
    //         console.log(err)
    //     })
    // })

    // app.get("/read",(req,res)=>{
    //     ChannelModel.find()
    //     .then((data)=>{
    //         return res.status(200).send(data)
    //     })
    //     .catch((err)=>{
    //         return res.status(500).send(err)
    //     })
        
    // })

    // app.get("/update",(req,res)=>{
    //     ChannelModel.findByIdAndUpdate(req.query.id,{type:req.query.type})
    //     .then((data)=>{
    //         return res.status(200).send(data)
    //     })
    //     .catch((err)=>{
    //         return res.status(500).send(err)
    //     })
        
    // })

    // app.get("/delete",(req,res)=>{
    //     ChannelModel.findOneAndRemove({type:req.query.type})
    //     .then((data)=>{
    //         return res.status(200).send(data)
    //     })
    //     .catch((err)=>{
    //         return res.status(500).send(err)
    //     })
    // })