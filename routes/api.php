<?php

use App\Http\Controllers\Api\EmployeeController;
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
