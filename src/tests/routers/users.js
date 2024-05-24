const request = require("supertest");
const app = require("../../app");
const { db,createUsersTable,deleteTable } =require ("../../../db");


describe("User Routes", () => {
  beforeAll(async () => {
    //Deletes and Creates a new users table before running the tests
    deleteTable("users");
    createUsersTable();
  });

  afterAll(async () => {
    // Drop the users table after running the tests
    deleteTable("users");
  });

  describe("GET /users", () => {
    
    it("should return all users added", async () => {
        //Adding first user
        await request(app)
            .post("/users")
            .send({username: "Michael123",
            email: "Michael@gmail.com",
            password: "Password123"})
        //Adding second user
        await request(app)
            .post("/users")
            .send({username: "James123",
            email: "James@gmail.com",
            password: "Password123"})
        
        const response = await request(app).get("/users");
        expect(response.status).toBe(200);
        expect(response.body[0].id).toEqual(1);
        expect(response.body[0].username).toEqual("Michael123");
        expect(response.body[0].email).toEqual("Michael@gmail.com");
        expect(response.body[0].password).toEqual("Password123");
        expect(response.body[1].id).toEqual(2);
        expect(response.body[1].username).toEqual("James123");
        expect(response.body[1].email).toEqual("James@gmail.com");
        expect(response.body[1].password).toEqual("Password123");
    });

  });

  describe("GET /users/:id", () => {
    it("should return the user by ID", async () => {
        //Adding a new user
        const newUser = {
            username: "Richard123",
            email: "Richard@gmail.com",
            password: "Password123",
          };
          
            const response = await request(app)
                .post("/users")
                .send(newUser)
        //Retrieving User by ID
      id = response.body.id;
      const response_1 = await request(app).get(`/users/${id}`);
      expect(response_1.status).toBe(200);
      expect(response_1.body.username).toBe(newUser.username);
      expect(response_1.body.email).toBe(newUser.email);
      expect(response_1.body.password).toBe(newUser.password);

    });

  });

  describe("POST /users/:id", () => {
    it("should create a new user", async () => {
      const newUser = {
        username: "John123",
        email: "john@gmail.com",
        password: "Password123"
      };
      

        const response = await request(app)
            .post("/users")
            .send(newUser)
        
        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty("id");
        expect(response.body.username).toBe(newUser.username);
        expect(response.body.email).toBe(newUser.email);
        expect(response.body.password).toBe(newUser.password);
       
    });

  });
  describe('DELETE /users/:id', () => {
    it('should delete a user by ID', async () => {
        //Adding a new user
        const newUser = {
            username: "John123",
            email: "john@gmail.com",
            password: "Password123",
          };
          
            const response = await request(app)
                .post("/users")
                .send(newUser)
        
                //Deleting the user
            const deleteResponse = await request(app)
            .delete(`/users/${response.id}`)
            .send();
            expect(deleteResponse.status).toBe(204);
    });
  })
  describe('UPDATE /users/:id', () => {
    it('should update a user by ID', async () => {
        //Adding a new user
        const newUser = {
            username: "George123",
            email: "George@gmail.com",
            password: "Password123",
          };
          
            const response = await request(app)
                .post("/users")
                .send(newUser)
        
                //Updating the user
            const updateResponse = await request(app)
            .put(`/users/${response.body.id}`)
            .send({username:"GeorgeUpdated"});

            expect(updateResponse.status).toBe(200);
            expect(updateResponse.body.username).toBe("GeorgeUpdated")
            expect(updateResponse.body.message).toBe("User updated successfully")
            
    });
  })
});