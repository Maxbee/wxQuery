

const Wechat = require('wechat4u');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const CronJob = require('cron').CronJob;



let bot

try {
    bot = new Wechat(require('./sync-data.json'));
} catch (e) {
    bot = new Wechat();
}

if (bot.PROP.uin) {
    bot.restart();
} else {
    bot.start();
}

bot.on('login', () => {
    console.log('登录成功');
  
    bot.getContact().then(res=>{
        var members = res.MemberList
        let male = 0,female = 0,wxOffical = 0 ,contactNum = 0
        members.forEach((obj,idx)=>{
          
            // console.log(obj.UserName)
            if(obj.Sex==1){
                male += 1
                contactNum ++
            }else if(obj.Sex==2){
                female += 1
                contactNum ++
            }else{
                wxOffical += 1
            }
            var HeadImgUrl = obj.HeadImgUrl
            bot.getHeadImg(HeadImgUrl).then(res => {
                //保存好友头像
               //fs.writeFileSync(`./tx2/${idx}.jpg`, res.data)
           }).catch(err => {
               console.log(err)
           })
        })
   
        let percentMale = ((male/contactNum)*100).toFixed(2);
        let percentFemale = ((female/contactNum)*100).toFixed(2);
       console.log(`公众号数:${wxOffical},联系人总数为:${contactNum},男性为：${male},女性为${female},男性比例：${percentMale}%,女性比例：${percentFemale}%`)
        
    })
   
});



bot.on('uuid', uuid => {
    qrcode.generate('https://login.weixin.qq.com/l/' + uuid, {
      small: true
    })
   
    console.log('二维码链接：', 'https://login.weixin.qq.com/qrcode/' + uuid)
  })
