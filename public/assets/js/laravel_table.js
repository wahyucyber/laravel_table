class Laravel_table {
    constructor() {
        this.baseUrl
        this.url
        this.method
        this.params
        this.data
        this.headers

        this.baseTable
        this.columns
        this.pagination
        this.limit
    }

    init(params) {
        this.baseUrl = params.baseUrl
    }

    api() {
        let table = this.baseTable

        let url = this.url
        let method = this.method
        let prm = this.params
        let data = this.data
        let columns = this.columns
        let pagination = this.pagination

        let headers = this.headers

        axios({
            url: url.replace(this.baseUrl, ''),
            method: method,
            headers: headers,
            params: prm,
            data: data,
            baseURL: this.baseUrl,
            withCredentials: true
        }).then(e => {
            let data = e.data
            let links = data.links

            if (data.data.length == 0) {
                let lengthColumn = $(`${ table } thead tr th`).length

                $(`${ table } tbody`).html(`
                    <tr>
                        <td colspan="${ lengthColumn}" align="center">No matching records found.</td>
                    </tr>
                `)
            }else {
                let td = ``
                let tr = ``

                $.each(data.data, function (index, value) {
                    td = ``
                    $.each(columns, function (indexColumns, valueColumns) {
                        if (valueColumns.html) {
                            td += `<td>${ valueColumns.html(value) }</td>`
                        }else {
                            td += `<td>${ eval(`value.` + valueColumns.data) }</td>`
                        }
                    })

                    tr += `<tr>${ td }</tr>`
                })

                $(`${ table } tbody`).html(tr)

                let paginationItem = ``

                if (pagination.type == "default") {
                    $.each(links, function (index, value) {
                        paginationItem += `<li class="page-item default ${ value.active ? `active` : `` } ${ value.url == null ? `disabled` : `` }" data-disabled="${ value.url == null ? `true` : `` }" data-active="${ value.active ? `true` : `false` }" data-url="${ value.url }"><a class="page-link" href="javascript:;">${ value.label }</a></li>`
                    })
                }else if(pagination.type == "simple") {
                    paginationItem = `
                        <li class="page-item simple ${ data.current_page == 1 ? `disabled` : `` }" data-disabled="${ data.current_page == 1 ? `true` : `` }" data-url="${ data.first_page_url }"><a class="page-link" href="javascript:;"><i class="bi bi-rewind"></i></a></li>
                        <li class="page-item simple ${ data.current_page == 1 ? `disabled` : `` }" data-disabled="${ data.current_page == 1 ? `true` : `` }" data-url="${ data.prev_page_url }"><a class="page-link" href="javascript:;"><i class="bi bi-caret-left"></i></a></li>
                        <li class="page-item active"><a class="page-link" href="javascript:;">${ data.current_page }</a></li>
                        <li class="page-item simple ${ data.last_page == data.current_page ? `disabled` : `` }" data-disabled="${ data.last_page == data.current_page ? `true` : `` }" data-url="${ data.next_page_url }"><a class="page-link" href="javascript:;"><i class="bi bi-caret-right"></i></a></li>
                        <li class="page-item simple ${ data.last_page == data.current_page ? `disabled` : `` }" data-disabled="${ data.last_page == data.current_page ? `true` : `` }" data-url="${ data.last_page_url }"><a class="page-link" href="javascript:;"><i class="bi bi-fast-forward"></i></a></li>
                    `
                }

                $(`.laravel-table_pagination`).remove()

                if (pagination.show == true) {
                $(table).parent().parent().append(`
                    <div class="mt-2 d-flex justify-content-between laravel-table_pagination">
                        <nav aria-label="laravel-table_pagination">
                            <ul class="pagination">
                                ${ paginationItem }
                            </ul>
                        </nav>
                        <div class="table-info">
                            Showing ${ data.from } to ${ data.total } of ${ data.per_page } per page
                        </div>
                    </div>`)
                }
            }
        }).catch(err => {
            console.log(err)
        });
    }

    run(table, params) {
        this.baseTable = table

        let columns = params.columns || []
        let limit = params.limit || {
            show: true,
            data: [10,25,50,100]
        }
        let search = params.search || {
            show: true,
            placeholder: `Search`
        }

        this.columns = columns
        this.pagination = params.pagination || {
            show: true,
            type: 'default'
        }
        this.limit = limit
        this.url = params.url || ``
        this.method = params.method || `GET`

        this.params = {}

        this.params['limit'] = this.limit.data[0]
        this.params[`search`] = $(`form.laravel-table_search input`).val()

        if (params.params) {
            this.params = {
                ...this.params,
                ...params.params
            }
        }

        this.data = params.data || {}
        this.headers = params.headers || {
            'Accept': 'application/json'
        }

        $(`${ table }`).addClass(`laravel-table`)

        $.each($(`${ table } thead tr th:not([colspan])`).get(), function (index, value) {
            $(this).html(value.innerText)
            let innerHTML = value.innerHTML

            $(this).html(`<div class="d-flex flex-row justify-content-between align-items-center" style="vertical-align: baseline;">${ innerHTML } <div class="d-flex flex-column p-0"><i class="d-block bi bi-caret-up"></i><i class="d-block bi bi-caret-down"></i></div></div>`).attr(`style`, `vertical-align: bottom; text-align: center;`).attr(`data-index`, index)
        })

        $.each($(`${ table } thead tr th:not([colspan])`).get(), function (index, value) {
            let cellIndex = parseInt(value.cellIndex) + 1
            let innerText = $(value).text()

            let sort = true

            $.each(columns, function (indexColumns, valueColumns) {
                if ((valueColumns.sort == false || valueColumns.sort == "false") && indexColumns == index) {
                    sort = false
                }
            })

            $(this).attr(`data-sort`, sort)

            if (sort == false) {
                $(this).html(innerText).attr(`style`, `vertical-align: middle;`).removeAttr(`data-index`)
            }
        })

        let limitContentOption = ``

        $.each(limit.data, function (index, value) {
            limitContentOption += `<option value="${ value }">${ value }</option>`
        })

        let limitContent = limit.show == true ? `<select class="form-select laravel-table_limit">${ limitContentOption }</select>` : ``

        let searchForm = search.show == true ? `
        <form class="laravel-table_search">
            <div class="form-group">
                <div class="input-group">
                    <input type="text" name="search" id="search" autocomplete="off" class="form-control search" placeholder="${ search.placeholder }" />
                    <button type="submit" class="btn btn-outline-secondary"><i class="bi bi-search"></i></button>
                </div>
            </div>
        </form>` : ``

        $(table).parent().parent().prepend(`
            <div class="d-flex justify-content-between mb-2">
                <div>${ limitContent }</div>
                <div class="w-25">${ searchForm }</div>
            </div>
        `)

        laravel_table.api(params)
    }

    setParams(params) {
        this.params = {
            ...this.params,
            ...params
        }
    }
}

let laravel_table = new Laravel_table()

$(document).on(`click`, `.laravel-table_pagination .page-item.default`, function() {
    let url = $(this).data(`url`)
    let active = $(this).data('active')
    let disabled = $(this).data('disabled')

    if (active == false && disabled == false) {
        laravel_table.api({
            url: url
        })
    }
})

$(document).on(`click`, `.laravel-table_pagination .page-item.simple`, function() {
    let url = $(this).data(`url`)
    let disabled = $(this).data('disabled')

    if (disabled == false) {
        laravel_table.api({
            url: url
        })
    }
})

$(document).on("change", ".laravel-table_limit", function() {
    laravel_table.setParams({
        limit: $(this).val()
    })

    laravel_table.api()
})

$(document).on("submit", "form.laravel-table_search", function(e) {
    e.preventDefault()

    let search = $(`form.laravel-table_search input`).val()

    laravel_table.setParams({
        search: search
    })

    laravel_table.api()
})

$(document).on("keyup", `form.laravel-table_search input`, function() {
    if ($(this).val() == "") {
        laravel_table.setParams({
            search: ``
        })
    }
})

$(document).on(`click`, `table thead tr th[data-sort][data-index]:not([colspan])`, function(e) {
    let columns = laravel_table.columns
    let params = laravel_table.params

    let sort = columns[$(this).data(`index`)]['data']

    let sort_old = params.sort ? params.sort : ``
    let dir = params.dir ? params.dir : `ASC`

    if (sort_old == sort) {
        dir = dir == `DESC` ? `ASC` : `DESC`
    }else {
        dir = `ASC`
    }

    $(`table.laravel-table thead tr th i.bi-caret-up-fill`).removeClass(`bi-caret-up-fill`).addClass(`bi-caret-up`)
    $(`table.laravel-table thead tr th i.bi-caret-down-fill`).removeClass(`bi-caret-down-fill`).addClass(`bi-caret-down`)

    if (dir == 'ASC') {
        $(`table.laravel-table thead tr th[data-index='${ $(this).data('index') }'] i.bi-caret-up`).removeClass(`bi-caret-up`).addClass(`bi-caret-up-fill`)
    }else {
        $(`table.laravel-table thead tr th[data-index='${ $(this).data('index') }'] i.bi-caret-down`).removeClass(`bi-caret-down`).addClass(`bi-caret-down-fill`)
    }

    laravel_table.setParams({
        sort: sort,
        dir: dir
    })

    laravel_table.api()
})
