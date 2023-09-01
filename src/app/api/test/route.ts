import { getToken } from "next-auth/jwt";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

//takes the secret and returns the token
const secret = process.env.NEXTAUTH_SECRET;

// export async function GET(req: NextRequest) {
//   console.log("first thing in the api route");
//   try {
//     const response = await fetch(
//       "https://jsonplaceholder.typicode.com/posts/2"
//     );
//     const data = await response.json();
//     return NextResponse.json(data, { status: 200 });
//   } catch (error) {
//     console.log("ERROR IN THE API", error);
//   }
// }

export async function GET(req: NextRequest) {
  console.log("first thing in the api route");
  try {
    const response = await axios.get(
      "https://jsonplaceholder.typicode.com/posts/37"
    );
    //console.log(response);
    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    console.log("ERROR IN THE API", error);
  }
}
