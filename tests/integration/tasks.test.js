const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../../app");
const Task = require("../../models/Task");

let mongoServer;

//on lance une base Mongo en mémoire avant les tests
beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
});

//on nettoie la base avant chaque test
beforeEach(async () => {
    await Task.deleteMany({});
});

// on ferme proprement après tous les tests
afterAll(async () => {
    await mongoose.connection.close();
    await mongoServer.stop();
});

////////////////////////////
// TEST 1 : GET ALL TASKS //
////////////////////////////
test("GET /api/tasks returns empty array", async () => {
    const res = await request(app).get("/api/tasks");

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
});

//////////////////////////
// TEST 2 : CREATE TASK //
//////////////////////////
test("POST /api/tasks creates a new task", async () => {
    const newTask = {
        title: "Unit Test Task",
        description: "Testing creation",
        status: "To Do"
    };

    const res = await request(app).post("/api/tasks").send(newTask);

    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe("Unit Test Task");
});

//////////////////////////////////////////
// TEST 3 : VALIDATION - INVALID STATUS //
//////////////////////////////////////////
test("POST /api/tasks returns 400 for invalid status", async () => {
    const res = await request(app).post("/api/tasks").send({
        title: "Bad status",
        description: "Invalid",
        status: "INVALID_STATUS"
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("Invalid status value");
});

//////////////////////////
// TEST 4 : UPDATE TASK //
//////////////////////////
test("PUT /api/tasks/:id updates a task", async () => {
    const task = await Task.create({
        title: "Task A",
        description: "Test",
        status: "To Do"
    });

    const res = await request(app)
        .put(`/api/tasks/${task._id}`)
        .send({ status: "Done" });

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("Done");
});

//////////////////////////
// TEST 5 : DELETE TASK //
//////////////////////////
test("DELETE /api/tasks/:id deletes a task", async () => {
    const task = await Task.create({
        title: "Delete me",
        description: "To be deleted",
        status: "To Do"
    });

    const res = await request(app).delete(`/api/tasks/${task._id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Task deleted");

    const check = await Task.findById(task._id);
    expect(check).toBeNull();
});