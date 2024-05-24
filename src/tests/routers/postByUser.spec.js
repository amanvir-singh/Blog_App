const request = require("supertest");
const app = require("../../app");
const { db,createUsersTable,deleteTable, createPostsTable } =require ("../../../db");

describe("PostbyUser Routes", () => {

    beforeAll(async () => {
      //Creates a new users table before running the tests
      createUsersTable();
      createPostsTable();
    });
  
    afterAll(async () => {
      // Drop the users table after running the tests
      deleteTable("users");
      deleteTable("posts");
    });

    describe("GET /postByUser/:username", () => {
        it("should return the posts by username", async () => {
            //Adding 2 new users
            const newUser = {
                username: "Charlie123",
                email: "Charlie@gmail.com",
                password: "Password123",
              };
              
                const response = await request(app)
                    .post("/users")
                    .send(newUser)
            
                const newUser2 = {
                  username: "Charlie2",
                  email: "Charlie2@gmail.com",
                  password: "Password123",
                };
                    
                const response2 = await request(app)
                  .post("/users")
                  .send(newUser2)
            //Adding Mock posts for both users
            const newPost1 = {
              title: "This is a post",
              content: "This is my post.",
              user_id: response.body.id,
            };
          
            const response_post1 = await request(app)
                .post("/posts")
                .send(newPost1)


            const newPost2 = {
                title: "This is my Second post",
                content: "This is my second post.",
                user_id: response.body.id,
            };
            console.log("ID in Test->>>>>",response.body.id)
              
            const response_post2 = await request(app)
                .post("/posts")
                .send(newPost2)

            const newPost3 = {
                title: "This is a test post",
                content: "This is test post.",
                user_id: response2.body.id,
            };
                
            const response_post3 = await request(app)
                .post("/posts")
                .send(newPost3)
            //Retrieving posts by username

            const response_100 = await request(app).get("/posts");
            console.log(response_100.body)
        const response_1 = await request(app).get(`/postByUser/${newUser.username}`);
        //console.log(response_1.body)
        expect(response_1.status).toBe(200);
        
       
    
        });
    
      });

});