const request = require('supertest');
const app = require("../dist/app").default;
const db = require("../dist/db/connection").default;
const testData = require("../dist/db/data");
const seed = require("../dist/db/seeds/seed");




beforeEach(async () => {
    await seed.default(testData)
});

afterAll((done) => {
  db.end();
  done();
});

// do login process here
//  ....
//  ....


describe('API',() => {
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

}); // End of "API"


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
    }); // End of Error 404 (GET)

    test('404: Respond with "Not Found" if url path (POST Request) not match', () => {
      return request(app)
        .post("/api/helloworld")
        .expect(404)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe("Not Found");
        });
    }); // End of Error 404 (POST)
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
    }); // End of Error 404 (GET)

    test('22P02: Respond with "Bad Request" if database table not found', () => {
      return request(app)
        .get("/api/error-test/TableNotFound")
        .expect(500)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe("Internal Server Error");
        });
    }); // End of dscribe(500)



  }); // End of Error Handler
});
