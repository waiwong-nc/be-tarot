const request = require('supertest');
const app = require("../dist/app").default;
const db = require("../dist/db/connection").default;
const testData = require("../dist/db/data");
const seed = require("../dist/db/seeds/seed")


beforeEach(async () => {
    await seed.default(testData);
});

afterAll((done) => {
  db.end();
  done();
});



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
  
}); // End of "API"
