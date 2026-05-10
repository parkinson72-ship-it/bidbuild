import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

export const r2 = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY!,
    secretAccessKey: process.env.R2_SECRET_KEY!
  }
});

export async function putObject(
  key: string,
  body: Buffer,
  contentType: string
) {
  await r2.send(
    new PutObjectCommand({
      Bucket: process.env.R2_BUCKET!,
      Key: key,
      Body: body,
      ContentType: contentType
    })
  );
}
