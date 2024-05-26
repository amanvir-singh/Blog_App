const request = require("supertest");
const app = require("../../app");
const utils = require('../utils');


describe("Posts Routes", () => {

  describe("GET /posts/all", () => {
    const mockPosts =[
      {title: "First Post", content: "Hi, This is my first post", user_id: 4},
      {title: "Second Post", content: "Hi, This is my second post by other user", user_id: 7},
      {title: "Tips to improve health", content: "Follow the given steps to improve health", user_id: 3}
    ];
    beforeEach(async () => {
      await utils.initializeDB();
      await utils.disableForeignKey();
      await utils.addToDB(
          'posts', 
          ['title', 'content', 'user_id'], 
          mockPosts
      );
    });

    test("should return all posts added", async () => {  
      const response = await request(app).get("/posts/all");
      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({posts: mockPosts});
    });
  });

  describe("GET /posts/id/:id", () => {
    beforeEach(async () => {
      await utils.initializeDB();
    });
    test("should return the post by ID", async () => {
        //Adding a new post
        const dummyPost = {
            title: "Tips to improve health",
            content: "Follow the given steps to improve health",
            user_id: 3,
        };
      const response = await request(app).post("/posts/create").send(dummyPost);

      //Retrieving Post by ID
      id = response.body.post.lastInsertRowid;
      const response_1 = await request(app).get(`/posts/id/${id}`);
      expect(response_1.status).toBe(200);
      expect(response_1.body).toMatchObject(dummyPost);
    });
  });


  describe("POST /posts/create", () => {
    beforeEach(async () => {
      await utils.initializeDB();
    });
    test("should create a new post", async () => {
       const newPost = {
          title: "This is a post",
          content: "This is my post.",
          user_id: 45,
      };
      const response = await request(app).post("/posts/create").send(newPost)
      const dbPost = await utils.getRecordFromDB('posts', 'id', response.body.post.lastInsertRowid);
      expect(response.statusCode).toBe(200);
      expect(response.body.post).toHaveProperty("lastInsertRowid");
      expect(dbPost).toMatchObject(newPost); 
    });
  });


  describe('DELETE /posts/delete/:id', () => {
    beforeEach(async () => {
      await utils.initializeDB();
    });
    test('should delete a post by ID', async () => {
        //Adding a new post
        const mockPost = {
            title: "Will Delete Soon",
            content: "This post will be deleted",
            user_id: 3,
          };
          
        const response = await request(app).post("/posts/create").send(mockPost);
        id = response.body.post.lastInsertRowid;

        //Deleting the post
        const deleteResponse = await request(app).delete(`/posts/delete/${id}`).send();
        expect(deleteResponse.status).toBe(200);
        expect(deleteResponse.body.lastInsertRowid).toBe(response.body.post.lastInsertRowid);
    });
  });


  describe('PUT /posts/updateTitle/:id', () => {
    beforeEach(async () => {
      await utils.initializeDB();
    });
    test('should update a post title by ID', async () => {
        //Adding a new post
        const newPost = {
            title: "Please update the title",
            content: "This is content",
            user_id: 53,
          }; 
        const response = await request(app).post("/posts/create").send(newPost)
        
        //Updating the post title
        id = response.body.post.lastInsertRowid;
        const updateResponse = await request(app).put(`/posts/updateTitle/${id}`).send({title:"This is the updated title"});
        const dbPost = await utils.getRecordFromDB('posts', 'id', id);
        expect(updateResponse.status).toBe(200);
        expect(dbPost.title).toBe("This is the updated title");
    });
  });


  describe('PUT /posts/updateContent/:id', () => {
    beforeEach(async () => {
      await utils.initializeDB();
    });
    test('should update a post content by ID', async () => {
        //Adding a new post
        const newPost = {
            title: "Please update the content",
            content: "Will be updated soon",
            user_id: 10,
          }; 
        const response = await request(app).post("/posts/create").send(newPost)
        
        //Updating the post content
        id = response.body.post.lastInsertRowid;
        const updateResponse = await request(app).put(`/posts/updateContent/${id}`).send({content:"This is the updated content."});
        const dbPost = await utils.getRecordFromDB('posts', 'id', id);
        expect(updateResponse.status).toBe(200);
        expect(dbPost.content).toBe("This is the updated content.");      
    });
  });

  describe("GET /posts/user/:username", () => {
    beforeEach(async () => {
      await utils.initializeDB();
    });
      test("should return the posts by username", async () => {
          //Adding 2 new users
          const newUser = {username: "Charlie123",email: "Charlie@gmail.com",password: "Password123"};
          const newUser2 = {username: "Charlie2", email: "Charlie2@gmail.com", password: "Password123"}; 
            
          const response = await request(app).post("/users/create").send(newUser);
          const response2 = await request(app).post("/users/create").send(newUser2);

          //Adding Mock posts for both users
          const newPost1 = {title: "This is a post",content: "This is my post.",user_id: response.body.user.lastInsertRowid};
          const newPost2 = {title: "This is my Second post", content: "This is my second post.", user_id: response.body.user.lastInsertRowid};
          const newPost3 = {title: "This is a test post", content: "This is test post.", user_id: response2.body.user.lastInsertRowid};
        
          const response_post1 = await request(app).post("/posts/create").send(newPost1);
          const response_post2 = await request(app).post("/posts/create").send(newPost2);
          const response_post3 = await request(app).post("/posts/create").send(newPost3);

          //Retrieving posts by username
          const responsePosts = await request(app).get(`/posts/user/${newUser.username}`);
          expect(responsePosts.status).toBe(200);
          expect(responsePosts.body[0]).toMatchObject(newPost1);
          expect(responsePosts.body[1]).toMatchObject(newPost2);

        });
    });

});