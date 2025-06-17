import OSS from "ali-oss";
import { accessKeyId, accessKeySecret, bucketName } from './secret';
const client = new OSS({
  region: "oss-cn-beijing",
  accessKeyId: accessKeyId,
  accessKeySecret: accessKeySecret,
  bucket: bucketName,
});
const maxSize = 10 * 1024 * 1024; // 10MB
// 核心上传方法
export const uploadFile = async (file: File) => {
  if (file.size > maxSize) {
    throw new Error(`文件大小不能超过 ${maxSize / 1024 / 1024}MB`);
  }

  // 生成文件名
  const fileName = generateFileName(file);

  try {
    const result = await client.multipartUpload(fileName, file);
    return {
      url: result.res.requestUrls[0].split("?")[0], // 去除签名参数
      fileName,
      size: file.size,
      type: file.type,
    };
  } catch (error) {
    throw new Error(`ali-oss图片上传失败: ${error.message}`);
  }
};

const generateFileName = (file: File) => {
  const ext = file.name.split(".").pop().toLowerCase();
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).slice(2, 8);
  return `${timestamp}_${randomStr}.${ext}`;
};
