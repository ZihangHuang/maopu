import qiniu from 'qiniu';
import config from '../config';
const { accessKey, secretKey, bucket } = config.qiniu;

const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);

export const uploadToken = (key: string): string => {
  const options: qiniu.rs.PutPolicyOptions = {};
  if (key) {
    options.scope = bucket + ':' + key;
  } else {
    options.scope = bucket;
  }

  const putPolicy = new qiniu.rs.PutPolicy(options);
  return putPolicy.uploadToken(mac);
};
