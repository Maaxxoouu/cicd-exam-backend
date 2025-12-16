const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../../app");

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
});

beforeEach(async () => {
    await mongoose.connection.db.dropDatabase();
});

afterAll(async () => {
    await mongoose.connection.close();
    await mongoServer.stop();
});

// SCÉNARIO E2E
describe("E2E - Task Lifecycle Scenario", () => {

    test("Scenario: User manages a task from creation to deletion", async () => {
        // ÉTAPE 1 : L'utilisateur crée une tâche
        const newTask = {
            title: "E2E Task",
            description: "Task for full lifecycle test",
            status: "To Do"
        };

        const createRes = await request(app)
            .post("/api/tasks")
            .send(newTask);

        expect(createRes.statusCode).toBe(201);
        const taskId = createRes.body._id;
        expect(taskId).toBeDefined();
        expect(createRes.body.status).toBe("To Do");

        // ÉTAPE 2 : L'utilisateur déplace la tâche dans "In Progress"
        const updateRes1 = await request(app)
            .put(`/api/tasks/${taskId}`)
            .send({ status: "In Progress" });

        expect(updateRes1.statusCode).toBe(200);
        expect(updateRes1.body.status).toBe("In Progress");

        // ÉTAPE 3 : L'utilisateur termine la tâche
        const updateRes2 = await request(app)
            .put(`/api/tasks/${taskId}`)
            .send({ status: "Done" });

        expect(updateRes2.statusCode).toBe(200);
        expect(updateRes2.body.status).toBe("Done");

        // ÉTAPE 4 : L'utilisateur vérifie sa liste de tâches pour voir si elle est bien là
        const listRes = await request(app).get("/api/tasks");

        expect(listRes.statusCode).toBe(200);
        expect(Array.isArray(listRes.body)).toBeTruthy();

        const foundTask = listRes.body.find(t => t._id === taskId);
        expect(foundTask).toBeDefined();
        expect(foundTask.title).toBe("E2E Task");
        expect(foundTask.status).toBe("Done"); // Elle doit bien être finie

        // ÉTAPE 5 : L'utilisateur supprime la tâche
        const deleteRes = await request(app).delete(`/api/tasks/${taskId}`);
        expect(deleteRes.statusCode).toBe(200);

        // ÉTAPE 6 : Vérification finale que la tâche n'existe plus
        const checkRes = await request(app).get("/api/tasks");
        const deletedTask = checkRes.body.find(t => t._id === taskId);
        expect(deletedTask).toBeUndefined();
    });
});