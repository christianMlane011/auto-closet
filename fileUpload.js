const fs = require("fs");
const aws = require("aws-sdk");
const { awsID, awsSecret } = require('./config');


// Enter copied or downloaded access ID and secret key here
const ID = awsID;
const SECRET = awsSecret;

// The name of the bucket that you have created
const BUCKET_NAME = 'auto-closet';

const s3 = new aws.S3({
    accessKeyId: ID,
    secretAccessKey: SECRET
});


const uploadFile = (fileName, fileRename) => {
    // Read content from the file
    const fileContent = fs.readFileSync(fileName);

    // Setting up S3 upload parameters
    const params = {
        Bucket: BUCKET_NAME,
        Key: fileRename, // File name you want to save as in S3
        Body: fileContent
    };

    // Uploading files to the bucket
    s3.upload(params, function(err, data) {
        if (err) {
            throw err;
        }
        console.log(`File uploaded successfully. ${data.Location}`);
    });
};


// async function getImage() {
//     const data = s3.getObject({
//         Bucket: BUCKET_NAME,
//         Key: 'cat.jpg'
//     }).promise();
//     return data;
// }

// getImage().then((img) => {
//     let image = "<img src='data:image/jpeg;base64," + encode(img.Body) + "'" + "/>";
//     let startHTML="<html><body></body>";
//     let endHTML="</body></html>";
//     let html=startHTML + image + endHTML;
//     res.send(html)
//     }).catch((e)=>{
//             res.send(e)
// });

// function encode(data){
//     let buf = Buffer.from(data);
//     let base64 = buf.toString('base64');
//     return base64;
// }

module.exports = {uploadFile};

//uploadFile('./public/images/pants2.jpg', 'cats2.jpg');