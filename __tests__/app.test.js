const request = require("supertest");
const app = require("../dist/app").default;
const db = require("../dist/db/connection").default;
const testData = require("../dist/db/data");
const seed = require("../dist/db/seeds/seed");
const { generateToken } = require("../dist/utils/jwt");
const {
  selectLatestUsesr,
  createPendingUser,
  selectPendingUser,
} = require("../dist/models/auth");
const bcrypt = require("bcryptjs");

const { checkIfUserExist } = require("../dist/middlewares/is-auth");


beforeEach(async () => {
  await seed.default(testData);
});

afterAll((done) => {
  db.end();
  done();
});

// do login process here
//  ....
//  ....

describe("API", () => {
  describe("GET /", () => {
    test('200 : Return "{msg:Server Ready}" when links to "/"', () => {
      return request(app)
        .get("/")
        .expect(200)
        .then(({ body }) => {
          expect(body).toEqual({ msg: "Server Ready" });
        });
    });
  }); // End of "GET /"

  describe("GET /api/users", () => {
    // const isLoggin = { some process ... => set it to true }
    // test(if authentication work ).expect(....)

    test("200: Respond with array of all user objects", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body }) => {
          const { users } = body;
          expect(users).toHaveLength(6);
          users.forEach((user) => {
            expect(user).toEqual(
              expect.objectContaining({
                user_id: expect.any(Number),
                user_name: expect.any(String),
                email: expect.any(String),
                password: expect.any(String),
              })
            );
          });
        });
    });
  }); // End of "GET /api/users";

  describe("GET /api/entries", () => {
    // const isLoggin = { some process ... => set it to true }
    // test(if authentication work ).expect(....)

    test("200: Respond with array of all entries objects", () => {
      return request(app)
        .get("/api/entries")
        .expect(200)
        .then(({ body }) => {
          const { entries } = body;
          expect(entries).toHaveLength(13);
          entries.forEach((entry) => {
            expect(entry).toEqual(
              expect.objectContaining({
                user_id: expect.any(Number),
                entry_body: expect.any(String),
                created_at: expect.any(String),
                tarot_card_id: expect.any(String),
                intention: expect.any(String),
              })
            );
          });
        });
    });
  }); // End of "GET /api/entries";

  describe("GET /api/entries/:entry_id", () => {
    // const isLoggin = { some process ... => set it to true }
    // test(if authentication work ).expect(....)

    test("200: Respond with a single entry object", () => {
      return request(app)
        .get("/api/entries/2")
        .expect(200)
        .then(({ body }) => {
          const { entries } = body;
          expect(entries[0]).toEqual(
            expect.objectContaining({
              user_id: 2,
              entry_body:
                "The way to get started is to quit talking and begin doing",
              created_at: expect.any(String),
              tarot_card_id: [
                { id: 4, isLight: true, readingStyle: "Past" },
                { id: 3, isLight: false, readingStyle: "Present" },
                { id: 23, isLight: false, readingStyle: "Future" },
              ],
              intention: "Nice",
            })
          );
        });
    });
  }); // End of "GET /api/entries/:entry_id
}); // End of "API"

// Testing Error Handler
describe("Error Handler", () => {
  describe("404", () => {
    test('404: Respond with "Not Found" if url path (GET Request) not match', () => {
      return request(app)
        .get("/api/helloworld")
        .expect(404)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe("Not Found");
        });
    });

    test('404: Respond with "Not Found" if url path (POST Request) not match', () => {
      return request(app)
        .post("/api/helloworld")
        .expect(404)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe("Not Found");
        });
    });
  }); // End of dscribe(404)

  describe("500", () => {
    test('500: Respond with "Internal Server Error" if server throw error', () => {
      return request(app)
        .get("/api/error-test/triggerStatus500Error")
        .expect(500)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe("Internal Server Error");
        });
    });

    test.skip('22P02: Respond with "Bad Request" if database table not found', () => {
      return request(app)
        .get("/api/error-test/TableNotFound")
        .expect(500)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe("Internal Server Error");
        });
    });
  }); // End of dscribe(500)
}); // End of Error Handler

// Testing Authentication
describe("Authentication", () => {
  // Sign Up testing
  describe("POST// api/auth/signup", () => {
    const reqBody = {
      username: "hello",
      password: "1234567",
      email: "wilson.ws.pro@gmail.com",
    };

    test("200: Return a pending user id after successfully signup but pending for email confirmation", () => {
      return request(app)
        .post("/api/auth/signup")
        .send(reqBody)
        .expect(200)
        .then(({ body }) => {
          const { pendingUserId } = body;
          expect(pendingUserId).toEqual(expect.any(Number));
        });
    });

    // test("401: Email Address already ", () => {});
    // test("401: Email Empty ", () => {});
    // test("401: Email format not valid ", () => {});
    // test("401: Username Empty ", () => {});
    // test("401: Username too long ", () => {});
    // test("401: Password Empty ", () => {});
    // test("401: Password format valid ", () => {});
  }); // End of Sign

  // Sign up Confirmation
  describe("POST// api/auth/signUpConfirim", () => {
    // function that mimic to create a pending_user
    function createPendingUser(body) {
      return request(app)
        .post("/api/auth/signup")
        .send(body)
        .expect(200)
        .then(({ body }) => {
          return body.pendingUserId;
        });
    }

    // function to get the code in email
    function getCode(pendingUserId) {
      const sql = `SELECT * from pending_users WHERE user_id = $1;`;
      return db.query(sql, [pendingUserId]).then(({ rows }) => {
        return rows[0].code;
      });
    }

    // function that send the signUpConfirm api
    function signUpConfirm(body) {
      return request(app)
        .post("/api/auth/signUpConfirm")
        .send(body)
        .expect(200)
        .then(({ body }) => {
          return body;
        });
    }

    test("200: Creata a new user after send back a correct verifying code to serve", () => {
      const reqBody = {
        username: "helloworld123",
        password: "1234567",
        email: "wilson.ws.pro@gmail.com",
      };

      let pendingUserId;

      return createPendingUser(reqBody) // pretend to make the sign up
        .then((userId) => {
          pendingUserId = userId;
          return getCode(pendingUserId); // Get the code that is sent to user in email
        })
        .then((code) => {
          const reqBody2 = {
            code: code,
            pendingUserId: pendingUserId,
          };
          return signUpConfirm(reqBody2); // send back the code to server and create a real user
        })
        .then((body) => {
          // return a jwt for the created user
          return selectLatestUsesr().then((user) => {
            // get the user data that is just created
            const tokenToCheck = generateToken(
              // make the jwt to compare the returned jwt
              user[0].email,
              user[0].user_id.toString()
            );

            const { jwt, user_id, email, user_name } = body.user;
            expect(jwt).toBe(tokenToCheck); // get JWT
            expect(user_name).toBe("helloworld123");
            expect(email).toBe("wilson.ws.pro@gmail.com");
            expect(user_id).toBe(7);  // the new record must be 7
            expect(user[0].user_name).toBe("helloworld123");
            expect(user[0].email).toBe("wilson.ws.pro@gmail.com");
  
          });
        });
    });

    test("401: Return 'Code Expired' and delete pending user if late process of confirmation", () => {
      const reqBody = {
        code: 1111,
        pendingUserId: 1,
      };

      return request(app)
        .post("/api/auth/signUpConfirm")
        .send(reqBody)
        .expect(401)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe("Code Expired");
          selectPendingUser(reqBody.pendingUserId).then((row) => {
            expect(row).toBe(undefined);
          });
        });
    });

    test("401: Return 'Code Invalid' and delete pending user if input wrong code", () => {
      const reqBody = {
        code: 1234, // wrong code
        pendingUserId: 2,
      };
      return request(app)
        .post("/api/auth/signUpConfirm")
        .send(reqBody)
        .expect(401)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe("Code Invalid");
          selectPendingUser(reqBody.pendingUserId).then((row) => {
            expect(row).toBe(undefined);
          });
        });
    });
  }); // End of POST// api/auth/signUpConfirim"

  describe("POST// api/auth/login", () => {
    
    test("200: Return a JWT after Successfully login", () => {
      const reqBody = {
        user_id: 3,
        email: "john@tarotmail.com",
        password: "johnhere",
        user_name: "John",
      };

      return request(app)
        .post("/api/auth/login")
        .send(reqBody)
        .expect(200)
        .then(({ body }) => {
          const { jwt, user_id, email, user_name } = body.user;
          const token = generateToken("john@tarotmail.com", (3).toString());
          expect(jwt).toBe(token);
          expect(user_id).toBe(3);
          expect(email).toBe("john@tarotmail.com");
          expect(user_name).toBe("John");
        });
    });
    // test("401: Email Empty", () => {});
    // test("401: Email invalid", () => {});
    // test("401: Password Empty", () => {});
    // test("401: Password invalid", () => {});
  }); // End of Login

  describe("Rest", () => {
    // test("200: Successfully rest password", () => {});
    // test("200: Successfully rest username", () => {});
    // test("401: Username Empty ", () => {});
    // test("401: Username too long ", () => {});
    // test("401: Password Empty ", () => {});
    // test("401: Password format valid ", () => {});
  }); // End of Login
}); // End of Testing Authentication



describe.only("Middleware - is-Auth", () => {

  describe("JWT Token Validation", () => {
    test("GET/ api/users/ - show all if jwt valid (for admin use only)", () => {
      const token = generateToken("john@tarotmail.com", (3).toString());
      const headerConfig = {
        Authorization: `Bearer ${token}`,
      };
      return request(app)
        .get("/api/users")
        .set(headerConfig)
        .expect(200)
        .then(({ body }) => {
          const { users } = body;
          expect(users).toHaveLength(6);
          users.forEach((user) => {
            expect(user).toEqual(
              expect.objectContaining({
                user_id: expect.any(Number),
                user_name: expect.any(String),
                email: expect.any(String),
                password: expect.any(String),
              })
            );
          });
        });
    });

    test("Return 401 and `No Token` if token is not attached ", () => {
      const headerConfig = {  };
      return request(app)
        .get("/api/users")
        .set(headerConfig)
        .expect(401)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe('No Token')
        });
    });

    test("Return 401 and `Invalid Token` if token is not valid ", () => {
      const headerConfig = { Authorization: 'Bearer safsfadsfasfsdfanpm'};
      return request(app)
        .get("/api/users")
        .set(headerConfig)
        .expect(401)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe("Invalid Token");
        });
    });

    test.only("Return false /true if user(email) not exist / exist", () => {
      checkIfUserExist("test@hottymail.com").then((exist) => {
        expect(exist).toBe(true);
      });
      checkIfUserExist("test@hottym----ail.com").then((exist) => {
        expect(exist).toBe(false);
      });
    });
    

    
  }); // end of testing JWT Token Validation
});// End of Testing Middleware