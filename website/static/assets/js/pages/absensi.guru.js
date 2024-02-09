Vue.createApp({
    data() {
        return {
            date: '',
            year: '',
            datas: [],
            pagination: {},
            csrf: token,
        }
    },
    delimiters: ['[[', ']]'],
    mounted(){
        this.getDatas(1)
    },
    methods: {
        async getDatas(page){
            $.blockUI({
                message: '<div class="spinner-border text-white" role="status"></div>',
                css: {
                  backgroundColor: 'transparent',
                  border: '0'
                },
                overlayCSS: {
                  opacity: 0.5
                }
            })

            await axios.get(`/teachers-presences/get-data?page=${page}&date=${this.date}&year=${this.year}`)
                .then((result) => {
                    $.unblockUI();

                    var data = JSON.parse(result.data)
                    this.datas = data.data
                    this.pagination = data.pagination
                })
                .catch(() => {
                    $.unblockUI();
                    
                    Swal.fire({
                        icon: "warning",
                        text: "Gagal mengambil data!",
                        timer: 2000,
                        showConfirmButton: false,
                    })
                })
        },
        async deleteData(key, tanggal){
            Swal.fire({
                icon: "warning",
                html: 'Yakin mau hapus absen guru pada <b>' + tanggal + '</b>?',
                showCancelButton: true,
                confirmButtonText: "Yakin",
                cancelButtonText: "Batal",
            }).then( async (result) => {
                if (result.isConfirmed) {
                    $.blockUI({
                        message: '<div class="spinner-border text-white" role="status"></div>',
                        css: {
                        backgroundColor: 'transparent',
                        border: '0'
                        },
                        overlayCSS: {
                        opacity: 0.5
                        }
                    })

                    await axios.post('/teachers-presences/delete', {key: key}, { 
                        headers: { "X-CSRFToken": this.csrf }
                    })
                    .then(response => {
                        $.unblockUI();
                        Swal.fire({
                            icon: "success",
                            text: response.data.success,
                            timer: 2000,
                            showConfirmButton: false,
                        }).then(() => {
                            this.getDatas(1)
                        })
                    })
                    .catch(error => {
                        $.unblockUI();
                        Swal.fire({
                            icon: "error",
                            text: error.response.data.error,
                            timer: 2000,
                            showConfirmButton: false,
                        })
                    })
                }
            })
        },
        nextPage(){
            if(this.pagination.has_next){
                this.getDatas(this.pagination.current_page_number + 1)
            }
        },
        previousPage(){
            if(this.pagination.has_previous){
                this.getDatas(this.pagination.current_page_number - 1)
            }
        },
        async onDownload(){
            if(this.date != '' && this.year != ''){
                $.blockUI({
                    message: '<div class="spinner-border text-white" role="status"></div>',
                    css: {
                    backgroundColor: 'transparent',
                    border: '0'
                    },
                    overlayCSS: {
                    opacity: 0.5
                    }
                })

                try {
                    const response = await axios.get('/teachers-presences/download?month=' + this.date + '&year=' + this.year, { responseType: 'blob' });
            
                    // Mendapatkan nama kelas dan bulan dari respons
                    const contentDisposition = response.headers['content-disposition'];
                    const match = contentDisposition.match(/filename="Data Absen Guru - ([^"]+)"/);
                    const bulan = match[1];
                    
                    const url = window.URL.createObjectURL(new Blob([response.data]));
                    const link = document.createElement('a');
                    link.href = url;
                    
                    // Menentukan nama file sesuai dengan format yang diinginkan
                    link.setAttribute('download', `Data Absen Guru - ${bulan}`);
                    document.body.appendChild(link);
                    link.click();
                    $.unblockUI();
                } catch (error) {
                    $.unblockUI();
                    Swal.fire({
                        icon: "error",
                        text: "Gagal download laporan absensi!",
                        timer: 2000,
                        showConfirmButton: false,
                    });
                }
            } else {
                Swal.fire({
                    icon: "warning",
                    text: "Filter dahulu berdasarkan bulan dan tahun!",
                    timer: 2000,
                    showConfirmButton: false,
                })
            }
        },
    }
}).mount('#app')