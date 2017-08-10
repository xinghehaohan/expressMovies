/**
 * Created by su on 17/6/11.
 */

// $(document).ready(function () {
//     var body = document.getElementById('aniwrap');
//     var w = body.clientWidth;
//
//     function getStyle(){
//         var cssArr = [];
//         cssArr.push('opacity:'+(0.3+Math.random()*0.8));
//         var r = 0.25+Math.random()*0.8;
//         cssArr.push('transform:matrix('+r+',0,0,'+r+','+w*Math.random()+',0)');
//         cssArr.push('transition: all '+ (1.5+Math.random())+'s');
//         return cssArr.join(';');
//     }
//
//     function getText(){
//         return (32 + ~~(Math.random() * 1048576)).toString(2);
//     }
//
//     function p(num){
//         this.elems = new Array(num||1);
//         for (var i = 0; i < this.elems.length; i++) {
//             var elem = document.createElement('p');
//             elem.className = 'ani';
//             elem.innerText = getText();
//             body.appendChild(elem);
//             elem.style.cssText = getStyle();
//             this.elems[i] = elem;
//         }
//     }
//
//     for (var i = 0; i < 50; i++) {
//         setTimeout(function(){
//             new p(3);
//         },i * 100);
//     }
// });

$(function () {
    $('#moviesList').unbind('click').on('click','.delete',function (e) {
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
    });

    $('#userList').unbind('click').on('click','.delete',function (e) {
        var id = $(e.target).data('id');
        var tr = $('.item-id-'+id);
        var url='/admin/deleteUser';
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
