const request = require("supertest");
const app = require("../../app");
const { db,createCommentsTable,deleteTable } =require ("../../../db");


describe("Comment Routes", () => {
  beforeAll(async () => {
  
    //Deletes and Creates a new comments table before running the tests
    deleteTable("comments");
    createCommentsTable();
  });

  afterAll(async () => {
    // Drop the comments table after running the tests
    deleteTable("comments");
  });

  describe("GET /comments", () => {


    it("should return all comments added", async () => {
        //Adding first comment
        await request(app)
            .post("/comments")
            .send({content: "Helpful blog",
            user_id: 2,
            post_id: 23})
        //Adding second comment
        await request(app)
            .post("/comments")
            .send({content: "Should give a try!",
            user_id: 3,
            post_id: 4})
        
        const response = await request(app).get("/comments");

        expect(response.status).toBe(200);
        expect(response.body[0].content).toEqual("Helpful blog");
        expect(response.body[0].user_id).toEqual(2);
        expect(response.body[0].post_id).toEqual(23);
        expect(response.body[1].content).toEqual("Should give a try!");
        expect(response.body[1].user_id).toEqual(3);
        expect(response.body[1].post_id).toEqual(4);

    });

  });

  describe("GET /comments/:id", () => {
    it("should return the comment by ID", async () => {
        //Adding a new comment
        const newComment = {
            content: "Beautiful Day",
            user_id: 7,
            post_id: 3,
          };
          
            const response = await request(app)
                .post("/comments")
                .send(newComment)
        //Retrieving Comment by ID
      id = response.body.id;
      const response_1 = await request(app).get(`/comments/${id}`);
      expect(response_1.status).toBe(200);
      expect(response_1.body.content).toBe(newComment.content);
      expect(response_1.body.user_id).toBe(newComment.user_id);
      expect(response_1.body.post_id).toBe(newComment.post_id);

    });

  });

  describe("POST /comments/:id", () => {
    it("should create a new comment", async () => {
       const newComment = {
          content: "How to do this?",
          user_id: 3,
          post_id: 45,
      };
      

        const response = await request(app)
            .post("/comments")
            .send(newComment)
        
        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty("id");
        expect(response.body.content).toBe(newComment.content);
        expect(response.body.user_id).toBe(newComment.user_id);
        expect(response.body.post_id).toBe(newComment.post_id);
       
    });

  });
  describe('DELETE /comments/:id', () => {
    it('should delete a comment by ID', async () => {
        //Adding a new comment
        const newComment = {
            content: "How are you?",
            user_id: 24,
            post_id: 3,
          };
          
            const response = await request(app)
                .post("/comments")
                .send(newComment)
                //Deleting the comment
            const deleteResponse = await request(app)
            .delete(`/comments/${response.body.id}`)
            .send();
            expect(deleteResponse.status).toBe(204);
    });
  })
  describe('UPDATE /comments/:id', () => {
    it('should update a comment by ID', async () => {
        //Adding a new comment
        const newComment = {
            content: "George123",
            user_id: "10",
            post_id: "53",
          };
          
            const response = await request(app)
                .post("/comments")
                .send(newComment)
        
                //Updating the comment
            const updateResponse = await request(app)
            .put(`/comments/${response.body.id}`)
            .send({content:"Updated Content"});

            expect(updateResponse.status).toBe(200);
            expect(updateResponse.body.content).toBe("Updated Content")
            expect(updateResponse.body.message).toBe("Comment updated successfully")
            
    });
  })
});