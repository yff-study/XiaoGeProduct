<template>
  <div class="page">
    <div class="head-top">
      <div class="head-flex">
        <img
          src="https://t9.baidu.com/it/u=1661947349,1453556410&fm=218&app=92&f=JPG?w=121&h=75&s=171319CF4C6B2C17C92C98A20300F013"
          class="logo" alt="">
        <div>LOGO</div>
      </div>
      <div v-if="address==''" class="packet" @click="connect">Connect Wallet</div>
      <div v-else class="packet">{{address}}</div>
    </div>
    <div class="tabs-box" :class="{'tabs-box-on':active==2}">
      <div :class="{'on':active==1}" @click="active=1">投资</div>
      <div :class="{'on':active==2}" @click="active=2">收益</div>
    </div>
    <div>
    </div>
    <div v-if="active==1">
      <div class="tz-box">
        <div class="money-box">
          <van-field placeholder="请输入投资金额" class="num-box" v-model="number" type="number" />
          <van-button type="default" @click="buy" class="tz">投资</van-button>
        </div>
        <van-button type="default" class="yq" :data-clipboard-text="yqUrl" @click="initClipboard">邀请</van-button>
      </div>
      <div class="box">
        <div class="box-tit">投资概况</div>
        <div v-if="ifConnect">
          <div class="survey-box">
            <div class="survey-tit">总代币(AAX)</div>
            <div class="survey-value">{{totalMami}}</div>
          </div>
          <div class="survey-box">
            <div class="survey-tit">股份占比</div>
            <div class="survey-value">{{percentage}}</div>
          </div>
          <div class="survey-box">
            <div class="survey-tit">投资(USDT)</div>
            <div class="survey-value">{{usdt}}</div>
          </div>
          <div class="survey-box">
            <div class="survey-tit">投资代币(AAX)</div>
            <div class="survey-value">{{awardMami}}</div>
          </div>
          <div class="survey-box">
            <div class="survey-tit">推荐奖励(AAX)</div>
            <div class="survey-value">{{mami}}</div>
          </div>
        </div>
        <div class="no-data" v-else>暂无数据</div>
      </div>
      <div class="box">
        <div class="box-tit">
          <div>投资明细</div>
          <a href="" class="href-link">投资规则</a>
        </div>
        <div class="three-box">
          <div>投资时间</div>
          <div>投资USDT</div>
          <div>获得AAX</div>
        </div>
        <div v-if="investList.length>0">
          <div class="info-card" v-for="item in investList">
            <div>{{item.createTime}}</div>
            <div>{{item.usdt}}</div>
            <div>{{item.mami}}</div>
          </div>
        </div>
        <div class="no-data" v-else>暂无数据</div>
      </div>
      <div class="box">
        <div class="box-tit">
          <div>邀请明细</div>
          <a href="" class="href-link">邀请规则</a>
        </div>
        <div class="three-box">
          <div>邀请好友</div>
          <div>投资AAX</div>
          <div>奖励AAX</div>
        </div>
        <div v-if="inviteList.length>0">
          <div class="info-card" v-for="item in inviteList">
            <div>{{item.referee}}</div>
            <div>{{item.awardMami}}</div>
            <div>{{item.mami}}</div>
          </div>
        </div>
        <div class="no-data" v-else>暂无数据</div>
      </div>
    </div>
    <div v-else>
      <div class="box">
        <div class="box-tit">投资概况</div>
        <!-- <div class="survey-box">
          <div class="survey-tit">收益(USDT)</div>
          <div class="survey-value">80,000</div>
        </div>
        <div class="survey-box">
          <div class="survey-tit">总代币(AAX)</div>
          <div class="survey-value">52,000</div>
        </div>
        <div class="survey-box">
          <div class="survey-tit">已出售(AAX)</div>
          <div class="survey-value">40,000</div>
        </div>
        <div class="survey-box">
          <div class="survey-tit">剩余(AAX)</div>
          <div class="survey-value">2,000</div>
        </div> -->
        <div class="no-data">暂未推出</div>
      </div>
    </div>
    <div class="box">
      <div class="box-tit">
        <div>收益明细</div>
        <a href="" class="href-link">收益规则</a>
      </div>
      <!-- <div class="three-box">
        <div>出售时间</div>
        <div>卖出AAX</div>
        <div> 获得USDT</div>
      </div>
      <div class="info-card" v-for="item in 5">
        <div>2021-02-01</div>
        <div>30,000</div>
        <div>3,000</div>
      </div> -->
       <div class="no-data">暂未推出</div>
    </div>
    <van-overlay :show="loading">
      <van-loading class="loading" size="60" text-size="32" color="#1989fa" type="spinner"> 加载中...</van-loading>
    </van-overlay>
  </div>
</template>
<script>
 import { Dialog } from 'vant';
  var urlTab = 'http://192.168.136.182:8080'
  var web3Provider;
  var web3js;
  import Clipboard from 'clipboard'
  export default {
    data() {
      return {
        active: 1,
        number: '',
        address: '',
        realyAddress: '',
        add: '0x5b40E0Ac84cb3798c45ffb4c97EA9EC621F93886',
        awardMami: '',
        mami: '',
        percentage: '',
        totalMami: '',
        usdt: '',
        investList: [],
        inviteList: [],
        ifConnect: false,
        loading: false,
        inviteCode: '', //邀请码
        BeinviteCode: '',
        yqUrl:''
      };
    },
    methods: {
      //投资验证
      verifyFun(data) {
        this.$http.post(urlTab + '/invest/verify', data).then(res => {})
      },
      initClipboard() {
        if (!this.ifConnect) {
          Dialog({ message: '请先连接钱包' });
          return
        }
        this.yqUrl = location.origin + '?inviteCode=' + this.inviteCode
        var clipboard = new Clipboard('.yq')  
        clipboard.on('success', e => {  
          console.log('复制成功')  
          Dialog({ message: '邀请链接复制成功' });
          // 释放内存  
          clipboard.destroy()  
        
        })  
        clipboard.on('error', e => {  
          // 不支持复制  
          console.log('该浏览器不支持自动复制')  
          // 释放内存  
          clipboard.destroy()  
        })  
      },
      //投资概览
      summary() {
        this.$http.get(urlTab + '/invest/summary?walletAddress=' + this.realyAddress).then(res => {
          this.awardMami = res.awardMami
          this.mami = res.mami
          this.percentage = res.percentage
          this.totalMami = res.totalMami
          this.usdt = res.usdt
          this.inviteCode = res.inviteCode
        })
      },
      //邀请
      investment() {
        this.$http.get(urlTab + '/invest/invite?walletAddress=' + this.realyAddress).then(res => {
          this.inviteList = res.data
        })
      },
      inveDetail() {
        this.$http.get(urlTab + '/invest/list?walletAddress=' + this.realyAddress).then(res => {
          this.investList = res.data
        })
      },
      buy() {
        if (!this.ifConnect) {
          Dialog({ message: '请先连接钱包' });
          return
        }
        var _that = this
        var value = _that.number * 1000000000000000000
        _that.loading = true
        web3js.eth.sendTransaction({
          from: _that.realyAddress,
          // to: _that.add,
          to: _that.realyAddress == '0x5b40E0Ac84cb3798c45ffb4c97EA9EC621F93886' ?
            '0x2C7f6B3FeCb4AF2054e031dfE89DaF9Ece6e4Eb9' : '0x5b40E0Ac84cb3798c45ffb4c97EA9EC621F93886', //测试 
          value
        }).then(function (receipt) {
          _that.init()
          Dialog({ message: '投资成功' });
          _that.verifyFun({
            "hash": receipt.transactionHash,
            "num": Number(_that.number),
            "walletAddress": _that.realyAddress,
            "inviteCode": _that.BeinviteCode
          })
        }).finally(res => {
          _that.loading = false
        })
      },
      link() {
        if (ethereum) {
          web3Provider = ethereum;
          // 新版需要请求用户授权
          try {
            ethereum.enable();
          } catch (error) {
            Dialog({ message: '用户取消授权' });
            return;
          }
        } else if (web3) {
          // MetaMask Legacy dapp browsers...
          web3Provider = web3.currentProvider;
          console.log("web3.currentProvider:");
          console.log(web3.currentProvider);
        } else {
          web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
          console.log("https://http-testnet.hecochain.com");
        }
        web3js = new Web3(web3Provider);

      },
      init() {
        //初始化
        this.investment()
        this.inveDetail()
        this.summary()
      },
      connect() {
        var _that = this
        if (!web3js) {
          alert('请先连接 wallet')
          return;
        }
        web3js.eth.getAccounts(function (error, result) {
          if (!error) {
            _that.realyAddress = result[0]
            var stringlength = result[0].length
            var preAddress = result[0].substring(0, 6);
            var nextAddress = result[0].substring(stringlength - 6, stringlength);
            _that.address = preAddress + '......' + nextAddress
            _that.ifConnect = true
            _that.init()
          } else {
            alert('获取地址失败')
          }
        });
        // window.addEventListener('load', function () {
        //   if (!window.web3) { //用来判断你是否安装了metamask
        //     window.alert('Please install MetaMask first.'); //如果没有会去提示你先去安装
        //     return;
        //   }
        //   if (!web3.eth.coinbase) { //这个是判断你有没有登录，coinbase是你此时选择的账号
        //     window.alert('Please activate MetaMask first.');
        //     return;
        //   }
        //   // Checking if Web3 has been injected by the browser (Mist/MetaMask)
        //   if (typeof web3 !== 'undefined') {

        //     // Use the browser's ethereum provider
        //     web3.personal.sign(web3.fromUtf8("Hello from wanghui!"), web3.eth.coinbase, console.log);

        //   }
        //   console.log(window.web3);
        //   console.log(web3);
        // });
        // if (!!window.imToken || window.ethereum.isImToken) {
        //   //浏览器环境是 imToken DApp browser
        //   window.addEventListener("load", async () => {
        //     alert('2')
        //     // Modern dapp browsers...
        //     if (window.ethereum) {
        //       window.web3 = new Web3(ethereum);
        //       try {
        //         // Request account access if needed
        //         await ethereum.enable();
        //         // Acccounts now exposed
        //         web3.eth.sendTransaction({
        //           /* ... */
        //         });
        //       } catch (error) {
        //         // User denied account access...
        //       }
        //       alert('1')
        //     }
        //     // Legacy dapp browsers...
        //     else if (window.web3) {
        //       window.web3 = new Web3(web3.currentProvider);
        //       // Acccounts always exposed
        //       web3.eth.sendTransaction({
        //         /* ... */
        //       });
        //       alert('3')
        //     }
        //   });
        // } else {
        //   alert('2')
        // }
      }
    },
    mounted() {
      this.BeinviteCode = this.$route.query.inviteCode || ""
      this.link()
    }
  };

</script>
<style lang="scss">
  .page {
    padding: 30px 0 60px;
  }
  .van-dialog{
    transform: scale3d(2,2,2) translateX(-25%);
  }
  .no-data {
    text-align: center;
    font-weight: bolder;
    padding: 46px 0 26px;
    font-size: 40px;
  }

  .loading {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: 42%;
  }

  .tz-box {
    padding: 0 30px;
    display: flex;
    margin-top: 30px;
    justify-content: space-between;

    .money-box {
      position: relative;

      .tz {
        width: 120px;
        height: 80px;
        background: #494DFF;
        border-radius: 10px;
        font-weight: bold;
        color: #FFFFFF;
        position: absolute;
        right: 0;
        top: 0;
        font-size: 30px;
        border: none;
      }
    }

    .yq {
      width: 200px;
      height: 80px;
      background: #FF7F21;
      border-radius: 10px;
      font-size: 30px;
      font-weight: bold;
      color: #fff;
      border: none;
    }
  }

  .num-box {
    width: 470px;
    height: 80px;
    background: #FFFFFF;
    border: 1px solid #D7D7DC;
    border-radius: 10px;
    display: flex;
    font-weight: bold;
    padding: 0 150px 0 30px;
    align-items: center;
    font-size: 30px;
  }

  .three-box,
  .info-card {
    font-weight: bold;
    font-size: 24px;
    display: flex;
    margin-top: 40px;

    div:nth-child(1) {
      width: 40%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    div:nth-child(2) {
      width: 40%;
    }

    div:nth-child(3) {
      flex: 1;
      text-align: right;
    }
  }

  .three-box {
    color: #706D84;
  }

  .survey-box {
    font-size: 24px;
    font-weight: bold;
    display: flex;
    margin-top: 32px;
    justify-content: space-between;

    .survey-tit {
      color: #706D84;
    }

    .survey-value {
      color: #1E1847;
      text-align: right;
    }
  }

  .box {
    width: 690px;
    background: #FFFFFF;
    box-shadow: 0px 0px 36px 4px rgba(102, 102, 102, 0.1);
    border-radius: 10px;
    margin: 30px auto 0;
    padding: 30px 40px;

    .box-tit {
      font-weight: bold;
      color: #1E1847;
      padding: 0 0 29px;
      font-size: 30px;
      line-height: 1;
      display: flex;
      justify-content: space-between;

      .href-link {
        color: #3F2EDC;
        font-size: 24px;

      }

      border-bottom: 1px solid #E6E6EB;
    }
  }

  .tabs-box {
    font-weight: bold;
    color: #78777D;
    display: flex;
    padding: 40px 80px 0;
    border-bottom: 1px solid #E6E6EB;
    justify-content: space-around;
    height: 130px;
    line-height: 130px;
    font-size: 28px;
    position: relative;
    align-items: center;

    &::after {
      content: "";
      width: 40px;
      height: 6px;
      position: absolute;
      left: 210px;
      transition: all .3s;
      bottom: 20px;
      background: #494DFF;
    }

    &.tabs-box-on::after {
      left: 506px;
    }

    div {
      width: 50%;
      text-align: center;
      line-height: 1.8;
      padding-bottom: 30px;
    }

    .on {
      font-size: 30px;
      color: #1E1847;
      font-weight: bold;
    }
  }

  .packet {
    width: 237px;
    height: 54px;
    background: #494DFF;
    border-radius: 10px;
    font-size: 24px;
    color: #fff;
    text-align: center;
    line-height: 54px;
  }

  .head-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 30px 0 40px;

    .head-flex {
      display: flex;
      align-items: center;
      font-weight: bold;
      justify-content: space-between;
    }

    .logo {
      width: 46px;
      height: 46px;
      border-radius: 50%;
      margin-right: 17px;
      background-color: #ddd;
    }
  }

</style>
