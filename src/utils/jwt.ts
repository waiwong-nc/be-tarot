import jwt from "jsonwebtoken";

export const generateToken = (email:string,userId:string ) => {
  const secret: any = process.env.JWT_SECRET;
  return jwt.sign(
    {
      email: email,
      userId: userId
    },
    secret,
    { expiresIn: "180d" }
  );
};

export const decodedToken = (token:string) => {
  try{
    const secret: any = process.env.JWT_SECRET;
    return jwt.verify(token, secret);
  }
  catch(err){
    return false;
  }
}