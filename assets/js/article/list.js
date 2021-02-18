$(function() {
    //1.完成页面布局后，发送ajax请求，获取服务器数据，渲染table
    //1.1先定义一个全局参数，用来存储请求参数
    const { form, laypage } = layui
    const query = {
        pagenum: 1,
        pagesize: 2,
        cate_id: '',
        state: ''
    }
    getCastList()
        //1.页面一加载就获取服务器内的文章分类列表，封装一个函数
    function getCastList() {
        //1.2发送get请求，向服务端获取数据
        axios.get('/my/article/cates').then(res => {
            console.log(res);
            //1.3遍历返回的data数据，通过模板字符串渲染到页面
            res.data.forEach(item => {
                $('#cast-sel').append(`<option value="${item.Id}">${item.name}</option>`)
                    //layui插件内再渲染动态添加的form表单时，无法渲染至页面，根据文档需要手动渲染
                form.render(); //更新全部
            })

        })
    }

    //2.获取服务器数据，渲染table
    getTableList()

    function getTableList() {
        //2.1发送ajax请求，传入设置的query数据
        axios.get('/my/article/list', { params: query }).then(res => {
            console.log(res);
            //2.2将返回的值使用模板字符串渲染到页面
            const htmlStr = template('tpl', res)
            $('tbody').html(htmlStr)
            renderList(res.total)
        })
    }

    function renderList(total) {
        //2.3渲染页面分页
        laypage.render({
            elem: 'pagination', //注意，这里的 test1 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: query.pagesize,
            limits: [2, 3, 4, 5],
            curr: query.pagenum,
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            //当分页被切换时触发， 函数返回两个参数： obj（ 当前分页的所有选项值）、 first（ 是否首次， 一般用于初始加载的判断
            jump: function(obj, first) {
                //obj包含了当前分页的所有参数，比如：
                console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                console.log(obj.limit); //得到每页显示的条数
                query.pagenum = obj.curr
                query.pagesize = obj.limit
                    //首次不执行
                if (!first) {
                    //do something
                    getTableList()
                }
            }
        });
    }

    //3.筛选按钮绑定提交事件
    $('.list-form').submit(function(e) {
        e.preventDefault()
            //3.1获取input框内的val值重新赋值给查询参数
        query.cate_id = $('#cast-sel').val()
        query.state = $('#state').val()
            //3.2根据新获取的查询参数发送请求并渲染页面
        getTableList()
    })

    //4.给分页器按钮添加绑定事件，由于分页器是页面后添加上的，于是使用事件委托
    $(document).on('click', '.del-btn', function() {
            let id = $(this).data('id')
            layer.confirm('确认是否删除', {
                title: '提示',
                btn: ['是', '否'] //可以无限个按钮

            }, function(index, layero) {
                axios.get(`/my/article/delete/${id}`).then(res => {
                    console.log(id);
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败')
                    }
                    layer.msg('删除文章成功')
                    if ($('.del-btn').length == 1 && query.pagenum !== 1) {
                        query.pagenum = query.pagenum - 1
                    }


                    getTableList()
                    layer.close(index)
                })
            }, function(index) {
                layer.close(index)
                getTableList()
            });
        })
        //5.给编辑按钮绑定事件，也是事件委托
    $(document).on('click', '.edit-btn', function() {

        //5.1获取被点击那一条的id
        const id = $(this).data('id')

        //5.2点击编辑按钮后跳转，并把获取的id值放在url的查询参数内
        location.href = `./edit.html?id=${id}`
        window.parent.$('#edit-list').click()

    })


})