const request = require("supertest");
const app = require("../../app");
const utils = require('../utils')


describe("User Routes", () => {

  describe("GET /users/all", () => {
    const mockusers = [
      {username: "Michael123", email: "Michael@gmail.com", password: "Password123"},
      {username: "James123", email: "James@gmail.com", password: "Password123"},
      {username:"Charlie123", email:"charlie@gmail.com", password: "Anything123"}
    ];

    beforeEach(async () => {
      await utils.initializeDB();
      await utils.addToDB(
          'users', 
          ['username', 'email', 'password'], 
          mockusers
      );
    });

    test("should return all users added", async () => {
        
        const response = await request(app).get("/users/all");
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({users: mockusers});
    });

  });

  describe("GET /users/id/:id", () => {
    beforeEach(async () => {
      await utils.initializeDB();
    });
    test("should return the user by ID", async () => {
        //Adding a new user
        const newUser = {username: "Richard123", email: "Richard@gmail.com", password: "Password123",};
        const response = await request(app).post("/users/create").send(newUser);

      //Retrieving User by ID
      id = response.body.user.lastInsertRowid;
      const response_1 = await request(app).get(`/users/id/${id}`);
      expect(response_1.status).toBe(200);
      expect(response_1.body).toMatchObject(newUser);
    });
  });

  describe("POST /users/create", () => {
    beforeEach(async () => {
      await utils.initializeDB();
    });
    test("should create a new user", async () => {
      const newUser = {
        username: "John123",
        email: "john@gmail.com",
        password: "Password123"
      };
      
        const response = await request(app).post("/users/create").send(newUser)
        const dbUser = await utils.getRecordFromDB('users', 'username', newUser.username);
        expect(response.statusCode).toBe(200);
        expect(response.body.user).toHaveProperty("lastInsertRowid");
        expect(dbUser).toMatchObject(newUser);    
    });

  });


  describe('DELETE /users/delete/:id', () => {
    beforeEach(async () => {
      await utils.initializeDB();
    });
    test('should delete a user by ID', async () => {
        //Adding a new user
        const mockUser = {username: "John123", email: "john@gmail.com", password: "Password123",};
        const response = await request(app).post("/users/create").send(mockUser);
        
        id = response.body.user.lastInsertRowid;
        //Deleting the user
        const deleteResponse = await request(app).delete(`/users/delete/${id}`).send();
        expect(deleteResponse.status).toBe(200);
        expect(deleteResponse.body.lastInsertRowid).toBe(response.body.user.lastInsertRowid);
    });
  });


  describe('PUT /users/updateUsername/:id', () => {
    beforeEach(async () => {
      await utils.initializeDB();
    });
    test('should update a username by ID', async () => {
        //Adding a new user
        const newUser = {username: "George123", email: "George@gmail.com", password: "Password123",};
        const response = await request(app).post("/users/create").send(newUser);
        
        id = response.body.user.lastInsertRowid;
        //Updating the username
        const updateResponse = await request(app).put(`/users/updateUsername/${id}`).send({username:"GeorgeUpdated"});
        const dbUser = await utils.getRecordFromDB('users', 'email', newUser.email);
        expect(updateResponse.status).toBe(200);
        expect(dbUser.username).toBe("GeorgeUpdated");
            
    });
  });

  describe('PUT /users/updateEmail/:id', () => {
    beforeEach(async () => {
      await utils.initializeDB();
    });
    test('should update a user email by ID', async () => {
        //Adding a new user
        const newUser = {username: "George123", email: "George@gmail.com", password: "Password123",};
        const response = await request(app).post("/users/create").send(newUser);
        
        id = response.body.user.lastInsertRowid;
        //Updating the user email
        const updateResponse = await request(app).put(`/users/updateEmail/${id}`).send({email:"myemail@gmail.com"});
        const dbUser = await utils.getRecordFromDB('users', 'username', newUser.username);
        expect(updateResponse.status).toBe(200);
        expect(dbUser.email).toBe("myemail@gmail.com");
            
    });
  });

  describe('PUT /users/updatePassword/:id', () => {
    beforeEach(async () => {
      await utils.initializeDB();
    });
    test('should update a user password by ID', async () => {
        //Adding a new user
        const newUser = {username: "Michael567", email: "michael567@gmail.com", password: "itisMichael",};
        const response = await request(app).post("/users/create").send(newUser);
        
        id = response.body.user.lastInsertRowid;
        //Updating the user passowrd
        const updateResponse = await request(app).put(`/users/updatePassword/${id}`).send({password:"mynewPassword"});
        const dbUser = await utils.getRecordFromDB('users', 'username', newUser.username);
        expect(updateResponse.status).toBe(200);
        expect(dbUser.password).toBe("mynewPassword");
            
    });
  });

});