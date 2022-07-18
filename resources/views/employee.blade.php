<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0-beta1/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="{{ asset("") }}assets/css/laravel_table.bootstrap-5.2.css">
</head>
<body>

    <div class="container">
        <div class="row d-flex justify-content-center mt-5">
            <div class="col-lg-12">
                <div class="card">
                    <div class="card-body">
                        <div class="table-responsive">
                            <table class="table table-hover table-striped table-condensed table-borderless">
                                <thead>
                                    <tr>
                                        {{-- <th rowspan="2">Name</th>
                                        <th rowspan="2">Gender</th> --}}
                                        {{-- <th colspan="3">Test</th> --}}
                                    </tr>
                                    <tr>
                                        <th>Name</th>
                                        <th>Gender</th>
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

    <script type="text/javascript" src="https://code.jquery.com/jquery-3.6.0.min.js" integrity="sha256-/xUj+3OJU5yExlq6GSYGSHk7tPXikynS7ogEvDej/m4=" crossorigin="anonymous"></script>
    <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0-beta1/dist/js/bootstrap.bundle.min.js"></script>
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/axios/1.0.0-alpha.1/axios.min.js" integrity="sha512-xIPqqrfvUAc/Cspuj7Bq0UtHNo/5qkdyngx6Vwt+tmbvTLDszzXM0G6c91LXmGrRx8KEPulT+AfOOez+TeVylg==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
    <script type="text/javascript" src="{{ asset("") }}assets/js/laravel_table.js"></script>
    <script type="text/javascript">
    laravel_table.init({
        baseUrl: `http://localhost:8000/api/`
    })

    laravel_table.run("table", {
        url: `employee?page=1`,
        pagination: { // optional
            show: true, // true or false
            type: `default` // default or simple
        },
        limit: { // optional
            show: true, // true or false
            data: [ // array of limit data
                10,
                25,
                50,
                100
            ]
        },
        search: { // optional
            show: true, // true or false
            placeholder: `Search name...` // optional
        },
        columns: [ // required
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
                data: "phone", // initialize key of API
                html: e => { // custom output
                    return `+${ e.phone }`
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
                sort: false, // optional, true or false
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
    </script>
</body>
</html>
