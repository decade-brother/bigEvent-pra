$(function() {
    const { form } = layui
    getCateList()
    let index

    function getCateList() {
        axios.get('/my/article/cates').then(res => {
            console.log(res);
            const htmlStr = template('tpl', res)
            $('tbody').html(htmlStr)
        })
    }
    $('.add-btn').click(function() {
        index = layer.open({
            type: 1,
            title: '添加文章',
            content: $('.add-form-container').html(),
            area: ['500px', '250px']
        });
    })
    $(document).on('submit', '.add-form', function(e) {
        e.preventDefault()
        axios.post('/my/article/addcates', $(this).serialize()).then(res => {
            layer.close(index)
            getCateList()
        })
    })
    $(document).on('click', '.edit-btn', function() {

        index = layer.open({
            type: 1,
            title: '添加文章',
            content: $('.add-form-container').html(),
            area: ['500px', '250px']
        });
        var id = $(this).data('id')

        axios.get(`/my/article/cates/${id}`).then(res => {
            if (res.status !== 0) {
                return layer.msg('获取文章失败')
            }
            // form.val('edit-form', res.data)
            debugger;
            form.val('edit-form', res.data);
            console.log(123);
        })
    })
})