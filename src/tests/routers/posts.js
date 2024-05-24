const request = require("supertest");
const app = require("../../app");
const { db,createPostsTable,deleteTable } =require ("../../../db");


describe("Posts Routes", () => {
  beforeAll(async () => {

    //Deletes and Creates a new posts table before running the tests
    deleteTable("posts");
    createPostsTable();
  });

  afterAll(async () => {
    // Drop the posts table after running the tests
    deleteTable("posts");
  });

  describe("GET /posts", () => {
    
    it("should return all posts added", async () => {
        //Adding first post
        await request(app)
            .post("/posts")
            .send({title: "First Post",
            content: "Hi, This is my first post",
            user_id: 4})
        //Adding second post
        await request(app)
            .post("/posts")
            .send({title: "Second Post",
            content: "Hi, This is my second post by other user",
            user_id: 7})
        
        const response = await request(app).get("/posts");

        expect(response.status).toBe(200);
        expect(response.body[0].title).toEqual("First Post");
        expect(response.body[0].content).toEqual("Hi, This is my first post");
        expect(response.body[0].user_id).toEqual(4);
        expect(response.body[1].title).toEqual("Second Post");
        expect(response.body[1].content).toEqual("Hi, This is my second post by other user");
        expect(response.body[1].user_id).toEqual(7);

    });

  });

  describe("GET /posts/:id", () => {
  
    it("should return the post by ID", async () => {
        //Adding a new post
        const newPost = {
            title: "Tips to improve health",
            content: "Follow the given steps to improve health",
            user_id: 3,
          };
          
            const response = await request(app)
                .post("/posts")
                .send(newPost)
        //Retrieving Post by ID
      id = response.body.id;
      const response_1 = await request(app).get(`/posts/${id}`);
      expect(response_1.status).toBe(200);
      expect(response_1.body.title).toBe(newPost.title);
      expect(response_1.body.content).toBe(newPost.content);
      expect(response_1.body.user_id).toBe(newPost.user_id);

    });

  });

  describe("POST /posts/:id", () => {
    it("should create a new post", async () => {
       const newPost = {
          title: "This is a post",
          content: "This is my post.",
          user_id: 45,
      };
      

        const response = await request(app)
            .post("/posts")
            .send(newPost)
        
        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty("id");
        expect(response.body.title).toBe(newPost.title);
        expect(response.body.content).toBe(newPost.content);
        expect(response.body.user_id).toBe(newPost.user_id);
       
    });

  });
  describe('DELETE /posts/:id', () => {
    it('should delete a post by ID', async () => {
        //Adding a new post
        const newPost = {
            title: "Will Delete Soon",
            content: "This post will be deleted",
            user_id: 3,
          };
          
            const response = await request(app)
                .post("/posts")
                .send(newPost)
                //Deleting the post
            const deleteResponse = await request(app)
            .delete(`/posts/${response.body.id}`)
            .send();
            expect(deleteResponse.status).toBe(204);
    });
  })
  describe('UPDATE /posts/:id', () => {
    it('should update a post by ID', async () => {
        //Adding a new post
        const newPost = {
            title: "Please update the content",
            content: "Will updated soon",
            user_id: "53",
          };
          
            const response = await request(app)
                .post("/posts")
                .send(newPost)
        
                //Updating the post
            const updateResponse = await request(app)
            .put(`/posts/${response.body.id}`)
            .send({content:"Updated Content"});
            expect(updateResponse.status).toBe(200);
            expect(updateResponse.body.content).toBe("Updated Content")
            expect(updateResponse.body.message).toBe("Post updated successfully")

            
    });
  })
});