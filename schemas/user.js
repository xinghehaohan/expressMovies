/**
 * Created by su on 17/6/12.
 */
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10

var UserSchema = new  mongoose.Schema({
    name:{
        unique: true,
        type:String
    },
    password:String,
    meta:{
        createAt:{
            type:Date,
            default:Date.now()
        },
        updateAt:{
            type:Date,
            default:Date.now()
        }
    }
});

UserSchema.pre('save',function(next){
    var user = this;
//保存新数据
    if(this.isNew){
        this.meta.createAt = this.meta.updateAt =Date.now();
    }
    else{
//更新数据
        this.meta.updateAt = Date.now();
    }
    //bcrypt  先生成一个随机的盐，在拿密码和盐混合加密拿到加密的密码
    // 第一个参数为计算强度，计算密码所需要的资源和时间，计算强度越大，攻击者所要建立的彩虹表就越大越不容易破解
    bcrypt.genSalt(SALT_WORK_FACTOR,function(err,salt){
        if(err){  console.log(err); return next(err)}
        bcrypt.hash(user.password,salt,function(err,hash){
            if(err) {return next(err);}
            user.password = hash;
            console.log(user);
            console.log("password： " +user.password);
            next();
        })
    })
});


UserSchema.methods = {
    comparePassword : function (password,cb) {
        bcrypt.compare(password,this.password,function (err,isMetch) {
            if(err){
                return cb(err)
            };
            cb(null,isMetch);
        })

    }
};
UserSchema.statics = {
    fetch:function (cb) {
        return this
            .find({})
            .sort('meta.updateAt')
            .exec(cb)
    },
    findById:function (id,cb) {
        return this
            .findOne({_id:id})
            .exec(cb)
    }
};

module.exports =UserSchema;