const request = require("supertest");
const app = require("../../app");
const utils = require('../utils');


describe("Comment Routes", () => {

  describe("GET /comments/all", () => {
    const mockComments =[
      {content: "Helpful blog", user_id: 2, post_id: 23},
      {content: "Should give a try!", user_id: 3, post_id: 4},
      {content: "Beautiful Day", user_id: 7, post_id: 3,}
    ];
    beforeEach(async () => {
      await utils.initializeDB();
      await utils.disableForeignKey();
      await utils.addToDB(
          'comments', 
          ['content', 'user_id', 'post_id'], 
          mockComments
      );
    });
    test("should return all comments added", async () => {
      const response = await request(app).get("/comments/all");
      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({comments: mockComments});
    });
  });

  describe("GET /comments/id/:id", () => {
    beforeEach(async () => {
      await utils.initializeDB();
    });
    test("should return the comment by ID", async () => {
      //Adding a new comment
      const mockComment = {
        content: "Beautiful Day",
        user_id: 7,
        post_id: 3,
      }; 
      const response = await request(app).post("/comments/create").send(mockComment);

      //Retrieving Comment by ID
      id = response.body.comment.lastInsertRowid;
      const response_1 = await request(app).get(`/comments/id/${id}`);
      expect(response_1.status).toBe(200);
      expect(response_1.body).toMatchObject(mockComment);
    });
  });


  describe("POST /comments/create", () => {
    beforeEach(async () => {
      await utils.initializeDB();
    });
    test("should create a new comment", async () => {
       const newComment = {
          content: "How to do this?",
          user_id: 3,
          post_id: 45,
      };
      const response = await request(app).post("/comments/create").send(newComment)
        
      const dbComment = await utils.getRecordFromDB('comments', 'id', response.body.comment.lastInsertRowid);
      expect(response.statusCode).toBe(200);
      expect(response.body.comment).toHaveProperty("lastInsertRowid");
      expect(dbComment).toMatchObject(newComment);   
    });
  });

  describe('DELETE /comments/delete/:id', () => {
    beforeEach(async () => {
      await utils.initializeDB();
    });
    test('should delete a comment by ID', async () => {
        //Adding a new comment
        const dummyComment = {
            content: "How are you?",
            user_id: 24,
            post_id: 3,
          }; 
        const response = await request(app).post("/comments/create").send(dummyComment);

        //Deleting the comment
        id = response.body.comment.lastInsertRowid;
        const deleteResponse = await request(app).delete(`/comments/delete/${id}`).send();
        expect(deleteResponse.status).toBe(200);
        expect(deleteResponse.body.lastInsertRowid).toBe(response.body.comment.lastInsertRowid);
    });
  })

  describe('PUT /comments/updateContent/:id', () => {
    beforeEach(async () => {
      await utils.initializeDB();
    });
    test('should update a comment content by ID', async () => {
        //Adding a new comment
        const newComment = {
            content: "Nice Blog",
            user_id: "10",
            post_id: "53",
          };
          
        const response = await request(app).post("/comments/create").send(newComment);
        
        //Updating the comment
        id = response.body.comment.lastInsertRowid;
        const updateResponse = await request(app).put(`/comments/updateContent/${id}`).send({content:"I love your Blogs."});
        const dbComment = await utils.getRecordFromDB('comments', 'id', id);
        expect(updateResponse.status).toBe(200);
        expect(dbComment.content).toBe("I love your Blogs.");      
    });
 });

 describe("GET /comments/user/:username", () => {
  beforeEach(async () => {
    await utils.initializeDB();
  });
    test("should return the comments by username", async () => {
        //Adding 2 new users
        const newUser = {username: "Michael1",email: "Michael@gmail.com",password: "Password123"};
        const newUser2 = {username: "Charlie2", email: "Charlie2@gmail.com", password: "Password123"}; 
          
        const response = await request(app).post("/users/create").send(newUser);
        const response2 = await request(app).post("/users/create").send(newUser2);

        //Adding Mock comments for both users
        const newComment1 = {content: "This is my first comment.",user_id: response.body.user.lastInsertRowid, post_id:45};
        const newComment2 = {content: "This is my second comment.", user_id: response.body.user.lastInsertRowid, post_id: 3};
        const newComment3 = {content: "This is a test comment.", user_id: response2.body.user.lastInsertRowid, post_id: 56};
      
        const response_comment1 = await request(app).post("/comments/create").send(newComment1);
        const response_comment2 = await request(app).post("/comments/create").send(newComment2);
        const response_comment3 = await request(app).post("/comments/create").send(newComment3);

        //Retrieving comments by username
        const responseComments = await request(app).get(`/comments/user/${newUser.username}`);
        expect(responseComments.status).toBe(200);
        expect(responseComments.body[0]).toMatchObject(newComment1);
        expect(responseComments.body[1]).toMatchObject(newComment2);

      });
  });

  describe("GET /comments/post/:id", () => {
    beforeEach(async () => {
      await utils.initializeDB();
    });
      test("should return the comments by post id", async () => {
          //Adding 2 new users
          const dummyPost1 = {title:"This is a post.", content: "This post contains health tips", user_id:4};
          const dummyPost2 = {title:"Study Tips", content:"Here are the tips for studying.", user_id: 57}; 
            
          const response = await request(app).post("/posts/create").send(dummyPost1);
          const response2 = await request(app).post("/posts/create").send(dummyPost2);
  
          //Adding Mock comments for both users
          const newComment1 = {content: "This is my first comment.",user_id:45, post_id: response.body.post.lastInsertRowid};
          const newComment2 = {content: "This is my second comment.", user_id:3, post_id: response.body.post.lastInsertRowid};
          const newComment3 = {content: "This is a test comment.", user_id:56, post_id: response2.body.post.lastInsertRowid};
        
          const response_comment1 = await request(app).post("/comments/create").send(newComment1);
          const response_comment2 = await request(app).post("/comments/create").send(newComment2);
          const response_comment3 = await request(app).post("/comments/create").send(newComment3);
  
          //Retrieving comments by Post ID
          const responseComments = await request(app).get(`/comments/post/${response.body.post.lastInsertRowid}`);
          expect(responseComments.status).toBe(200);
          expect(responseComments.body[0]).toMatchObject(newComment1);
          expect(responseComments.body[1]).toMatchObject(newComment2);
  
        });
    });
  

});