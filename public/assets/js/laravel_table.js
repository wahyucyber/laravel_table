/*
 *                  LARAVEL TABLE
 *
 * @author          M. Nur Wahyu
 * @email           m.nur.wahyu1974@gmail.com
 * @address         DUSUN KRAJAN II, Desa Jombang, Kec. Jombang, Kab. Jember, Jawa Timur, Indonesia.
 * @description     Laravel Table merupakan plugin jQuery untuk merender output JSON suatu response API Laravel atau response API yang sama persis dengna Laravel ke dalam bentuk HTML Table.
 * @version         0.0.1
 *
 * Jika ada yang mengalami kendala atau bug pada plugin ini, silahkan contact support ke email diatas yang tertera.
 * Siapapun juga boleh ikut serta dalam pengembangan plugin laravel table ini.
 * Plugin ini saya sebarkan secara publik dan boleh diakses oleh siapapun tanpa dikenai biaya.
 */

/*
 * Inisialisasi jQuery.
 */
(function( $ ) {

    /*
     * Set global variabel elementId, responsiveElement, defaultOptions dan globalOptions.
     */
    let elementId,
        responsiveElement,
        defaultOptions,
        globalOptions = []

    /*
     * Menggabungkan seluruh function dalam jQuery.
     */
    $.fn.extend({

        /*
         * Fungsi untuk implementasi Laravel Table ke Table HTML.
         * Contoh implementasi Laravel Table ke html:
         *
         * Standart parameter.
         * $(ElementID).laravelTable({
         *      url: `http://localhost:8000/api/employee`,
         *      columns: [
         *          {
         *              data: "name"
         *          },
         *          {
         *              data: "gender"
         *          },
         *          {
         *              data: "position"
         *          },
         *          {
         *              data: "phone",
         *              html: e => {
         *                  return `${ (`${e.phone}`).replace(`62`, `( +62 ) `) }`
         *              }
         *          },
         *          {
         *              data: "address"
         *          },
         *          {
         *              data: "email"
         *          },
         *          {
         *              data: null,
         *              sort: false,
         *              html: e => {
         *                  return `
         *                      <div class="btn-group">
         *                          <button type="button" class="btn btn-primary btn-sm">Edit</button>
         *                          <button type="button" class="btn btn-danger btn-sm">Hapus</button>
         *                      </div>`                  `
         *              }
         *          }
         *      ]
         * })
         *
         * Komplit parameter.
         * $(ElementID).laravelTable({
         *      url: `http://localhost:8000/api/employee`,
         *      customClass: `table-sm`,
         *      data: {
         *          param1: `nilai1`,
         *          param2: `nilai2`,
         *          param3: `nilai3`,
         *      },
         *      loading: {
         *          show: "true"
         *      },
         *      pagination: {
         *          show: "true",
         *          type: `default`,
         *          customClass: `pagination-sm`
         *      },
         *      limit: {
         *          show: "true",
         *          data: [
         *              10,
         *              25,
         *              50,
         *              100
         *          ],
         *          customClass: `form-select-sm`
         *      },
         *      search: {
         *          show: "true",
         *          placeholder: `Search column...`,
         *          customClass: `form-control-sm`
         *      },
         *      columns: [
         *          {
         *              data: "name"
         *          },
         *          {
         *              data: "gender"
         *          },
         *          {
         *              data: "position"
         *          },
         *          {
         *              data: "phone",
         *              html: e => {
         *                  return `${ (`${e.phone}`).replace(`62`, `( +62 ) `) }`
         *              }
         *          },
         *          {
         *              data: "address"
         *          },
         *          {
         *              data: "email"
         *          },
         *          {
         *              data: null,
         *              sort: false,
         *              html: e => {
         *                  return `
         *                      <div class="btn-group">
         *                          <button type="button" class="btn btn-primary btn-sm">Edit</button>
         *                          <button type="button" class="btn btn-danger btn-sm">Hapus</button>
         *                      </div>`                  `
         *              }
         *          }
         *      ]
         * })
         */
        laravelTable: function( customOptions = {} ) {

            /*
             * Set variabel baru.
             * Variabel table memiliki nilai id table yang akan di definisikan Laravel Table.
             * Variabel elementId memiliki nilai id dari element table.
             * Dan variabel responsiveElement memiliki nilai element dengan class table-responsive.
             */
            table = `table#${ $(this).attr(`id`) }`
            elementId = $(this).attr(`id`)
            responsiveElement = $($(this).parent())

            /*
             * Set value untuk variabel globalOptions dengan key elementId untuk mendefinisikan multi tabel.
             */
            globalOptions[elementId] = {

                /*
                 * Parameter url digunakan untuk request ke API URL yang diminta.
                 */
                url: customOptions.url ? customOptions.url : ``,

                /*
                 * Parameter method digunakan untuk method pemanggilan API, method tergantung dari API ada POST, GET, PUT, PATCH dan DELETE.
                 * Default parameter value GET.
                 */
                method: customOptions.method ? customOptions.method : `GET`,

                /*
                 * Parameter headers digunakan untuk request ajax atau xmlHttpRequest ke API.
                 */
                headers: {

                    /*
                     * Key Accept dengan nilai application/josn, digunakan untuk output response API yaitu JSON.
                     */
                    "Accept": "application/json",

                    /*
                     * Key Content-Type dengan nilai application/json, digunakan untuk parameter dikonversikan ke delam bentuk JSON.
                     */
                    "Content-Type": "application/json",

                    /*
                     * Menambahkan key headers jika ada tambahan headers.
                     * Untuk metode set nilai headers yaitu menggunakan array
                     * {
                     *      key1: `nilai`,
                     *      key2: `nilai`,
                     *      key3: `nilai`,
                     *      key[n]...
                     * }
                     */
                    ...customOptions.headers
                },

                /*
                 * Parameter customClass digunakan untuk mengubah style atau gaya table.
                 * Parameter boleh diisi atau tidak.
                 */
                customClass: customOptions.customClass ? customOptions.customClass : ``,

                /*
                 * Parameter data digunakan untuk parameter yang akan direquest kan ke API.
                 * Untuk metode set nilai data yaitu menggunakan array
                 * {
                 *      key1: `nilai`,
                 *      key2: `nilai`,
                 *      key3: `nilai`,
                 *      key[n]...
                 * }
                 */
                data: customOptions.data ? customOptions.data : {},

                /*
                 * Parameter loading digunakan untuk pengaturan loading component.
                 */
                loading: {

                    /*
                     * Parameter loading di dalamnya juga memiliki parameter yaitu show.
                     * Default parameter show yaitu true.
                     * Parameter show hanya memiliki 2 nilai, yaitu true atau false.
                     */
                    show: customOptions.loading && customOptions.loading.show ? customOptions.loading.show : true
                },

                /*
                 * Parameter pagination digunakan untuk pengaturan pagination.
                 */
                pagination: {

                    /*
                     * Parameter show digunakan untuk menentukan apakah pagination ditampilkan atau tidak.
                     * Default parameter show yaitu true.
                     * Parameter show hanya memiliki 2 nilai, yaitu true atau false.
                     */
                    show: customOptions.pagination && customOptions.pagination.show ? customOptions.pagination.show : true,

                    /*
                     * Parameter type digunakan untuk menentukan style atau gaya pagination yang akan ditampilkan.
                     * Default parameter type yaitu default.
                     * Parameter show hanya memiliki 2 nilai, yaitu default atau simple.
                     */
                    type: customOptions.pagination && customOptions.pagination.type ? customOptions.pagination.type : `default`,

                    /*
                     * Menambahkan custom class jika ingin mengubah style pagination.
                     */
                    customClass: customOptions.pagination && customOptions.pagination.customClass ? customOptions.pagination.customClass : ``
                },

                /*
                 * Parameter limit digunakan untuk pengaturan limit data yang akan ditampilkan.
                 * Parameter limit di dalam nya memiliki parameter pendukung, yaitu show, data dan customClass.
                 */
                limit: {

                    /*
                     * Parameter show digunakan untuk menentukan form select limit ditampilkan atau tidak.
                     * Parameter show memiliki nilai default, yaitu true.
                     * Mengambil nilai parameter limit show, parameter ini memiliki default value yaitu true.
                     */
                    show: customOptions.limit && customOptions.limit.show ? customOptions.limit.show : true,

                    /*
                     * Parameter data adalah parameter yang digunakan untuk nilai - nilai limit data yang akan ditampilkan.
                     */
                    data: customOptions.limit && customOptions.limit.data ? customOptions.limit.data : [
                        10,
                        25,
                        50,
                        100
                    ],

                    /*
                     * Parameter customClass digunakan jika ingin merubah style atau gaya form limit data.
                     */
                    customClass: customOptions.limit && customOptions.limit.customClass ? customOptions.limit.customClass : ``
                },

                /*
                 * Parameter search digunakan untuk pengaturan search form.
                 * Adapun parameter pendukung, yaitu show, placeholder dan customClass.
                 */
                search: {

                    /*
                     * Parameter show digunakan untuk menampilkan search form atau tidak.
                     * Parameter show ini hanya memiliki 2 nilai, yaitu true atau false.
                     */
                    show: customOptions.search && customOptions.search.show ? customOptions.search.show : true,

                    /*
                     * Parameter placeholder digunakan untuk mengisi label input search.
                     */
                    placeholder: customOptions.search && customOptions.search.placeholder ? customOptions.search.placeholder : ``,

                    /*
                     * Parameter customClass digunakan untuk mengubah style atau gaya search form.
                     */
                    customClass: customOptions.search && customOptions.search.customClass ? customOptions.search.customClass : ''
                },

                /*
                 * Parameter columns digunakan untuk mendefinisikan columns atau data yang akan ditampilkan ke table.
                 * Cara pengisian parameter columns, yaitu:
                 *
                 * [
                 *      {
                 *          data: `column`,
                 *          sort: true,
                 *          html: function(e) {
                 *              return `html-code`
                 *          }
                 *      }
                 * ]
                 *
                 * Parameter data digunakan untuk mendefinisikan key data yang ada pada response API.
                 * Parameter sort digunakan untuk mendefinisikan bahwa kolom tersebut menggunakan sort data atau tidak.
                 * Parameter html digunakan untuk custom output yang dihasilkan ke dalam tabel, jika parameter html ini digunakan maka parameter data set value ke null.
                 */
                columns: customOptions.columns ? customOptions.columns : []
            }

            /*
             * Set value variabel defaultOptions.
             */
            defaultOptions = globalOptions[elementId]

            /*
             * Menambahkan class laravel-table dan custom class ke dalam table.
             */
            $(this).addClass(`laravel-table ${ defaultOptions.customClass }`)

            /*
             * Menambahkan class laravel-table_responsive dan custom class, juga menambahkan id { elementId }-laravel-table_responsive
             */
            responsiveElement.addClass(`laravel-table_responsive`).attr(`id`, `${ elementId }-laravel-table_responsive`)

            /*
             * Mengambil nilai thead > th dari table dan merubah ke dalam bentuk format html baru.
             */
            $.each($(`${ table } thead tr th:not([colspan])`).get(), function (index, value) {

                /*
                 * Mengambil nilai html dari element th.
                 */
                let innerHTML = value.innerHTML

                /*
                 * Mengubah default element th ke dalam bentuk default th laravel table.
                 */
                $(this).html(`<div class="d-flex flex-row justify-content-between align-items-center" style="vertical-align: baseline;">${ innerHTML } <div class="d-flex flex-column p-0"><i class="d-block bi bi-caret-up"></i><i class="d-block bi bi-caret-down"></i></div></div>`).attr(`style`, `vertical-align: bottom; text-align: center;`).attr(`data-index`, index)
            })

            /*
             * Menambahkan data sort ke dalam element thead > th dan menghapus data sort jika kolom tersebut parameter sort bernailai false.
             */
            $.each($(`${ table } thead tr th:not([colspan])`).get(), function (index, value) {

                /*
                 * Mengambil nilai text dari element thead > th.
                 */
                let innerText = $(value).text()

                /*
                 * Menambahkan variabel baru dengan nama sort dan memili nilai default true.
                 */
                let sort = true

                /*
                 * Mengambil parameter sort dari parameter columns dan di konversikan kedalam bentuk perulangan karena parameter sort dalam bentuk array.
                 */
                $.each(defaultOptions.columns, function (indexColumns, valueColumns) {
                    /*
                     * Jika parameter sort yang di ambil dari parameter kolom memiliki nilai false maka variabel sort berubah menjadi false.
                     */
                    if ((valueColumns.sort == false || valueColumns.sort == "false") && indexColumns == index) {
                        sort = false
                    }
                })

                /*
                 * Menambahkan data-sort ke dalam thead > th.
                 */
                $(this).attr(`data-sort`, sort)

                /*
                 * Menghapus data-sort jika parameter kolom sort false.
                 */
                if (sort == false) {
                    $(this).html(innerText).attr(`style`, `vertical-align: middle;`).removeAttr(`data-index`)
                }
            })

            /*
             * Set variabel baru dengan nama limitContentOption
             */
            let limitContentOption = ``

            /*
             * Memasukkan nilai dari parameter limit data ke dalam element option.
             */
            $.each(defaultOptions.limit.data, function (index, value) {
                limitContentOption += `<option value="${ value }">${ value }</option>`
            })

            /*
             * Menghapus element laravel-table_filter.
             */
            $(`#${ elementId }-laravel-table_filter.laravel-table_filter`).remove()

            /*
             * Menambahkan variabel baru dengan nama limitContent.
             * Didalam variabel limitContent memiliki nilai yaitu element select baru yang digunakan untuk melimit data pada saat memunculkan data pada tabel.
             * Nilai options diambil dari variabel limitContentOption
             */
            let limitContent = defaultOptions.limit.show == true || defaultOptions.limit.show == "true" ? `<select class="form-select laravel-table_limit ${ defaultOptions.limit.customClass }">${ limitContentOption }</select>` : ``

            /*
             * Menambahkan variabel baru dengan nama searchForm.
             * Didalam variabel searchForm memiliki nilai yaitu sebuah element form baru yang digunakan untuk request mencari data yang diinput oleh user.
             */
            let searchForm = defaultOptions.search.show == true || defaultOptions.search.show == "true" ? `
            <form class="laravel-table_search">
                <div class="form-group">
                    <div class="input-group ${ defaultOptions.search.customClass }">
                        <input type="text" name="search" id="search" autocomplete="off" class="form-control search" placeholder="${ defaultOptions.search.placeholder }" />
                        <button type="submit" class="btn btn-outline-secondary"><i class="bi bi-search"></i></button>
                    </div>
                </div>
            </form>` : ``

            /*
             * Menambahkan element baru ke dalam HTML.
             * Didalam element baru ini terdapat limit dan search form yang di ambil dari variabel limitContent dan searchForm.
             */
            $(`${ table }`).parent().parent().prepend(`
                <div class="d-flex justify-content-between mb-2 laravel-table_filter" id="${ elementId }-laravel-table_filter">
                    <div>${ limitContent }</div>
                    <div class="w-25">${ searchForm }</div>
                </div>
            `)

            /*
             * Meneruskan fungsi ini ke fungsi _API dan _Func.
             */
            $(this)._API()._Func()

            /*
             * Mengembalikan nilai this element.
             */
            return this
        },

        /*
         * Fungsi untuk memanggil API.
         * Adapun parameter customRequest yang didapat dari fungsi sebelumnya.
         */
        _API: function(customRequest = {}) {

            /*
             * Menambahkan variabel element yang mempunyai nilai id element.
             */
            let element = this[0].id

            /*
             * Menambahkan variabel limit yang mempunyai nilai element limit data.
             */
            let limit = $(`#${ element }-laravel-table_filter .laravel-table_limit`).val()

            /*
             * Menambahkan variabel options dengan nilai dari variabel globalOptions.
             */
            let options = globalOptions[element]

            /*
             * Mengubah nilai data dari parameter globalOptions.
             */
            globalOptions[element]['data'] = {

                /*
                 * Mengambil nilai data dari variabel globalOptions sebelumnya.
                 */
                ...globalOptions[element].data,

                /*
                 * Set limit data
                 */
                limit: limit ? limit : options.limit.data[0],

                /*
                 * Set search value
                 */
                search: $(`#${ element }-laravel-table_filter form.laravel-table_search input`).val(),

                /*
                 * Menambahkan parameter custom data.
                 * Adapun cara pengisiannya, yaitu dengan array.
                 * {
                 *      key1: `nilai`,
                 *      key2: `nilai`,
                 *      key3: `nilai`,
                 *      key[n]...
                 * }
                 */
                ...customRequest.data
            }

            /*
             * Call ajax jQuery untuk request ke API yang diminta.
             */
            $.ajax({
                url: customRequest.url ? customRequest.url : options.url,
                method: options.method,
                headers: options.headers,
                data: options.data,
                xhrFields: {
                    withCredentials: true
                },
                async: true,
                beforeSend: function() {

                    /*
                     * Mendefinisikan jika parameter loading > show sama dengan true maka menampilkan loading data.
                     */
                    if (options.loading.show == true || options.loading.show == "true") {
                        $(`#${ element }-laravel-table_responsive`).append(`
                            <div class="laravel-table_loading">
                                <img src="./assets/img/loading.gif" alt="Loading image">
                            </div>
                        `)
                    }
                }
            })

            /*
             * Jika setelah request API dan response 200 OK.
             */
            .done(function(e) {

                /*
                 * Menambahkan variabel data yang bernailai output response API.
                 */
                let data = e

                /*
                 * Menambahkan variabel links yang bernilai data pagination dari response API.
                 */
                let links = data.links

                /*
                 * Jika tidak memiliki data
                 */
                if (data.data.length == 0) {
                    /*
                     * Mengambil nilai jumlah kolum pada table
                     */
                    let lengthColumn = $(`table#${ element } thead tr th`).length

                    /*
                     * Menampilkan pesan kalau data kosong atau tidak ada.
                     */
                    $(`table#${ element } tbody`).html(`
                        <tr>
                            <td colspan="${ lengthColumn}" align="center">No matching records found.</td>
                        </tr>
                    `)

                /*
                 * Jika data tidak kosong atau ada.
                 */
                }else {

                    /*
                     * Menambahkan variabel baru bernama td
                     */
                    let td = ``

                    /*
                     * Menambahkan variabel baru bernama tr
                     */
                    let tr = ``

                    /*
                     * Mengambil nilai data dari response API dan dijadikan ke perulangan.
                     */
                    $.each(data.data, function (index, value) {

                        /*
                         * Mendefinisikan bahwa variabel td kembali ke semula atau kosong.
                         */
                        td = ``

                        /*
                         * Mengambil nilai kolom pada tabel dan dijadikan ke perulangan.
                         */
                        $.each(options.columns, function (indexColumns, valueColumns) {

                            /*
                             * Jika parameter html digunakan.
                             */
                            if (valueColumns.html) {
                                td += `<td key="${ indexColumns }">${ valueColumns.html(value) }</td>`

                            /*
                             * Jika parameter html tidak digunakan.
                             */
                            }else {
                                td += `<td key="${ indexColumns }">${ eval(`value.` + valueColumns.data) }</td>`
                            }
                        })

                        /*
                         * Mengubah nilai variabel tr dengan element baru yang bernama tr dan berisi dari variabel td.
                         */
                        tr += `<tr key="${ index }">${ td }</tr>`
                    })

                    /*
                     * Menampilkan nilai tr ke dalam tabel.
                     */
                    $(`table#${ element } tbody`).html(tr)
                }

                /*
                 * Menambahkan variabel baru dengan nama paginationItem.
                 */
                let paginationItem = ``

                /*
                 * Jika parameter pagination > type sama dengan default.
                 */
                if (options.pagination.type == "default") {

                    /*
                     * Mengambil nilai dari variabel links dan menjadikan ke perulangan.
                     */
                    $.each(links, function (index, value) {

                        /*
                         * Mengubah nilai variabel paginationItem dengan element li dan memiliki isi dari key label.
                         */
                        paginationItem += `<li class="page-item default ${ value.active ? `active` : `` } ${ value.url == null ? `disabled` : `` }" data-disabled="${ value.url == null ? `true` : `` }" data-active="${ value.active ? `true` : `false` }" data-url="${ value.url }"><a class="page-link" href="javascript:;">${ value.label }</a></li>`
                    })

                /*
                 * Jika parameter pagination > type sama dengan simple
                 */
                }else if(options.pagination.type == "simple") {

                    /*
                     * Mengubah nilai paginationItem dengan html pagination.
                     */
                    paginationItem = `
                        <li class="page-item simple ${ data.current_page == 1 ? `disabled` : `` }" data-disabled="${ data.current_page == 1 ? `true` : `` }" data-url="${ data.first_page_url }"><a class="page-link" href="javascript:;"><i class="bi bi-rewind"></i></a></li>
                        <li class="page-item simple ${ data.current_page == 1 ? `disabled` : `` }" data-disabled="${ data.current_page == 1 ? `true` : `` }" data-url="${ data.prev_page_url }"><a class="page-link" href="javascript:;"><i class="bi bi-caret-left"></i></a></li>
                        <li class="page-item active"><a class="page-link" href="javascript:;">${ data.current_page }</a></li>
                        <li class="page-item simple ${ data.last_page == data.current_page ? `disabled` : `` }" data-disabled="${ data.last_page == data.current_page ? `true` : `` }" data-url="${ data.next_page_url }"><a class="page-link" href="javascript:;"><i class="bi bi-caret-right"></i></a></li>
                        <li class="page-item simple ${ data.last_page == data.current_page ? `disabled` : `` }" data-disabled="${ data.last_page == data.current_page ? `true` : `` }" data-url="${ data.last_page_url }"><a class="page-link" href="javascript:;"><i class="bi bi-fast-forward"></i></a></li>
                    `
                }

                /*
                 * Menghapus element pagination.
                 */
                $(`#${ element }-laravel-table_pagination`).remove()

                /*
                 * Jika parameter pagination > show sama dengan true
                 */
                if (options.pagination.show == true || options.pagination.show == "true") {

                    /*
                     * Menambahkan element pagination ke html.
                     */
                    $(`table#${ element }`).parent().parent().append(`
                        <div class="mt-2 d-flex justify-content-between laravel-table_pagination" id="${ element }-laravel-table_pagination">
                            <nav aria-label="laravel-table_pagination">
                                <ul class="pagination ${ options.pagination.customClass }">
                                    ${ paginationItem }
                                </ul>
                            </nav>
                            <div class="table-info">
                                Showing ${ data.from != null ? data.from : 0 } to ${ data.last_page } of ${ data.total } entries
                            </div>
                        </div>
                    `)
                }
            })

            /*
             * Request API fail atau gagal.
             */
            .fail(function(err) {

                /*
                 * Menambahkan variabel baru dengan nama status dan memiliki nilai yang diambil dari response error status API.
                 */
                let status = err.status

                /*
                 * Menambahkan variabel baru dengan nama statusText dan memiliki nilai yang diambil dari response error text API.
                 */
                let statusText = err.statusText

                /*
                 * Menampilkan response error API ke dalam tabel.
                 */
                $(`table#${ element } tbody`).html(`
                    <tr>
                        <td align="center" colspan="${ options.columns.length }"><b>${ status } -</b> ${ statusText }.</td>
                    </tr>
                `)
            })

            /*
             * Setelah request api fail atau success.
             */
            .always(function() {

                /*
                 * Jika parameter loading > show sama dengan true.
                 */
                if (options.loading.show == true || options.loading.show == "true") {

                    /*
                     * Menghapus element html loading.
                     */
                    $(`#${ element }-laravel-table_responsive .laravel-table_loading`).remove()
                }
            })

            /*
             * Mengembalikan nilai this element.
             */
            return this
        },

        /*
         * Fungsi untuk memberikan aksi terhadap komponen - komponen tabel.
         */
        _Func: function() {

            /*
             * Menambahkan variabel baru dengan nama element yang bernilai id element
             */
            let element = this[0].id

            /*
             * Menambahkan variabel baru dengan nama options yang bernilai dari variabel globalOptions
             */
            let options = globalOptions[element]

            /*
             * Menambahkan variabel baru dengan nama elementObject yang bernailai this element
             */
            let elementObject = this

            /*
             * Membuat fungsi change atau pilih limit data yang akan ditampilkan.
             */
            $(document).on(`change`, `#${ element }-laravel-table_filter .laravel-table_limit`, function() {

                /*
                 * Melakukan pemanggilan fungsi _API dengan mengirimkan parameter baru.
                 */
                $(elementObject)._API({
                    data: {
                        limit: $(this).val()
                    }
                })
            })

            /*
             * Membuat fungsi submit pada form input search.
             */
            $(document).on(`submit`, `#${ element }-laravel-table_filter form.laravel-table_search`, function(e) {

                /*
                 * Mematikan fungsi refresh ketika submit form.
                 */
                e.preventDefault()

                /*
                 * Membuat variabel baru dengan nama search dengan nilai value dari form search.
                 */
                let search = $(`#${ element }-laravel-table_filter form.laravel-table_search input`).val()

                /*
                 * Melakukan pemanggilan fungsi _API dengan mengirimkan parameter baru.
                 */
                $(elementObject)._API({
                    data: {
                        search: search
                    }
                })
            })

            /*
             * Membuat fungsi keyup atau input search kosong
             */
            $(document).on(`keyup`, `#${ element }-laravel-table_filter form.laravel-table_search input`, function() {

                /*
                 * Jika value dari input search kosong
                 */
                if ($(this).val() == "") {

                    /*
                     * Melakukan pemanggilan fungsi _API dengan mengirimkan parameter baru.
                     */
                    $(elementObject)._API({
                        data: {
                            search: ``
                        }
                    })
                }
            })

            /*
             * Membuat fungsi klik pada pagination default
             */
            $(document).on(`click`, `#${ element }-laravel-table_pagination .page-item.default`, function() {

                /*
                 * Menambahkan variabel baru dengan nama url yang bernailai data-url dari element pagination.
                 */
                let url = $(this).data(`url`)

                /*
                 * Menambahkan variabel baru dengan nama active yang bernailai data-active dari element pagination.
                 */
                let active = $(this).data('active')

                /*
                 * Menambahkan variabel baru dengan nama disabled yang bernilai data-disabled dari element pagination.
                 */
                let disabled = $(this).data('disabled')

                /*
                 * Jika variabel active dan disabled bernilai false
                 */
                if (active == false && disabled == false) {

                    /*
                     * Melakukan pemanggilan fungsi _API dengan mengirimkan parameter baru.
                     */
                    $(elementObject)._API({
                        url: url
                    })
                }
            })

            /*
             * Membuat fungsi klik pada pagination simple.
             */
            $(document).on(`click`, `#${ element }-laravel-table_pagination .page-item.simple`, function() {

                /*
                 * Membuat variabel baru dengan nama url dengan nilai data-url dari element pagination.
                 */
                let url = $(this).data(`url`)

                /*
                 * Membuat variabel baru dengan nama disabled dengan nilai data-disabled dari element pagination.
                 */
                let disabled = $(this).data('disabled')

                /*
                 * Jika variabel disabled sama dengan false
                 */
                if (disabled == false) {

                    /*
                     * Melakukan pemanggilan fungsi _API dengan mengirimkan parameter baru.
                     */
                    $(elementObject)._API({
                        url: url
                    })
                }
            })

            /*
             * Membuat fungsi klik pada kolom th sort data.
             */
            $(document).on(`click`, `table#${ element } thead tr th[data-sort][data-index]:not([colspan])`, function(e) {

                /*
                 * Membuat variabel baru dengan nama columns dengan bernilai dari variabel options.columns.
                 */
                let columns = options.columns

                /*
                 * Membuat variabel baru dengan nama params dengan bernailai dari variabel options.data.
                 */
                let params = options.data

                /*
                 * Membuat variabel baru dengan nama sort dengan bernailai dari variabel columns.
                 */
                let sort = columns[$(this).data(`index`)]['data']

                /*
                 * Membuat variabel baru dengan nama sort_old dengan bernailai dari variabel params.sort atau kosong.
                 */
                let sort_old = params.sort ? params.sort : ``

                /*
                 * Membuat variabel baru dengan nama dir dengan bernilai dari variabel params.dir atau ASC.
                 */
                let dir = params.dir ? params.dir : `ASC`

                /*
                 * Jika variabel sort_old sama dengan variabel sort.
                 */
                if (sort_old == sort) {

                    /*
                     * Mengubah nilai dir menjadi ASC atau DESC.
                     */
                    dir = dir == `DESC` ? `ASC` : `DESC`

                /*
                 * Jika variabel sort_old tidak sama dengan variabel sort.
                 */
                }else {

                    /*
                     * Mengubah nilai dir menjadi ASC.
                     */
                    dir = `ASC`
                }

                /*
                 * Menghapus class bi-caret-up-fill dan mengganti dengan calass bi-caret-up pada eleemnt thead > th.
                 */
                $(`table#${ element } thead tr th i.bi-caret-up-fill`).removeClass(`bi-caret-up-fill`).addClass(`bi-caret-up`)

                /*
                 * Menghapus class bi-caret-down-fill dan mengganti dengan class bi-caret-down pada elemtn thead > th.
                 */
                $(`table#${ element } thead tr th i.bi-caret-down-fill`).removeClass(`bi-caret-down-fill`).addClass(`bi-caret-down`)

                /*
                 * Jika variabel dir sama dengan ASC.
                 */
                if (dir == 'ASC') {

                    /*
                     * Menghapus class bi-caret-up dan mengganti dengan class bi-caret-up-fill pada element thead > th.
                     */
                    $(`table#${ element } thead tr th[data-index='${ $(this).data('index') }'] i.bi-caret-up`).removeClass(`bi-caret-up`).addClass(`bi-caret-up-fill`)

                /*
                 * Jika veriabel dir tidak sama dengan ASC.
                 */
                }else {

                    /*
                     * Menghapus class bi-caret-down dan mengganti dengan class bi-caret-down-fill pada element thead > th.
                     */
                    $(`table#${ element } thead tr th[data-index='${ $(this).data('index') }'] i.bi-caret-down`).removeClass(`bi-caret-down`).addClass(`bi-caret-down-fill`)
                }

                /*
                 * Menambahkan key pada variabel options.data.
                 */
                options.data = {
                    sort: sort,
                    dir: dir
                }

                /*
                 * Melakukan pemanggilan fungsi _API dengan mengirimkan parameter baru.
                 */
                $(elementObject)._API({
                    data: {
                        sort: sort,
                        dir: dir
                    }
                })
            })

            /*
             * Mengembalikan nilai this element.
             */
            return this
        },

        /*
         * Fungsi untuk refresh data atau request kembali ke API.
         * Dan memiliki parameter newOptions.
         * Parameter options yang memiliki nilai array.
         * {
         *      key1: `nilai`,
         *      key2: `nilai`,
         *      key3: `nilai`,
         *      key[n]...
         * }
         *
         * Penggunaan fungsi ini dengan cara berikut:
         * const table = $(element).laravelTable(parameter)
         *
         * table.fresh({
         *      key1: `nilai`,
         *      key2: `nilai`,
         *      key3: `nilai`,
         *      key[n]...
         * })
         */
        fresh: function(newOptions) {

            /*
             * Melakukan pemanggilan fungsi _API dengan mengirimkan parameter baru.
             */
            $(this)._API({
                data: newOptions ? newOptions : {}
            })
        }
    })
} ( jQuery ))
