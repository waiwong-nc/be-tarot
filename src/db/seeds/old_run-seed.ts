// import seed from "./seed";
// import data from "../data";
// import db from "../connection";

// const runSeed = () => {
//   return seed(data)
//     .then((re) => {
//       // console.log(`\x1b[32m ${re.response}`);
//       db.end();
//     })
//     .catch((err) => {
//       if (err.errorCode === "40P01") {
//         console.log("\x1b[33m Deadlock Problem. Re-try Seeding ...");
//         seed(data)
//           .then(() => {
//             console.log( "\x1b[32m Deadlock Re-try success. SEEDING COMPLETED " );
//             db.end();
//           })
//           .catch((err) => {
//             console.log("\x1b[31m SEEDING FAILED : ", err);
//             db.end();
//           });
//       }
//     });
// };



// runSeed();

