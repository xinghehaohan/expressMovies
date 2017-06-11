/**
 * Created by su on 17/6/11.
 */
$(function () {
    $('.delete').unbind('click').on('click',function (e) {
        var id = $(e.target).data('id');
        var tr = $('.item-id-'+id);
        var url='/admin/deleteList';
        $.ajax({
            url:url,
            type:'post',
            data:{
                id:id
            },
            dataType:'json',
            success:function (data) {
                console.log(data)
                if(data.success ==1){
                    if(tr){
                        tr.remove();
                    }
                }
            }
        })
    })
});
