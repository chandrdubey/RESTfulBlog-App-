var express= require("express"),
app=express(),
bodyParser=require("body-parser"),
expressSanitizer=require("express-sanitizer"),
mongoose=require("mongoose");
const methodOverride=require("method-override");

mongoose.connect("mongodb://localhost:27017/restful_blogs_app", { useNewUrlParser: true,useUnifiedTopology: true  });
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended : true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));


var blogSchema= new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created:{type: Date,default: Date.now}
});
var Blog=mongoose.model("Blog",blogSchema);

 app.get("/",function(req,res){
    res.redirect("/blogs");
});  
//Index routes
app.get("/blogs",function(req,res){
    Blog.find({},function(err,blogs){
        if(err) {
            console.log("error!");
        }else{
            res.render("index",{blogs: blogs});
        }
    });
});
//New routes
app.get("/blogs/new",function(req,res){
    res.render("new");
});
//Create routes
app.post("/blogs",function(req,res){
    req.body.blog.body= req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog , function(err, newblogs){
        if(err){
            console.log("error!");
        }else{
    // then redirect tthe index        
            res.redirect("/blogs");
        }
    });
});
//Show routes
app.get("/blogs/:id",function(req,res){
    Blog.findById(req.params.id, function(err,found){
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("show",{blog: found});
        }
    });
});
//Edit routes
app.get("/blogs/:id/edit",function(req,res){
    Blog.findById(req.params.id, function(err, found){
        if(err){
            res.redirect("/blogs");
        } else {
            res.render("edit", {blog: found});
        }
    });  
});
//Update routes
app.put("/blogs/:id",function(req,res){
    req.body.blog.body= req.sanitize(req.body.blog.body);
     Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updateblog){
         if(err){
             res.redirect("/blogs");
         }else{
             res.redirect("/blogs/"+req.params.id);
         }
     });
});
//Delete routes
app.delete("/blogs/:id",function(req,res){
    //Destroy Blogs
    Blog.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs");
        }
    });
});
app.listen(3000,function(){
    console.log("running");
});