<?php

use App\Http\Controllers\Api\EmployeeController;
use App\Http\Controllers\Api\TaskController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::group([
    "prefix" => "employee"
], function() {
    Route::get("/", [EmployeeController::class, "index"]);
    Route::get("/{id}/show", [EmployeeController::class, "show"]);
    Route::post("/store", [EmployeeController::class, "store"]);
    Route::put("/{id}/update", [EmployeeController::class, "update"]);
    Route::delete("/{id}/destroy", [EmployeeController::class, "destroy"]);
});

Route::group([
    "prefix" => "task"
], function() {
    Route::get("/", [TaskController::class, "index"]);
    Route::post("/store", [TaskController::class, "store"]);
    Route::get("/{id}/show", [TaskController::class, "show"]);
    Route::put("/{id}/update", [TaskController::class, "update"]);
    Route::delete("/{id}/destroy", [TaskController::class, "destroy"]);
});
