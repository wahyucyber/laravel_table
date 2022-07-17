class Laravel_table {
    constructor(baseUrl) {
        this.baseUrl = baseUrl
    }

    init(table, params) {
        let url = params.url || ``
        let method = params.method || `GET`
        let prm = params.params || ``
        let data = params.data || ``
        let columns = params.columns || []

        let headers = params.headers || {
            'Accept': 'application/json'
        }

        $(`${ table }`).addClass(`laravel-table`)

        $.each($(`${ table } thead tr th, ${ table } tfoot tr th`).get(), function (index, value) {
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
                $(this).html(innerText)
                $(`${ table } tfoot tr th:nth-child(${ cellIndex })`).html(innerText)
            }
        })

        axios({
            url: url,
            method: method,
            headers: headers,
            params: prm,
            data: data,
            baseURL: this.baseUrl,
            withCredentials: true
        }).then(e => {
            let data = e.data

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
            }
        }).catch(err => {
            console.log(err)
        });
    }
}
