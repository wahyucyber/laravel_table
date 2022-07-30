<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Validator;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $employee_id = $request->employee_id;
        $name = $request->name;

        $tasks = Task::latest()->with("employee");

        if ($employee_id) {
            $tasks->where("employee_id", $employee_id);
        }

        if ($name) {
            $tasks->where("name", "%$name%");
        }

        return Response::json($tasks);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validation = Validator::make($request->all(), [
            "employee_id" => "required|exists:employees,id",
            "name" => "required|max:255",
            "description" => "nullable",
            "done" => "nullable|in:true,false"
        ]);

        if ($validation->fails()) {
            return Response::json([
                "status" => false,
                "message" => $validation->errors(),
                "data" => []
            ], 400);
        }

        $post = $request->all();

        $id = Task::create($post)->id;

        return Response::json([
            "status" => true,
            "message" => "success.",
            "data" => [
                "id" => (int) $id
            ]
        ], 200);
    }

    public function show($id)
    {
        $task = Task::where("id", $id)->first();

        if ($task == null) {
            return Response::json([
                "status" => false,
                "message" => "Task not found.",
                "data" => []
            ], 404);
        }

        return Response::json([
            "status" => true,
            "message" => "success.",
            "data" => $task
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $validation = Validator::make($request->all(), [
            "employee_id" => "required|exists:employees,id",
            "name" => "required|max:255",
            "description" => "nullable",
            "done" => "nullable|in:true,false"
        ]);

        $task = Task::where("id", $id)->first();

        if ($task == null) {
            return Response::json([
                "status" => false,
                "message" => "Task not found.",
                "data" => []
            ], 404);
        }

        if ($validation->fails()) {
            return Response::json([
                "status" => false,
                "message" => $validation->errors(),
                "data" => []
            ], 400);
        }

        $put = $request->all();

        $task->update($put);

        return Response::json([
            "status" => true,
            "message" => "success.",
            "data" => [
                "id" => (int) $id
            ]
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $task = Task::where("id", $id)->first();

        if ($task == null) {
            return Response::json([
                "status" => false,
                "message" => "Task not found.",
                "data" => []
            ], 404);
        }

        $task->delete();

        return Response::json([
            "status" => true,
            "message" => "success.",
            "data" => [
                "id" => (int) $id
            ]
        ], 200);
    }
}
