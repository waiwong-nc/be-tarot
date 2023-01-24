import seed from "./seed";
import db from "../connection";
// import {Data} from "../data";

// console.log(users, "<< users")
// console.log(entries, "<< entries");
// console.log(Data)


const runSeed = () => {
    return seed()
  };
  
  runSeed();