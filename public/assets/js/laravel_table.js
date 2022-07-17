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
                </div>
                `)
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

        this.columns = columns
        this.pagination = params.pagination || {
            'type': 'default'
        }
        this.limit = params.limit
        this.url = params.url || ``
        this.method = params.method || `GET`
        this.params = params.params || {
            limit: this.limit.data[0]
        }
        this.data = params.data || {}
        this.headers = params.headers || {
            'Accept': 'application/json'
        }

        $(`${ table }`).addClass(`laravel-table`)

        $.each($(`${ table } thead tr th, ${ table } tfoot tr th`).get(), function (index, value) {
            $(this).html(value.innerText)
            let innerHTML = value.innerHTML

            $(this).html(`<div class="d-flex flex-row justify-content-between align-items-center">${ innerHTML } <div class="d-flex flex-column p-0"><i class="d-block bi bi-caret-up"></i><i class="d-block bi bi-caret-down"></i></div></div>`)
        })

        $.each($(`${ table } thead tr th`).get(), function (index, value) {
            let cellIndex = parseInt(value.cellIndex) + 1
            let innerText = $(value).text()

            let sort = true

            $.each(columns, function (indexColumns, valueColumns) {
                if ((valueColumns.sort == false || valueColumns.sort == "false") && indexColumns == index) {
                    sort = false
                }
            })

            $(this).attr(`data-sort`, sort)
            $(`${ table } tfoot tr th:nth-child(${ cellIndex })`).attr(`data-sort`, sort)

            if (sort == false) {
                $(this).html(value.innerText)
                $(this).html(innerText)
                $(`${ table } tfoot tr th:nth-child(${ cellIndex })`).html(innerText)
            }
        })

        let limitContentOption = ``

        $.each(limit.data, function (index, value) {
            limitContentOption += `<option value="${ value }">${ value }</option>`
        })

        let limitContent = limit.show == true ? `<select class="form-select laravel-table_limit">${ limitContentOption }</select>` : ``

        $(table).parent().parent().prepend(`
            <div class="d-flex justify-content-between mb-2">
                <div>${ limitContent }</div>
                <div class="w-25">
                    <form class="laravel-table_search">
                        <div class="form-group">
                            <div class="input-group">
                                <input type="search" class="form-control" placeholder="Search" />
                                <button type="submit" class="btn btn-outline-secondary"><i class="bi bi-search"></i></button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        `)

        laravel_table.api(params)
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
    laravel_table.params['limit'] = $(this).val()

    laravel_table.api()
})
