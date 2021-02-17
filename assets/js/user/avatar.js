$(function() {
    const { layer } = layui
    const $image = $('#image');

    $image.cropper({
        aspectRatio: 1,
        crop: function(event) {
            console.log(event.detail.x);
            console.log(event.detail.y);
        },
        preview: '.img-preview',

    });

    $('#upload-btn').click(function() {
        $('#file').click()
    })


    $('#file').change(function() {
        if (this.files.length == 0) {
            return layer.msg('请选择图片')
        }
        //将图片的src属性转成blob形式
        const dataUrl = URL.createObjectURL(this.files[0])
        console.log(dataUrl);
        $image.cropper('replace', dataUrl)
            // console.log(this.files[0].src);
            // $('#image').prop('src', this.files[0].src)
    })

    $('#save-btn').click(function() {
        //将图片转换为字符串
        const dataUrl = $image.cropper('getCroppedCanvas', {
            width: 100,
            height: 100
        }).toDataURL('image/jpeg')

        const search = new URLSearchParams()

        search.append('avatar', dataUrl)

        axios.post('/my/update/avatar', search).then(res => {
            if (res.status !== 0) {
                return layer.msg('头像更改失败')
            }
            layer.msg('头像更改成功')
                // window.parent.getPersonInfo()
        })


    })

})