$(document).ready(function(){
    // alert('modelisation')
    var inserMateriel = $('#formmodalassets')
    $(inserMateriel).on('submit', function(o){
        o.preventDefault()
        var sacados = $(this).serialize()
        var direction = $(this).attr('action')
        $.ajax({
            url:direction,
            type:'POST',
            data:sacados,
            datatype:'json',
            success:function(answer, stat){
                if (answer){
                    if (answer.success){
                        swal({
                            title: "Succès!",
                            text: answer.success,
                            buttons: false,
                            icon: "success",
                        });
                        setTimeout(function() {
                            swal.close();
                        }, 3000);
                    }else{
                        swal({
                            title: "Erreur",
                            text: "Erreur dans la réception de données",
                            buttons: false,
                            icon: "error",
                        });
                        setTimeout(function() {
                            swal.close();
                        }, 3000);
                    }
                    
                }else{
                    swal({
                        title: "Erreur",
                        text: "Une erreur dans le transfert de donées",
                        buttons: false,
                        icon: "error",
                    });
                    setTimeout(function() {
                        swal.close();
                    }, 3000);
                }
            }
        })
    })
})