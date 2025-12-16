const Task = require('../../models/Task');
const express = require('express');
const router = require('../../routes/tasks');

// Mock Mongoose
jest.mock('../../models/Task');

describe('Tasks Routes - Unit Tests', () => {

    let req;
    let res;
    let next;

    beforeEach(() => {
        req = {};
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };
        next = jest.fn();
        jest.clearAllMocks();
    });


    /////////
    // GET //
    /////////

    test('GET / should return all tasks', async () => {
        const mockTasks = [{title: 'Task A'}, {title: 'Task B'}];
        Task.find.mockResolvedValue(mockTasks);

        // On récupère la fonction du router
        const getRoute = router.stack.find(r => r.route?.path === '/' && r.route.methods.get).route.stack[0].handle;

        await getRoute(req, res, next);

        expect(Task.find).toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith(mockTasks);
    });

    //////////
    // POST //
    //////////

    test('POST / should create a new task', async () => {
        const newTaskData = { title: 'New Task', status: 'To Do' };
        req.body = newTaskData;

        // Mock du constructeur Task
        const mockTaskInstance = {
            ...newTaskData,
            save: jest.fn().mockResolvedValue()
        };
        Task.mockImplementation(() => mockTaskInstance);

        const postRoute = router.stack.find(r => r.route?.path === '/' && r.route.methods.post).route.stack[0].handle;

        await postRoute(req, res, next);

        expect(Task).toHaveBeenCalledWith(newTaskData);
        expect(mockTaskInstance.save).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(mockTaskInstance);
    });


    test('POST / should return 400 for validation error', async () => {
        const req = { body: { title: 'Bad Task', status: 'INVALID' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };

        const error = new Error('Validation error');
        error.name = 'ValidationError';

        // Mock du constructeur Task
        Task.mockImplementation(() => ({
            save: jest.fn().mockRejectedValue(error)
        }));

        const postRoute = router.stack.find(r => r.route?.path === '/' && r.route.methods.post).route.stack[0].handle;

        await postRoute(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: 'Invalid status value',
            details: error.message
        });
    });

    //////////////
    // PUT /:id //
    //////////////
    test('PUT /:id should update a task', async () => {
        req.params = { id: '123' };
        req.body = { status: 'Done' };

        const updatedTask = { _id: '123', title: 'Task A', status: 'Done' };
        Task.findByIdAndUpdate.mockResolvedValue(updatedTask);

        const putRoute = router.stack.find(r => r.route?.path === '/:id' && r.route.methods.put).route.stack[0].handle;

        await putRoute(req, res, next);

        expect(Task.findByIdAndUpdate).toHaveBeenCalledWith('123', { status: 'Done' }, { new: true, runValidators: true });
        expect(res.json).toHaveBeenCalledWith(updatedTask);
    });

    test('PUT /:id should return 404 if task not found', async () => {
        req.params = { id: '123' };
        req.body = { status: 'Done' };

        Task.findByIdAndUpdate.mockResolvedValue(null);

        const putRoute = router.stack.find(r => r.route?.path === '/:id' && r.route.methods.put).route.stack[0].handle;

        await putRoute(req, res, next);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'Task not found' });
    });

    /////////////////
    // DELETE /:id //
    /////////////////

    test('DELETE /:id should delete task', async () => {
        req.params = { id: '123' };

        Task.findByIdAndDelete.mockResolvedValue({});

        const deleteRoute = router.stack.find(r => r.route?.path === '/:id' && r.route.methods.delete).route.stack[0].handle;

        await deleteRoute(req, res, next);

        expect(Task.findByIdAndDelete).toHaveBeenCalledWith('123');
        expect(res.json).toHaveBeenCalledWith({ message: 'Task deleted' });
    });

});