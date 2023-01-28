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
    test.skip("200: Respond with array of all user objects", () => {
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

  describe("GET /api/users/profile", () => {
    test("200: Respond with single user objects (username, email)", () => {
      const token = generateToken("test@hottymail.com", 1);
      return request(app)
        .get("/api/users/profile")
        .set({ Authorization: `bearer ${token}` })
        .expect(200)
        .then(({ body }) => {
          const { user } = body;
          console.log(user);
          expect(user).toEqual(
            expect.objectContaining({
              user_id: expect.any(Number),
              user_name: expect.any(String),
              email: expect.any(String),
              // password: expect.any(String),
            })
          );
        });
    });

    test("401: Respond with 'Invalid Token' if token not valid", () => {
      const token = "";
      return request(app)
        .get("/api/users/profile")
        .set({ Authorization: `bearer ${token}` })
        .expect(401)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe("Invalid Token");
        });
    });
  }); // End of "GET /api/users";

  describe("GET /api/entries", () => {
    // const isLoggin = { some process ... => set it to true }
    // test(if authentication work ).expect(....)

    test("200: Respond with array of all entries objects", () => {
      const token = generateToken("test@hottymail.com", 1);
      return request(app)
        .get("/api/entries")
        .set({ Authorization: `bearer ${token}` })
        .expect(200)
        .then(({ body }) => {
          const { entries } = body;
          expect(entries).toHaveLength(5);
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
    test("200: Respond with a single entry object", () => {
      const token = generateToken("test@tarotmail.com ", 1);
      return request(app)
        .get("/api/entries/5")
        .set({ Authorization: `bearer ${token}` })
        .expect(200)
        .then(({ body }) => {
          const { entries } = body;
          expect(entries[0]).toEqual(
            expect.objectContaining({
              user_id: 1,
              entry_body: "Not Excellent. Goat Ice Cream",
              created_at: expect.any(String),
              tarot_card_id: [
                { id: 41, isLight: true, readingStyle: "Strengths" },
                { id: 36, isLight: false, readingStyle: "Weaknesses" },
                { id: 45, isLight: true, readingStyle: "Growth" },
              ],
              intention: "Nuffin",
            })
          );
        });
    });
  }); // End of "GET /api/entries/:entry_id

  describe("POST /api/entry", () => {
    
    test.only("200: Respond with a single entry object", () => {
      const reqBody = {
        intention: "What a Good Date",
        entry_body: "hahahah hehehhe yayaya",
        tarot_card_id: [
          { id: 41, isLight: true, readingStyle: "Strengths" },
          { id: 36, isLight: false, readingStyle: "Weaknesses" },
          { id: 45, isLight: true, readingStyle: "Growth" },
        ],
      };
      const token = generateToken("test@tarotmail.com", 1);
      return request(app)
        .post("/api/entries")
        .set({ Authorization: `bearer ${token}` })
        .send(reqBody)
        .expect(201)
        .then(({ body }) => {
          const { entries } = body;
          expect(entries[0]).toEqual(
            expect.objectContaining({
              user_id: 1,
              entry_body: "hahahah hehehhe yayaya",
              created_at: expect.any(String),
              tarot_card_id: [
                { id: 41, isLight: true, readingStyle: "Strengths" },
                { id: 36, isLight: false, readingStyle: "Weaknesses" },
                { id: 45, isLight: true, readingStyle: "Growth" },
              ],
              intention: "What a Good Date",
            })
          );
        });
    });
  }); // End of "POST /api/entries/:entry_id
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

    test("422: Return 'Email Already in Use' is email duplicate ", () => {
      const reqBody = {
        username: "this is username",
        email: "test@hottymail.com",
        password: "thisispassword",
      };
      return request(app)
        .post("/api/auth/signup")
        .send(reqBody)
        .expect(422)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe("Email Already in Use");
        });
    });

    test("422: Return 'Email Invalid' if email is empty ", () => {
      const reqBody = {
        username: "this is username",
        email: "   ",
        password: "thisispassword",
      };
      return request(app)
        .post("/api/auth/signup")
        .send(reqBody)
        .expect(422)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe("Email Invalid");
        });
    });

    test("422: Return 'Email Invalid' if Email format not valid ", () => {
      const reqBody = {
        username: "this is username",
        email: "123@.com",
        password: "thisispassword",
      };
      return request(app)
        .post("/api/auth/signup")
        .send(reqBody)
        .expect(422)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe("Email Invalid");
        });
    });

    test("422: Return 'Username Empty' if username input is empty ", () => {
      const reqBody = {
        username: "",
        email: "123456@gmail.com",
        password: "thisispassword",
      };
      return request(app)
        .post("/api/auth/signup")
        .send(reqBody)
        .expect(422)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe("Username Empty");
        });
    });
    test("422: Return 'Invalid Value' if username too long (> 30 cahracters) ", () => {
      const reqBody = {
        username:
          "asfasfasfasfasfasfasfasfasfasfasfasfasfasfasfasfasfasfasfasfasfasf",
        email: "123456@gmail.com",
        password: "thisispassword",
      };
      return request(app)
        .post("/api/auth/signup")
        .send(reqBody)
        .expect(422)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe("Invalid value");
        });
    });

    test("422: Return 'Password Empty' if password input is empty ", () => {
      const reqBody = {
        username: "sfdsafasdadf",
        email: "123456@gmail.com",
        password: "",
      };
      return request(app)
        .post("/api/auth/signup")
        .send(reqBody)
        .expect(422)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe("Password Empty");
        });
    });

    test("422: Return 'Invalid Value' if password too long (> 30 cahracters) ", () => {
      const reqBody = {
        username: "kjkljkljklk",
        email: "123456@gmail.com",
        password:
          "asfasfasfasfasfasfasfasfasfasfasfasfasfasfasfasfasfasfasfasfasfasf",
      };
      return request(app)
        .post("/api/auth/signup")
        .send(reqBody)
        .expect(422)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe("Invalid value");
        });
    });

    test("422: Return 'Username Invalid' if password too short ( < 6 cahracters) ", () => {
      const reqBody = {
        username: "fasdfsadfadsf",
        email: "123456@gmail.com",
        password: "thd",
      };
      return request(app)
        .post("/api/auth/signup")
        .send(reqBody)
        .expect(422)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe("Invalid value");
        });
    });
  }); // End of Sign In

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


  // Login In Testing
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


    test("422: Return 'Email Not Found' if no such email in db ", () => {
      const reqBody = {
        username: "fasdfsadfadsf",
        email: "aff@gmail.com",
        password: "thd",
      };
      return request(app)
        .post("/api/auth/login")
        .send(reqBody)
        .expect(422)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe("Email Not Found");
        });
    });

    test("422: Return 'Email Invalid' if email format not correct ", () => {
      const reqBody = {
        username: "fasdfsadfadsf",
        email: "aff@ -gmailcom",
        password: "thd",
      };
      return request(app)
        .post("/api/auth/login")
        .send(reqBody)
        .expect(422)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe("Email Invalid");
        });
    });

  


    test("422: Return 'Password Empty' if password input is empty ", () => {
      const reqBody = {
        username: "sfdsafasdadf",
        email: "test@tarotmail.com",
        password: "",
      };
      return request(app)
        .post("/api/auth/login")
        .send(reqBody)
        .expect(422)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe("Password Empty");
        });
    });
  }); // End of Login

}); // End of Testing Authentication



describe("Middleware - is-Auth", () => {

  describe("JWT Token Validation", () => {
    test.skip("GET/ api/users/ - show all if jwt valid (for admin use only)", () => {
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

    test("Return false /true if user(email) not exist / exist", () => {
      checkIfUserExist("test@hottymail.com").then((exist) => {
        expect(exist).toBe(true);
      });
      checkIfUserExist("test@hottym----ail.com").then((exist) => {
        expect(exist).toBe(false);
      });
    });
  }); // end of testing JWT Token Validation
});// End of Testing Middleware