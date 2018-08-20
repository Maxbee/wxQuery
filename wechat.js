

const Wechat = require('wechat4u');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const CronJob = require('cron').CronJob;



let bot
let UserName
try {
    bot = new Wechat(require('./sync-data.json'));
} catch (e) {
    bot = new Wechat();
}
// console.log('-==================================',bot.PROP)
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
        //fs.writeFileSync(`./members.json`,JSON.stringify(members))
        let percentMale = ((male/contactNum)*100).toFixed(2);
        let percentFemale = ((female/contactNum)*100).toFixed(2);
       console.log(`公众号数:${wxOffical},联系人总数为:${contactNum},男性为：${male},女性为${female},男性比例：${percentMale}%,女性比例：${percentFemale}%`)
            
        
    })
    // console.log(bot.contacts)
    UserName = bot.user.UserName
    fs.writeFileSync('./sync-data.json', JSON.stringify(bot.botData));
});

let boss
bot.on('contacts-updated', contacts => {
  
    // console.log('all contact',contacts)
    
    // if (!boss) {
        
   
         if (bot.Contact.getSearchUser('G.M').length) {
             //console.log('bot contact',bot.Contact.getSearchUser('甜筒'))
             boss = bot.Contact.getSearchUser('G.M')[0].UserName;
             console.log('获取目标用户成功: ', boss);
             // bot.sendMsg('还有五分钟就下班了', boss)
             // .catch(err => {
             //     bot.emit('send error', err);
             // });
     }
    
});
//早上提醒
new CronJob('00 30 07 * * *', function () {
    if (boss) {
        bot.sendMsg('GM，早上好，今天点天气看起来很好呀，别忘了吃早餐(蜂蜜水))哦~', boss)
            .catch(err => {
                bot.emit('send error', err);
            });
    }
}, null, true, 'Asia/Shanghai');
//下班打卡提醒
new CronJob('00 50 18 * * *', function () {
    if (boss) {
        bot.sendMsg('GM，已经下班20分钟啦，别忘了打卡哦[微笑]。', boss)
            .catch(err => {
                bot.emit('send error', err);
            });
    }
}, null, true, 'Asia/Shanghai');
//生日提醒
new CronJob('00 00 00 13 08 *', function () {
    if (boss) {
        bot.sendMsg('GM,今天是你的生日哦，生日快乐~[蛋糕]', boss)
            .catch(err => {
                bot.emit('send error', err);
            });
    }
}, null, true, 'Asia/Shanghai');
//睡觉提醒
new CronJob('00 30 23 * * *', function () {
    if (boss) {
        bot.sendMsg('GM，已经晚上11点半了，该休息了，请注意休息时间哦，晚安。', boss)
            .catch(err => {
                bot.emit('send error', err);
            });
    }
}, null, true, 'Asia/Shanghai');
//吃饭提醒
new CronJob('00 00 12 * * *', function () {
    if (boss) {
        bot.sendMsg('老铁们，还有30分钟就可以吃饭了！', '@@5dfa711754f8d64958965992ed99b03fe32ada6b81b941eb4b3ece74e10dc349')
            .catch(err => {
                bot.emit('send error', err);
            });
    }
}, null, true, 'Asia/Shanghai');
new CronJob('00 30 18 * * *', function () {
    if (boss) {
        bot.sendMsg('老铁们，下班啦！！！！赶紧下班回家！！！', '@@5dfa711754f8d64958965992ed99b03fe32ada6b81b941eb4b3ece74e10dc349')
            .catch(err => {
                bot.emit('send error', err);
            });
    }
}, null, true, 'Asia/Shanghai');
bot.on('uuid', uuid => {
    qrcode.generate('https://login.weixin.qq.com/l/' + uuid, {
      small: true
    })
   
    console.log('二维码链接：', 'https://login.weixin.qq.com/qrcode/' + uuid)
  })
  let  recallMsgUser;

  let recallMsgObj = {}
//   bot.on('message', msg => {
//      recallMsgUser = bot.contacts[msg.FromUserName].getDisplayName()
     
//     console.log('收到消息:'+ JSON.stringify(msg))
    
    
//     switch (msg.MsgType) {

//     //文字类型消息
//       case bot.CONF.MSGTYPE_TEXT:
//       console.log('【接收文本数据：】'+JSON.stringify(msg))
//             recallMsgObj[msg.MsgId] = {
//                 'MsgId':msg.MsgId,
//                 'FromUserName':msg.FromUserName,
//                 'Content':msg.Content
//             }
//             fs.writeFileSync(`./msg.json`,JSON.stringify(recallMsgObj))
   
//         if(UserName!=msg.FromUserName){
            
//             // fs.writeFileSync(`./msg.json`,JSON.stringify(recallMsgObj))
//             // fs.appendFile(`./msg.json`, JSON.stringify(recallMsgObj), function () {
//             //     console.log('追加内容完成');
//             //   });
//             let userFullName = bot.contacts[msg.FromUserName].getDisplayName()
//             let content = msg.Content

//             console.log(`接收消息：${userFullName}:`+content)
           
//         }else{
        
//             console.log('不要给自己发消息')
//         }
//         break
//         //消息撤回
//       case bot.CONF.MSGTYPE_RECALLED:
//     //   let singleMsg = recallMsgObj[msg.FromUserName]
//         console.log('【接收撤回数据：】'+JSON.stringify(msg))
//         let msgIdStarIndex = msg.Content.indexOf('<msgid>')
//         let msgIdEndIndex = msg.Content.indexOf('</msgid>')
//         let msgId = msg.Content.substring(msgIdStarIndex+7,msgIdEndIndex)
//         //console.log(`[msg:${msg.Content}][msgIdStarIndex:${msgIdStarIndex}][msgIdEndIndex:${msgIdEndIndex}]`+'msgId:'+msgId)
        
//         let recallUser ;
//         let recallMsg = recallMsgObj[msgId].Content
        
//         if(/<msg>/.test(recallMsg)){//撤回表情
//             console.log('【撤回的消息】：'+JSON.stringify(msg))
            
//             bot.sendMsg({
//                 file: fs.createReadStream(`./media/${msgId}.gif`),
//                 filename: `${msg.MsgId}.gif`
//               }, msg.FromUserName)
//                 .catch(err => {
//                   bot.emit('error', err)
//                 })
//         }else if(/@{1}/.test(recallMsg)){
//             console.log('群撤回@@@：',JSON.stringify(msg))
//             // console.log('群撤回@@@msgcontent：',JSON.stringify(recallMsg))
//             let maohaoIndex = recallMsg.indexOf(':')
//             let userString = recallMsg.substr(0,maohaoIndex)
//             recallMsg = recallMsg.substring(maohaoIndex+1,)
//             console.log('撤回人的fromusername：'+userString)
//             try{
//                 recallUser =bot.contacts[userString].getDisplayName()
//             }catch(e){
//                 bot.sendMsg(e, msg.FromUserName)
//                 console.log(`用户串[${userString}]`)
//             }
           
//             bot.sendMsg(`[${recallUser}]撤回消息:`+recallMsg, msg.FromUserName).catch(err => {
//                 bot.emit('发送消息错误', err)
//               })
//             console.log(`[${recallUser}]撤回消息:`+recallMsg)
//         }else 
//         if(recallMsg.indexOf("\n")>-1){
//             console.log('群撤回nnn：',msgId)
//             // console.log('群撤回nnnmsgcontent：',JSON.stringify(recallMsg))
//             let maohaoIndex = recallMsg.indexOf(':')
//             let userString = recallMsg.substr(0,maohaoIndex)
//             recallMsg = recallMsg.substring(maohaoIndex+1,)
//             console.log('nnn撤回人的fromusername：'+userString)
            
//             recallUser = userString
//             bot.sendMsg(`[${recallUser}]撤回消息:`+recallMsg, msg.FromUserName)
//             console.log(`[${recallUser}]撤回消息:`+recallMsg)
//         }else{
//            console.log('个人对话撤回',msgId)
//             recallUser = bot.contacts[recallMsgObj[msgId].FromUserName].getDisplayName()
//             bot.sendMsg(`[${recallUser}]撤回消息:\n`+recallMsg, msg.FromUserName)
//             console.log(`[${recallUser}]撤回消息:`+recallMsg)
//         }
        
  
//         break
//         case bot.CONF.MSGTYPE_IMAGE:
//         /**
//          * 图片消息
//          */
//         // console.log('【接收图片数据：】'+JSON.stringify(msg))
//         console.log('【图片消息】，保存到本地')
//         bot.getMsgImg(msg.MsgId).then(res => {
//           fs.writeFileSync(`./media/${msg.MsgId}.jpg`, res.data)
//         }).catch(err => {
//           bot.emit('error', err)
//         })
//         break
//         case bot.CONF.MSGTYPE_EMOTICON:
//         /**
//          * 表情消息
//          */
//         // console.log('【表情消息】，保存到本地:'+JSON.stringify(msg))
//         recallMsgObj[msg.MsgId] = {
//             'MsgId':msg.MsgId,
//             'FromUserName':msg.FromUserName,
//             'Content':msg.Content
//         }
//         fs.writeFileSync(`./msg.json`,JSON.stringify(recallMsgObj))
//         bot.getMsgImg(msg.MsgId).then(res => {
//           fs.writeFileSync(`./media/${msg.MsgId}.gif`, res.data)
         
//         }).catch(err => {
//           bot.emit('error', err)
//         })
//         break    
//     }
//   })