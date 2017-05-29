// 行情信息
export class TickerModel{
  "buy":number;       // 买一价
  "high":number;      // 最高价
  "last":number;      // 最新成交价
  "low":number;       // 最低价
  "sell":number;      // 卖一价
  "timestamp":number; // 时间戳
  "updated":number;   // 时间戳
  "timespan":number;  // 与当前时间间隔(秒)
  "time":string;      // 时间字符串
  //"vol":number;     // 成交量(最近的24小时)
}
