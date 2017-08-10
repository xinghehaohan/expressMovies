var express = require('express');
var mongoose = require('mongoose');
var Movie = require('../models/movie');
var User = require('../models/user');
var underscore = require('underscore');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
// var mongoStore = require('connect-mongo')(express);
var db = mongoose.connect('mongodb://localhost:27017/');
db.connection.on('open', function () {
    console.log('——数据库连接成功！——');
});
mongoose.set('debug',true)

var app = express();
app.use(session({
    secret: 'su',
    name: 'cookie_name',
    proxy: true,
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({
            url: 'mongodb://localhost:27017/',
            collection: 'sessions'
    })
}));

app.use(function (req,res,next) {
    var user = req.cookies.userName;
    console.log('用户信息'+user)
    if(user){
        res.locals.user = user
    };
    next();
});
var router = express.Router();

/* GET home page. */
router.post('/user/signup',function (req,res,next) {
    console.log("********注册账户 post 请求********");
    var query = req.body;
    User.findOne({name:query.name},function (err,user) {
        if(err){
            console.log(err)
        }
       if(user){
           res.redirect('/user/list')
       } else {
           user = new User(query);
           user.save(function(err, user) {
               if (err) {
                   console.log(err)
               }
               res.redirect('/')
           });
       }
    });
});

router.post('/user/signin',function (req,res,next) {
    console.log('用户登陆')
    var user =  req.body;
    var name = user.name;
    var password = user.password;
    User.findOne({name:name},function (err,user) {
        if(err){
            console.log(err)
        }
        if(!user){
            res.redirect('/')
        }else {
            user.comparePassword(password,function (err,isMatch) {
                if(err){
                    console.log(err)
                }
                if(isMatch){
                    console.log('账户密码正确')
                    res.cookie("userName",user.name,{maxAge:60000000,httpOnly:false});
                    res.redirect('/')
                }else {
                    res.send('密码错误，请重新输入或注册账号！');
                }
            })
        }
    })
});

///logout 用户登出
router.get('/logout',function (req,res,next) {
    res.clearCookie('userName');
    res.redirect('/')
});
//删除用户
router.post('/admin/deleteUser',function (req,res,next) {
    var id = req.body.id;
    if(id){
        User.remove({_id:id},function (err,users) {
            if(err){
                console.log(err)
            }
            res.json({
                success:1,
                users:users
            })
        })
    }

});
router.get('/user/list',function (req,res,next) {
    console.log("********用户列表页 get 请求********");
    User.fetch(function (err,users) {
        if (err){
            console.log(err)
        }
        res.render('userList',{
            title:'用户列表页',
            users:users
        })
    });
});
router.get('/', function(req, res, next) {
    console.log("********后台 电影主页和列表页  数据处理路由页********");

    Movie.fetch(function (err, movies) {
        //通过定义的fetch函数获取 数据库全部的 电影数据
        if (err) {
            console.log(err)
        }
        res.render('index', {
            title:'详情页',
            movies:movies,
        });
    });
    // 静态文件数据
  // res.render('index', {
  //   title:'详情页',
  //   movies:[{
  //     title:'危城',
  //     flash:'http://v.youku.com/v_show/id_XMTc2MTAyMzgyOA==.html?spm=a2hmv.20009921.yk-slide-86993.5~5!6~5~5!2~A&from=y1.3-movie-grid-1095-9921.86994-86993.6-1',
  //     summary:'《危城》是由博纳影业、寰宇娱乐出品的动作巨制，由陈木胜导演、洪金宝担任动作导演，刘青云、古天乐、彭于晏领衔主演，吴京特别演出。 　　时值国家内战、军阀割据的乱世时代，军阀少帅曹少璘（古天乐 饰）因杀害三条人命，被普城保卫团团长杨克难（刘青云 饰）绳之以法。可曹家财雄势大，以强权震慑居民，曹家上校张亦（吴京 饰）得悉事件后，赶来普城取人，在城中遇上多年不见师弟马锋（彭于晏 饰），马锋是位武功高强的浪人，路见不平欲拔刀相助，可是却面临正义与兄弟情之抉择。',
  //     doctor:'彭于晏',
  //     language:'中文',
  //     poster:'http://r1.ykimg.com/0516000057D8FD3A67BC3C057603E948',
  //     _id:'1',
  //     country:'中国',
  //     year:'2017-07－28'
  //   }]
  // });
});
router.get('/movie/:id',function (req,res,next) {
    console.log('－－－－－－movie详情页数据请求————————')
  var id = req.params.id;
  Movie.findById(id,function (err,movie) {
    if (err){
      console.log(err)
    }
    console.log(movie)
    res.render('detail',{
      title:movie.title,
      movie:movie,
    })
  });
    // 静态文件数据
  // res.render('detail',{
  //   title:'详情页',
  //   movie:{
  //     title:'危城',
  //     flash:'http://v.youku.com/v_show/id_XMTc2MTAyMzgyOA==.html?spm=a2hmv.20009921.yk-slide-86993.5~5!6~5~5!2~A&from=y1.3-movie-grid-1095-9921.86994-86993.6-1',
  //     summary:'《危城》是由博纳影业、寰宇娱乐出品的动作巨制，由陈木胜导演、洪金宝担任动作导演，刘青云、古天乐、彭于晏领衔主演，吴京特别演出。 　　时值国家内战、军阀割据的乱世时代，军阀少帅曹少璘（古天乐 饰）因杀害三条人命，被普城保卫团团长杨克难（刘青云 饰）绳之以法。可曹家财雄势大，以强权震慑居民，曹家上校张亦（吴京 饰）得悉事件后，赶来普城取人，在城中遇上多年不见师弟马锋（彭于晏 饰），马锋是位武功高强的浪人，路见不平欲拔刀相助，可是却面临正义与兄弟情之抉择。',
  //     docter:'彭于晏',
  //     language:'中文',
  //     postor:'http://r1.ykimg.com/0516000057D8FD3A67BC3C057603E948',
  //     _id:'1',
  //     country:'中国',
  //     year:'2017-07－28'
  //   }
  // })
});
router.get('/admin/movie',function (req,res,next) {
    console.log('－－－－－－movie后台录入页————————')
  res.render('admin',{
    title:'后台录入页',
  movie:{
    title:'',
    doctor:'',
    country:'',
    language:'',
    year:'',
    poster:'',
    flash:'',
    summary:''
  }})

});

//更新电影信息表单
router.get('/admin/update/:id',function (req,res) {
    var id = req.params.id;
  if(id){
    Movie.findById(id,function (err,movie) {
      res.render('admin',{
        title:'后台录入更新页',
        movie:movie
      })
    })
  }
});
//提交电影信息表单
router.post('/admin/movie/new',function (req,res,next) {
    console.log("********后台录入数据库 post 请求********");
    var id = req.body._id;
    var movieObj = req.body;
    console.log(movieObj)

    var _movie;

    if (id !== 'undefined') {
        Movie.findById(id, function (err, movie) {
            if (err) {
                console.log(err)
            }
            _movie = underscore.extend(movie, movieObj)
            _movie.save(function (err, movie) {
                if (err) {
                    console.log(err)
                }
                res.redirect('/')
            })
        })
    }
    else {
        _movie = new Movie({
            doctor: movieObj.doctor,
            title: movieObj.title,
            language: movieObj.language,
            country: movieObj.country,
            summary: movieObj.summary,
            flash: movieObj.flash,
            year: movieObj.year,
            poster: movieObj.poster
        });
        _movie.save(function (err, movie) {
            if (err) {
                console.log(err)
            }
            res.redirect('/');
        })
    }
});

router.get('/admin/list',function (req,res,next) {
    console.log("********列表页 get 请求********");
    Movie.fetch(function (err,movies) {
    if (err){
      console.log(err)
    }
    res.render('list',{
      title:'列表页',
      movies:movies
        /*
      movies:[{
        title:'危城',
        flash:'http://v.youku.com/v_show/id_XMTc2MTAyMzgyOA==.html?spm=a2hmv.20009921.yk-slide-86993.5~5!6~5~5!2~A&from=y1.3-movie-grid-1095-9921.86994-86993.6-1',
        summary:'《危城》是由博纳影业、寰宇娱乐出品的动作巨制，由陈木胜导演、洪金宝担任动作导演，刘青云、古天乐、彭于晏领衔主演，吴京特别演出。 　　时值国家内战、军阀割据的乱世时代，军阀少帅曹少璘（古天乐 饰）因杀害三条人命，被普城保卫团团长杨克难（刘青云 饰）绳之以法。可曹家财雄势大，以强权震慑居民，曹家上校张亦（吴京 饰）得悉事件后，赶来普城取人，在城中遇上多年不见师弟马锋（彭于晏 饰），马锋是位武功高强的浪人，路见不平欲拔刀相助，可是却面临正义与兄弟情之抉择。',
        doctor:'彭于晏',
        language:'中文',
        poster:'http://r1.ykimg.com/0516000057D8FD3A67BC3C057603E948',
        _id:'1',
        country:'中国',
        year:'2017-07－28'
      }]
         */
    })
  });
});

//删除列表数据
router.post('/admin/deleteList',function (req,res,err) {
    var id = req.body.id;
    if(id){
        Movie.remove({_id:id},function (err,movie) {
            if(err){
                console.log(err)
            }else {
                res.json({
                    success:1,
                    movie:movie
                })
            }
        })
    }
});
module.exports = router;
