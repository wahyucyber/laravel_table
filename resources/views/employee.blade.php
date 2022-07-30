<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0-beta1/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="{{ asset("") }}assets/css/laravel_table.bootstrap-5.2.css">
</head>
<body>

    <div class="container">
        <div class="row d-flex justify-content-center mt-5">
            <div class="col-lg-12">
                <form class="submit-filter">
                    <div class="row mb-3">
                        <div class="col-lg-2">
                            <div class="form-group">
                                <label for="gender" class="form-label">Gender</label>
                                <select name="gender" id="gender" class="form-select form-select-sm gender">
                                    <option value="">Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                            </div>
                        </div>
                        <div class="col-lg-2">
                            <div class="form-group">
                                <label for="position" class="form-label">Position</label>
                                <input type="text" name="position" id="position" class="form-control form-control-sm position" placeholder="Position" autocomplete="off">
                            </div>
                        </div>
                        <div class="col-lg-2">
                            <div class="form-group">
                                <label for="phone" class="form-label">Phone</label>
                                <input type="text" name="phone" id="phone" class="form-control form-control-sm phone" placeholder="Phone" autocomplete="off">
                            </div>
                        </div>
                        <div class="col-lg-2">
                            <div class="form-group">
                                <label for="address" class="form-label">Address</label>
                                <input type="text" name="address" id="address" class="form-control form-control-sm address" placeholder="Address" autocomplete="off">
                            </div>
                        </div>
                        <div class="col-lg-2">
                            <div class="form-group">
                                <label for="email" class="form-label">Email</label>
                                <input type="text" name="email" id="email" class="form-control form-control-sm email" placeholder="Email" autocomplete="off">
                            </div>
                        </div>
                        <div class="col-lg-2">
                            <label for="" class="form-label"></label><br>
                            <div class="btn-group mt-2">
                                <button type="submit" class="btn btn-success btn-sm" id="btn-filter_submit"><i class="bi bi-filter"></i> Filter</button>
                                <button type="button" class="btn btn-warning btn-sm" id="btn-filter_reset"><i class="bi bi-x"></i> Reset</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <div class="col-lg-12">
                <div class="card">
                    <div class="card-body">
                        <div class="row">
                            <div class="col-lg-12">
                                <div class="table-responsive">
                                    <table class="table table-hover table-striped table-condensed table-borderless" id="employee">
                                        <thead>
                                            <tr>
                                                <th rowspan="2">Name</th>
                                                <th rowspan="2">Gender</th>
                                                <th colspan="3">Other Information</th>
                                            </tr>
                                            <tr>
                                                {{-- <th>Name</th>
                                                <th>Gender</th> --}}
                                                <th>Position</th>
                                                <th>Phone</th>
                                                <th>Address</th>
                                                <th>Email</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                        </tbody>
                                        <tfoot>
                                            <tr>
                                                <th>Name</th>
                                                <th>Gender</th>
                                                <th>Position</th>
                                                <th>Phone</th>
                                                <th>Address</th>
                                                <th>Email</th>
                                                <th>Action</th>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div id="test"></div>
    <div id="test2"></div>

    <script type="text/javascript" src="https://code.jquery.com/jquery-3.6.0.min.js" integrity="sha256-/xUj+3OJU5yExlq6GSYGSHk7tPXikynS7ogEvDej/m4=" crossorigin="anonymous"></script>
    <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0-beta1/dist/js/bootstrap.bundle.min.js"></script>
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/axios/1.0.0-alpha.1/axios.min.js" integrity="sha512-xIPqqrfvUAc/Cspuj7Bq0UtHNo/5qkdyngx6Vwt+tmbvTLDszzXM0G6c91LXmGrRx8KEPulT+AfOOez+TeVylg==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
    <script type="text/javascript" src="{{ asset("") }}assets/js/laravel_table.js"></script>
    <script type="text/javascript">
    class dataTable {
        constructor() {
            this.baseURL = `http://localhost:8000/api/`
            this.employee

            this.getEmployee()
        }

        getEmployee() {
            this.employee = $(`table#employee`).laravelTable({
                url: `${ this.baseURL }employee`,
                customClass: `table-sm`,
                limit: {
                    customClass: `form-select-sm`
                },
                search: {
                    placeholder: `Search name...`,
                    customClass: `input-group-sm`
                },
                pagination: {
                    customClass: `pagination-sm`
                },
                columns: [
                    {
                        data: "name"
                    },
                    {
                        data: "gender"
                    },
                    {
                        data: "position"
                    },
                    {
                        data: "phone",
                        html: e => {
                            return `${ (`${e.phone}`).replace(`62`, `( +62 ) `) }`
                        }
                    },
                    {
                        data: "address"
                    },
                    {
                        data: "email"
                    },
                    {
                        data: null,
                        sort: false,
                        html: e => {
                            return `
                                <div class="btn-group">
                                    <button type="button" class="btn btn-primary btn-sm">Edit</button>
                                    <button type="button" class="btn btn-danger btn-sm">Hapus</button>
                                </div>
                            `
                        }
                    }
                ]
            })
        }

        filterEmployee(e) {
            e.preventDefault()

            let form = $(`form.submit-filter`).serializeArray()

            let formData = {}

            $.each(form, function (index, value) {
                formData[value.name] = value.value
            })

            this.employee.refresh(formData)
        }

        resetFilterEmployee() {
            $(`form.submit-filter input`).val(``)
            $(`form.submit-filter select`).val(``).trigger(`change`)

            this.employee.refresh()
        }
    }

    let datatable = new dataTable

    $(document).on(`submit`, `form.submit-filter`, function(e) {
        datatable.filterEmployee(e)
    })

    $(document).on("click", "form.submit-filter button#btn-filter_reset", function() {
        datatable.resetFilterEmployee()
    })
    </script>
</body>
</html>
