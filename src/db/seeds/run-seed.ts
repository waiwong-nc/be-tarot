import seed from "./seed";
import data from "../data";
import db from "../connection";

const runSeed = () => {
  return seed(data).then(() => db.end())
}
runSeed();

