$(function() {
    //7.获取点击编辑后跳转页面带过来的查询参数
    console.log(location.search);
    //7.1获取查询参数后，进行数据处理，获取id值
    const arr = location.search.slice(1).split('=')
    console.log(arr[1]);
    const id = arr[1]
        //8.封装一个函数，渲染页面从服务器获取的该id的数据


    function editArtList() {
        axios.get(`/my/article/${id}`).then(res => {

            //8.1使用layui方法，赋值整个表单
            form.val('edit-form', res.data)

            //2.从服务器获取相应数据后再去渲染文本域，引入了TinyMCE插件，在setup内可初始化文本域，可直接调用函数
            initEditor()

            //8.2手动将服务器获取的cover_img赋值给编辑页面的图片
            $image.cropper('replace', 'http://api-breakingnews-web.itheima.net' + res.data.cover_img)
        })
    }
    //定义全局变量，用于赋值
    let state = ''
    const { form } = layui
    //1.1调用页面加载文章分类列表函数
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

                //8.3在文章类别渲染至页面后，才调用函数，以防文章类别无法显示
                editArtList()
            })

        })
    }



    //3.裁剪框,引入cropper插件
    //3.1获取图片
    const $image = $('#image')
        //3.2使用cropper方法裁剪图片
    $image.cropper({
        //裁剪框的宽高比
        aspectRation: 400 / 280,
        //预览区域
        preview: '.img-preview'
    })

    //4.给选择封面按钮添加点击事件
    $('#choose-btn').click(function() {
        //选择封面按钮点击后，触发隐藏input框点击，可以上传文件
        $('#file').click()
    })

    //5.给file框绑定事件更换图片
    $('#file').change(function() {
        //5.1将上传的图片转为URL格式,这是原生方法，需要传入原生DOM元素
        const imageUrl = URL.createObjectURL(this.files[0])
            //5.2将封面的图片替换成上传的图片URL值；这里为什么不直接赋值给image的src属性呢？其实是可以直接赋值给封面图片的src的，但是这个插件给图片一个canvas画布，所以我们看不见，所以若想看见就必须destory画布，
        $image.cropper('replace', imageUrl)

    })
    $('.last-row button').click(function() {
        //6.3给两个按钮自定义state属性，，当哪个按钮被点击时，state便赋值
        console.log($(this).data('state'));
        state = $(this).data('state')
    })

    //6.点击发布或者存为草稿
    //6.1为from表单绑定提交事件
    $('.publish-form').submit(function(e) {
        e.preventDefault()

        //6.4获取cover_img属性
        $image.cropper('getCroppedCanvas', {
            width: 400,
            height: 280
        }).toBlob((blob) => {
            console.log(blob);
            //6.2获取form表单内现有的title，cate_id和content属性
            const fd = new FormData(this)

            //9.在fd中添加获取的Id属性
            fd.append('Id', id)
            fd.append('state', state)
                //6.5添加至fd内，至今已集齐
            fd.append('cover_img', blob)
                //9.1发送修改请求
            axios.post('/my/article/edit', fd).then(res => {
                if (res.status !== 0) {
                    return layer.msg('发布文章失败')
                }
                layer.msg('发布文章成功')

                location.href = './list.html'
                window.parent.$('#article-list').click()
            })
        })
    })




})