/**
 * 给所有的 Model 扩展功能
 * http://mongoosejs.com/docs/plugins.html
 */
import { Schema, Model } from 'mongoose';
import { getFormatDate } from '../common/tools';

export default function(schema: Schema, options: any): void {
  schema.pre('updateOne', function(this: Model<any>, next) {
    this.updateOne({}, { $set: { updateTime: getFormatDate() } });
    next();

    //设置索引
    if (options && options.index) {
      schema.path('updateTime').index(options.index);
    }
  });
}
