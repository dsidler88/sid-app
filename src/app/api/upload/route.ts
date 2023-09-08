import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";
import axios from "axios";

//const agent = new HttpsProxyAgent("http://evapzen.fpl.com:10262");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  cloud_url: process.env.CLOUDINARY_URL,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
  api_proxy: "http://evapzen.fpl.com:10262",
});

export async function GET() {
  return NextResponse.json({ message: "Hello from chatbot" }, { status: 200 });
}
export async function POST(request: Request) {
  const { path } = await request.json();

  if (!path) {
    return NextResponse.json(
      { message: "Image path is required" },
      { status: 400 }
    );
  }

  try {
    const options = {
      use_filename: true,
      unique_filename: false,
      overwrite: true,
      transformation: [{ width: 1000, height: 752, crop: "scale" }],
      proxy: "http://evapzen.fpl.com:10262",
    };

    //cloudinary result after upload
    const result = await cloudinary.uploader.upload(path, options);

    //console.log(result);

    //return result
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.log("error uploading image", error);
    return NextResponse.json({ message: error }, { status: 500 });
  }
}

// export async function GET() {
//   return NextResponse.json({ message: "Hello from upload" }, { status: 200 });
// }
// const secret = process.env.CLOUDINARY_SECRET;
// export async function POST(request: Request) {
//   var timestamp = Math.round(new Date().getTime() / 1000);

//   var signature = cloudinary.utils.api_sign_request(
//     {
//       timestamp: timestamp,
//       eager: "w_400,h_300,c_pad|w_260,h_200,c_crop",
//       public_id: "sample_image",
//     },
//     secret!
//   );

//   const { path } = await request.json();

//   if (!path) {
//     return NextResponse.json(
//       { message: "Image path is required" },
//       { status: 400 }
//     );
//   }

//   try {
//     const options = {
//       use_filename: true,
//       unique_filename: false,
//       overwrite: true,
//       transformation: [{ width: 1000, height: 752, crop: "scale" }],
//       // proxy: "http://evapzen.fpl.com:10262",
//     };

//     //cloudinary result after upload
//     const result = await cloudinary.uploader.upload(path, options);

//     //console.log(result);

//     //return result
//     return NextResponse.json(result, { status: 200 });
//   } catch (error) {
//     console.log("error uploading image", error);
//     return NextResponse.json({ message: error }, { status: 500 });
//   }
// }
