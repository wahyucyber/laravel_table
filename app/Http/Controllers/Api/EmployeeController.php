<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Validator;

class EmployeeController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $name = $request->search;
        $gender = $request->gender;
        $position = $request->position;
        $phone = $request->phone;
        $address = $request->address;
        $email = $request->email;

        $sort = $request->sort;
        $dir = $request->dir;

        $limit = $request->limit ? $request->limit : 10;

        $employee = Employee::whereNotNull('id');

        if ($sort && $dir) {
            $employee->orderBy($sort, $dir);
        }else {
            $employee->latest();
        }

        if ($name) {
            $employee->where("name", "LIKE", "%$name%");
        }

        if ($gender) {
            $employee->where("gender", $gender);
        }

        if ($position) {
            $employee->where("position", "LIKE", "%$position%");
        }

        if ($phone) {
            $employee->where("phone", "LIKE", "%$phone%");
        }

        if ($address) {
            $employee->where("address", "LIKE", "%$address%");
        }

        if ($email) {
            $employee->where("email", "LIKE", "%$email%");
        }

        return Response::json($employee->paginate($limit));
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
            "name" => "required|max:255",
            "gender" => "required|in:Male,Female",
            "position" => "required|max:255",
            "phone" => "required|integer",
            "address" => "required",
            "email" => "required|unique:employees,email"
        ]);

        if ($validation->fails()) {
            return Response::json([
                "status" => false,
                "message" => $validation->errors(),
                "data" => []
            ], 400);
        }

        $post = $request->all();

        $id = Employee::create($post)->id;

        return Response::json([
            "status" => true,
            "message" => "success.",
            "data" => [
                "id" => (int) $id
            ]
        ], 200);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $employee = Employee::where("id", $id)->first();

        if ($employee == null) {
            return Response::json([
                "status" => false,
                "message" => "Employee not found.",
                "data" => []
            ], 404);
        }

        return Response::json([
            "status" => true,
            "message" => "success.",
            "data" => $employee
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
            "name" => "required|max:255",
            "gender" => "required|in:Male,Female",
            "position" => "required|max:255",
            "phone" => "required|integer",
            "address" => "required",
            "email" => "required|unique:employees,email," . $id
        ]);

        $employee = Employee::where("id", $id)->first();

        if ($employee == null) {
            return Response::json([
                "status" => false,
                "message" => "Employee not found.",
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

        $employee->update($put);

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
        $employee = Employee::where("id", $id)->first();

        if ($employee == null) {
            return Response::json([
                "status" => false,
                "message" => "Employee not found.",
                "data" => []
            ], 404);
        }

        $employee->delete();

        return Response::json([
            "status" => true,
            "message" => "success.",
            "data" => $employee
        ], 200);
    }
}
