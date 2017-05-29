import { Component } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Observer } from "rxjs/Observer";
import { IntervalObservable } from 'rxjs/observable/IntervalObservable'

import { QuestionnaireService } from '../core/services/questionnaire.service';
import { TickerModel } from '../shared/models/ticker.model';

@Component({
  moduleId: module.id,
  selector: 'sd-home',
  styleUrls:[ 'home.component.css'],
  templateUrl: 'home.component.html'
})
export class HomeComponent {

  public myInterval:number = 5000;
  // public noWrapSlides:boolean = false;

  public ok_btc_usd:TickerModel;
  public ok_ltc_usd:TickerModel;
  public btce_btc_usd:TickerModel;
  public btce_ltc_usd:TickerModel;
  public btce_ltc_btc:TickerModel;

  // 交易模型
  public ok_btc_usd_price:number = 1500;
  public ok_btc_usd_vol:number = 1;
  public ok_btc_usd_fee:boolean = true;
  public ok_ltc_usd_price:number = 15;
  public ok_ltc_usd_vol:number = 60;
  public ok_ltc_usd_fee:boolean = true;
  public btce_btc_usd_price:number = 1500;
  public btce_btc_usd_vol:number = 1;
  public btce_ltc_usd_price:number = 15;
  public btce_ltc_usd_vol:number = 60;
  public btce_ltc_btc_price:number = 0.017;
  public btce_ltc_btc_vol:number = 60;

  private socket:WebSocket;

  constructor(private questionnaireService:QuestionnaireService) {
    this.ok_btc_usd = new TickerModel();
    this.ok_ltc_usd = new TickerModel();
    this.btce_btc_usd = new TickerModel();
    this.btce_ltc_usd = new TickerModel();
    this.btce_ltc_btc = new TickerModel();
  }

  ngOnInit() {
    
    setInterval(() => {
      if (this.socket) {
        this.socket.send("{'event':'ping'}");
      }
      else {
        this.socket = this.initWebSocket(this);
      }
    }, this.myInterval);
    
    setInterval(() => {
      this.questionnaireService.getTicker("btc_usd")
      .subscribe(
        x => {
          this.btce_btc_usd = x;
          this.btce_btc_usd.time = new Date(this.btce_btc_usd.updated*1000).toLocaleString();
        },
        error => console.error(error)
      )
    }, this.myInterval);

    setInterval(() => {
      this.questionnaireService.getTicker("ltc_usd")
        .subscribe(
          x => {
            this.btce_ltc_usd = x;
            this.btce_ltc_usd.time = new Date(this.btce_ltc_usd.updated*1000).toLocaleString();
          },
          error => console.error(error)
        );
    }, this.myInterval);

    setInterval(() => {
      this.questionnaireService.getTicker("ltc_btc")
        .subscribe(
          x => {
            this.btce_ltc_btc = x;
            this.btce_ltc_btc.time = new Date(this.btce_ltc_btc.updated*1000).toLocaleString();

            //this.buildRate(this.ok_btc_usd.buy, this.ok_ltc_usd.buy, this.btce_ltc_usd.buy, this.btce_btc_usd);
          },
          error => console.error(error)
        );
    }, this.myInterval);
  }

  initWebSocket(self:HomeComponent): WebSocket {
    //let self = this;
    var ws = new WebSocket("wss://real.okcoin.com:10440/websocket/okcoinapi");
    ws.onopen = function(evt) {
      ws.send("{'event':'addChannel','channel':'ok_sub_spotusd_btc_ticker'}");
      ws.send("{'event':'addChannel','channel':'ok_sub_spotusd_ltc_ticker'}");
    };
    ws.onclose = function(evt) {
      console.debug("socket 连接断开，正在尝试重新建立连接");
      self.socket = self.initWebSocket(self);
    };

    /* # Request
    {'event':'addChannel','channel':'ok_sub_spotusd_btc_ticker'}
    # Response
    [{
        "channel":"ok_sub_spotusd_btc_ticker",
        "data":{
            "buy":2478.3,
            "high":2555,
            "last":2478.51,
            "low":2466,
            "sell":2478.5,
            "timestamp":1411718074965,
            "vol":49020.30
        }
    }] */
    ws.onmessage = function(msg) {
    //   //onMessage = JSON.stringify(e.data);
    //   //console.debug(JSON.stringify(e.data));
      let jsonData = JSON.parse(msg.data);
      //console.debug(jsonData)

      if (jsonData.event == 'pong') {
        //okCoinWebSocket.lastHeartBeat = new Date().getTime();
      } else if (jsonData[0].channel == "ok_sub_spotusd_btc_ticker") {
        self.ok_btc_usd = jsonData[0].data;
        self.ok_btc_usd.time = new Date(self.ok_btc_usd.timestamp).toLocaleString();
      }
      else if (jsonData[0].channel == "ok_sub_spotusd_ltc_ticker") {
        self.ok_ltc_usd = jsonData[0].data;
        self.ok_ltc_usd.time = new Date(self.ok_ltc_usd.timestamp).toLocaleString();
      }
    } 

    return ws;
  }

  // buildRate(btc_usd:number, ltc_usd:number, ltc_usd:number, btc_usd) {
  //   -(ok_btc_usd.buy/ok_ltc_usd.buy*btce_ltc_usd.buy/btce_btc_usd.buy*100-100)-0.4)
  // }
}
