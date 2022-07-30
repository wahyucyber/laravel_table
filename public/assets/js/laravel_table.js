(function( $ ) {

    let elementId,
        responsiveElement,
        table,
        options

    $.fn.extend({
        laravelTable: function( customOptions = {} ) {
            options = {
                url: customOptions.url,
                method: customOptions.method ? customOptions.method : `GET`, // Optional, defualt = GET
                headers: { // Optional or custom headers
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    ...customOptions.headers
                },
                customClass: customOptions.customClass ? customOptions.customClass : ``,
                data: customOptions.data ? customOptions.data : {}, // Optional or custom data
                loading: {
                    show: customOptions.loading && customOptions.loading.show ? customOptions.loading.show : true // true or false
                },
                customClass: customOptions.customClass ? customOptions.customClass : ``,
                pagination: { // optional
                    show: customOptions.pagination && customOptions.pagination.show ? customOptions.pagination.show : true, // true or false
                    type: customOptions.pagination && customOptions.pagination.type ? customOptions.pagination.type : `default`, // default or simple
                    customClass: customOptions.pagination && customOptions.pagination.customClass ? customOptions.pagination.customClass : ``
                },
                limit: { // optional
                    show: customOptions.limit && customOptions.limit.show ? customOptions.limit.show : true, // true or false
                    data: customOptions.limit && customOptions.limit.data ? customOptions.limit.data : [ // array of limit data
                        10,
                        25,
                        50,
                        100
                    ],
                    customClass: customOptions.limit && customOptions.limit.customClass ? customOptions.limit.customClass : ``
                },
                search: { // optional
                    show: customOptions.search && customOptions.search.show ? customOptions.search.true : true, // true or false
                    placeholder: customOptions.search && customOptions.search.placeholder ? customOptions.search.placeholder : ``, // optional
                    customClass: customOptions.search && customOptions.search.customClass ? customOptions.search.customClass : ``
                },
                columns: customOptions.columns
            }

            table = `table#${ $(this).attr(`id`) }`
            elementId = $(this).attr(`id`)
            responsiveElement = $($(this).parent())

            $(this).addClass(`laravel-table ${ options.customClass }`)

            responsiveElement.addClass(`laravel-table_responsive`).attr(`id`, `${ elementId }-laravel-table_responsive`)

            $.each($(`${ table } thead tr th:not([colspan])`).get(), function (index, value) {
                $(this).html(value.innerText)
                let innerHTML = value.innerHTML

                $(this).html(`<div class="d-flex flex-row justify-content-between align-items-center" style="vertical-align: baseline;">${ innerHTML } <div class="d-flex flex-column p-0"><i class="d-block bi bi-caret-up"></i><i class="d-block bi bi-caret-down"></i></div></div>`).attr(`style`, `vertical-align: bottom; text-align: center;`).attr(`data-index`, index)
            })

            $.each($(`${ table } thead tr th:not([colspan])`).get(), function (index, value) {
                let innerText = $(value).text()

                let sort = true

                $.each(options.columns, function (indexColumns, valueColumns) {
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

            $.each(options.limit.data, function (index, value) {
                limitContentOption += `<option value="${ value }">${ value }</option>`
            })

            let limitContent = options.limit.show == true ? `<select class="form-select laravel-table_limit ${ options.limit.customClass }">${ limitContentOption }</select>` : ``

            let searchForm = options.search.show == true ? `
            <form class="laravel-table_search">
                <div class="form-group">
                    <div class="input-group ${ options.search.customClass }">
                        <input type="text" name="search" id="search" autocomplete="off" class="form-control search" placeholder="${ options.search.placeholder }" />
                        <button type="submit" class="btn btn-outline-secondary"><i class="bi bi-search"></i></button>
                    </div>
                </div>
            </form>` : ``

            $(`${ table }`).parent().parent().prepend(`
                <div class="d-flex justify-content-between mb-2 laravel-table_filter" id="${ elementId }-laravel-table_filter">
                    <div>${ limitContent }</div>
                    <div class="w-25">${ searchForm }</div>
                </div>
            `)

            this._API()._Func()

            return this
        },

        _API: function(customRequest = {}) {
            let limit = $(`#${ elementId }-laravel-table_filter .laravel-table_limit`).val()

            $.ajax({
                url: customRequest.url ? customRequest.url : options.url,
                method: options.method,
                headers: options.headers,
                data: {
                    limit: limit ? limit : options.limit.data[0],
                    search: $(`#${ elementId }-laravel-table_filter form.laravel-table_search input`).val(),
                    ...options.data,
                    ...customRequest.data
                },
                xhrFields: {
                    withCredentials: true
                },
                async: true,
                beforeSend: function() {
                    if (options.loading.show == true) {
                        $(`#${ elementId }-laravel-table_responsive`).append(`
                            <div class="laravel-table_loading">
                                <img src="./assets/img/loading.gif" alt="Loading image">
                            </div>
                        `)
                    }
                }
            })
            .done(function(e) {
                let data = e
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
                        $.each(options.columns, function (indexColumns, valueColumns) {
                            if (valueColumns.html) {
                                td += `<td key="${ indexColumns }">${ valueColumns.html(value) }</td>`
                            }else {
                                td += `<td key="${ indexColumns }">${ eval(`value.` + valueColumns.data) }</td>`
                            }
                        })

                        tr += `<tr key="${ index }">${ td }</tr>`
                    })

                    $(`${ table } tbody`).html(tr)

                    let paginationItem = ``

                    if (options.pagination.type == "default") {
                        $.each(links, function (index, value) {
                            paginationItem += `<li class="page-item default ${ value.active ? `active` : `` } ${ value.url == null ? `disabled` : `` }" data-disabled="${ value.url == null ? `true` : `` }" data-active="${ value.active ? `true` : `false` }" data-url="${ value.url }"><a class="page-link" href="javascript:;">${ value.label }</a></li>`
                        })
                    }else if(options.pagination.type == "simple") {
                        paginationItem = `
                            <li class="page-item simple ${ data.current_page == 1 ? `disabled` : `` }" data-disabled="${ data.current_page == 1 ? `true` : `` }" data-url="${ data.first_page_url }"><a class="page-link" href="javascript:;"><i class="bi bi-rewind"></i></a></li>
                            <li class="page-item simple ${ data.current_page == 1 ? `disabled` : `` }" data-disabled="${ data.current_page == 1 ? `true` : `` }" data-url="${ data.prev_page_url }"><a class="page-link" href="javascript:;"><i class="bi bi-caret-left"></i></a></li>
                            <li class="page-item active"><a class="page-link" href="javascript:;">${ data.current_page }</a></li>
                            <li class="page-item simple ${ data.last_page == data.current_page ? `disabled` : `` }" data-disabled="${ data.last_page == data.current_page ? `true` : `` }" data-url="${ data.next_page_url }"><a class="page-link" href="javascript:;"><i class="bi bi-caret-right"></i></a></li>
                            <li class="page-item simple ${ data.last_page == data.current_page ? `disabled` : `` }" data-disabled="${ data.last_page == data.current_page ? `true` : `` }" data-url="${ data.last_page_url }"><a class="page-link" href="javascript:;"><i class="bi bi-fast-forward"></i></a></li>
                        `
                    }

                    $(`.laravel-table_pagination`).remove()

                    if (options.pagination.show == true) {
                        $(table).parent().parent().append(`
                            <div class="mt-2 d-flex justify-content-between laravel-table_pagination" id="${ elementId }-laravel-table_pagination">
                                <nav aria-label="laravel-table_pagination">
                                    <ul class="pagination ${ options.pagination.customClass }">
                                        ${ paginationItem }
                                    </ul>
                                </nav>
                                <div class="table-info">
                                    Showing ${ data.from } to ${ data.total } of ${ data.per_page } per page
                                </div>
                            </div>
                        `)
                    }
                }
            })
            .fail(function(err) {
                let status = err.status
                let statusText = err.statusText

                $(`${ table } tbody`).html(`
                    <tr>
                        <td align="center" colspan="${ options.columns.length }"><b>${ status } -</b> ${ statusText }.</td>
                    </tr>
                `)
            })
            .always(function() {
                if (options.loading.show == true) {
                    $(`#${ elementId }-laravel-table_responsive .laravel-table_loading`).remove()
                }
            })

            return this
        },

        _Func: function() {
            $(document).on(`change`, `#${ elementId }-laravel-table_filter .laravel-table_limit`, function() {
                $(this)._API({
                    data: {
                        limit: $(this).val()
                    }
                })
            })

            $(document).on(`submit`, `#${ elementId }-laravel-table_filter form.laravel-table_search`, function(e) {
                e.preventDefault()

                let search = $(`#${ elementId }-laravel-table_filter form.laravel-table_search input`).val()

                $(this)._API({
                    data: {
                        search: search
                    }
                })
            })

            $(document).on(`keyup`, `#${ elementId }-laravel-table_filter form.laravel-table_search input`, function() {
                if ($(this).val() == "") {
                    $(this)._API({
                        data: {
                            search: ``
                        }
                    })
                }
            })

            $(document).on(`click`, `#${ elementId }-laravel-table_pagination .page-item.default`, function() {
                let url = $(this).data(`url`)
                let active = $(this).data('active')
                let disabled = $(this).data('disabled')

                if (active == false && disabled == false) {
                    $(this)._API({
                        url: url
                    })
                }
            })

            $(document).on(`click`, `#${ elementId }-laravel-table_pagination .page-item.simple`, function() {
                let url = $(this).data(`url`)
                let disabled = $(this).data('disabled')

                if (disabled == false) {
                    $(this)._API({
                        url: url
                    })
                }
            })

            $(document).on(`click`, `table#${ elementId } thead tr th[data-sort][data-index]:not([colspan])`, function(e) {
                let columns = options.columns
                let params = options.data

                let sort = columns[$(this).data(`index`)]['data']

                let sort_old = params.sort ? params.sort : ``
                let dir = params.dir ? params.dir : `ASC`

                if (sort_old == sort) {
                    dir = dir == `DESC` ? `ASC` : `DESC`
                }else {
                    dir = `ASC`
                }

                $(`table#${ elementId } thead tr th i.bi-caret-up-fill`).removeClass(`bi-caret-up-fill`).addClass(`bi-caret-up`)
                $(`table#${ elementId } thead tr th i.bi-caret-down-fill`).removeClass(`bi-caret-down-fill`).addClass(`bi-caret-down`)

                if (dir == 'ASC') {
                    $(`table#${ elementId } thead tr th[data-index='${ $(this).data('index') }'] i.bi-caret-up`).removeClass(`bi-caret-up`).addClass(`bi-caret-up-fill`)
                }else {
                    $(`table#${ elementId } thead tr th[data-index='${ $(this).data('index') }'] i.bi-caret-down`).removeClass(`bi-caret-down`).addClass(`bi-caret-down-fill`)
                }

                options.data = {
                    sort: sort,
                    dir: dir
                }

                $(this)._API({
                    data: {
                        sort: sort,
                        dir: dir
                    }
                })
            })

            return this
        },

        refresh: function(data = {}) {
            $(this)._API({
                data: data
            })
        }
    })
} ( jQuery ))
